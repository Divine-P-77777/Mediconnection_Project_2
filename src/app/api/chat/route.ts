import OpenAI from "openai";
import { NextResponse } from "next/server";
import { allSymptoms } from "./data";

/* ------------------------------------------------------------------ */
/* OpenAI (GitHub Marketplace – Fine-Grained Token) */
/* ------------------------------------------------------------------ */
const apiKey = process.env.GITHUB_TOKEN_FINE;

if (!apiKey) {
    console.error("❌ GITHUB_TOKEN_FINE missing");
}

const client = new OpenAI({
    apiKey,
    baseURL: "https://models.github.ai/inference",
});

/* ------------------------------------------------------------------ */
/* Helper: GPT with fallback + History */
/* ------------------------------------------------------------------ */
async function generateWithHistory(
    systemInstruction: string,
    history: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
    const models = ["openai/gpt-4.1", "openai/gpt-4o-mini"];
    const errors: string[] = [];

    for (const model of models) {
        try {
            const res = await client.chat.completions.create({
                model,
                temperature: 0.3,
                messages: [
                    { role: "system", content: systemInstruction },
                    ...history,
                ],
            });

            const text = res.choices?.[0]?.message?.content;
            if (text) return text;
        } catch (err: any) {
            console.warn(`⚠️ ${model} failed: ${err.message}`);
            errors.push(`${model}: ${err.message}`);
        }
    }

    console.error("All GPT models failed:", errors);
    throw new Error("All GPT models failed");
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
        /* Step 1: Symptom Extraction (STRICT JSON) */
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
            const raw = await generateWithHistory(
                "You are a medical data extractor. Return STRICT JSON only.",
                [{ role: "user", content: extractionPrompt }]
            );

            extractedSymptoms = JSON.parse(
                raw.replace(/```json|```/g, "").trim()
            );
        } catch {
            extractedSymptoms = [];
        }

        // HARD FILTER (VERY IMPORTANT)
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
- Respond in a calm, empathetic tone
- Explain this as a POSSIBILITY, not a diagnosis
- Recommend seeing a doctor
- Keep responses short and voice-optimized
`
            : `
Detected symptoms: ${extractedSymptoms.join(", ") || "None clearly detected"}

Your role:
- Respond helpfully
- Ask for clarification if symptoms are unclear
- Avoid medical alarm
- Keep responses short and voice-optimized
`;

        // Map frontend messages → OpenAI format
        const history = messages.map((m: any) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
        }));

        const botResponse = await generateWithHistory(
            chatSystemInstruction,
            history
        );

        return NextResponse.json({
            role: "assistant",
            content: botResponse,
            meta: {
                symptoms: extractedSymptoms,
                prediction: diseasePrediction,
                mode: predictionOk ? "ml+gpt" : "gpt-only",
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
