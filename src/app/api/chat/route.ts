import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { allSymptoms } from "./data";

/* ------------------------------------------------------------------ */
/* Gemini Client */
/* ------------------------------------------------------------------ */
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ GEMINI_API_KEY missing");
}

const ai = new GoogleGenAI({
    apiKey: apiKey!,
});

/* ------------------------------------------------------------------ */
/* Helper: Gemini with fallback */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* Helper: Gemini with fallback + History */
/* ------------------------------------------------------------------ */
async function generateWithHistory(
    systemInstruction: string,
    history: { role: string; parts: { text: string }[] }[]
): Promise<string> {
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"];

    for (const model of models) {
        try {
            const reqBody: any = {
                model,
                contents: history,
            };

            // Attempt to add system instruction if model supports it (1.5+ does)
            if (model.includes("1.5") || model.includes("2.0")) {
                reqBody.systemInstruction = { parts: [{ text: systemInstruction }] };
            } else {
                // Fallback: Prepend system instruction to the first message part
                if (history.length > 0 && history[0].role === "user") {
                    const firstMsg = { ...history[0], parts: [{ text: systemInstruction + "\n\n" + history[0].parts[0].text }] };
                    reqBody.contents = [firstMsg, ...history.slice(1)];
                } else {
                    // If no history or first is model, just prepend a user message
                    reqBody.contents = [{ role: "user", parts: [{ text: systemInstruction }] }, ...history];
                }
            }

            const res = await ai.models.generateContent(reqBody);

            if (res.text) return res.text;
        } catch (err: any) {
            console.warn(`⚠️ ${model} failed: ${err.message}`);
        }
    }

    throw new Error("All Gemini models failed");
}

/* ------------------------------------------------------------------ */
/* API Route */
/* ------------------------------------------------------------------ */
export async function POST(req: Request) {
    try {
        if (!apiKey) {
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        const { messages } = await req.json();
        const lastMessage = messages?.at(-1);

        if (!lastMessage?.content) {
            return NextResponse.json(
                { error: "Invalid request payload" },
                { status: 400 }
            );
        }

        const userText: string = lastMessage.content;

        /* -------------------------------------------------------------- */
        /* Step 1: Symptom Extraction (STRICT) */
        /* -------------------------------------------------------------- */
        const extractionPrompt = `
Extract symptoms strictly from this list:
${allSymptoms.join(", ")}

User input:
"${userText}"

Rules:
- Output ONLY a JSON array
- Use only symptoms from the list
- Map synonyms if needed
- If none found, return []

Examples:
"I have itching and a rash" → ["itching","skin_rash"]
"I feel fine" → []
`;

        let extractedSymptoms: string[] = [];

        try {
            // For extraction, we only need the immediate input
            const extractionHistory = [{ role: "user", parts: [{ text: extractionPrompt }] }];
            const raw = await generateWithHistory("You are a medical data extractor.", extractionHistory);

            extractedSymptoms = JSON.parse(
                raw.replace(/```json|```/g, "").trim()
            );
        } catch {
            extractedSymptoms = [];
        }

        // Strict filtering (VERY IMPORTANT)
        extractedSymptoms = extractedSymptoms
            .map((s) => s.trim().toLowerCase())
            .filter((s) => allSymptoms.includes(s));

        /* -------------------------------------------------------------- */
        /* Step 2: ML Backend */
        /* -------------------------------------------------------------- */
        const API_URL =
            process.env.NODE_ENV === "development"
                ? process.env.CHATBOT_API_DEV
                : process.env.CHATBOT_API_PROD;

        let diseasePrediction = "Unknown";
        let predictionOk = false;

        if (API_URL && extractedSymptoms.length > 0) {
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 15_000);

                const res = await fetch(`${API_URL}/predict`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ symptoms: extractedSymptoms }),
                    signal: controller.signal,
                });

                clearTimeout(timeout);

                if (res.ok) {
                    const data = await res.json();
                    diseasePrediction = data.prediction;
                    predictionOk = true;
                }
            } catch (err) {
                console.error("❌ ML backend error:", err);
            }
        }

        /* -------------------------------------------------------------- */
        /* Step 3: Final Response (Context Aware) */
        /* -------------------------------------------------------------- */

        const chatSystemInstruction = predictionOk
            ? `
Detected symptoms: ${extractedSymptoms.join(", ")}
Possible condition: ${diseasePrediction}

Your role:
- Respond in a calm, empathetic tone.
- Explain the possible condition (${diseasePrediction}) as a possibility, not a diagnosis.
- Recommend seeing a doctor.
- Keep responses short/concise (optimized for voice).
`
            : `
Detected symptoms: ${extractedSymptoms.join(", ") || "None clearly detected"}

Your role:
- Respond helpfully.
- If symptoms are unclear, ask for clarification.
- Avoid medical alarm.
- Keep responses short/concise (optimized for voice).
`;

        // Transform frontend messages to Gemini format
        // We rely on the Frontend to send a clean history array.
        // We map 'assistant' -> 'model'
        const history = messages.slice(0, -1).map((m: any) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }],
        }));

        // Add the current user message
        history.push({
            role: "user",
            parts: [{ text: userText }],
        });

        // Pass the system instruction + history
        const botResponse = await generateWithHistory(chatSystemInstruction, history);

        return NextResponse.json({
            role: "assistant",
            content: botResponse,
            meta: {
                symptoms: extractedSymptoms,
                prediction: diseasePrediction,
                mode: predictionOk ? "ml+gemini" : "gemini-only",
            },
        });
    } catch (err) {
        console.error("🔥 Chat API Error:", err);
        return NextResponse.json(
            { error: "AI service unavailable" },
            { status: 500 }
        );
    }
}
