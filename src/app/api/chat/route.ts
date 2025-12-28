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
async function generateContentWithFallback(prompt: string): Promise<string> {
    const models = ["gemini-2.5-flash", "gemini-2.5-pro"];

    for (const model of models) {
        try {
            console.log(`🧠 Using Gemini model: ${model}`);

            const res = await ai.models.generateContent({
                model,
                contents: [
                    {
                        role: "user",
                        parts: [{ text: prompt }],
                    },
                ],
            });

            if (!res.text) throw new Error("Empty Gemini response");
            return res.text;
        } catch (err: any) {
            console.warn(`⚠️ Model ${model} failed: ${err.message}`);
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
        const lastMessage = messages?.[messages.length - 1];

        if (!lastMessage?.content) {
            return NextResponse.json(
                { error: "Invalid request payload" },
                { status: 400 }
            );
        }

        const userText: string = lastMessage.content;

        /* -------------------------------------------------------------- */
        /* Step 1: Symptom Extraction */
        /* -------------------------------------------------------------- */
        const extractionPrompt = `
You are a medical assistant.

Valid symptoms list:
${allSymptoms.join(", ")}

User Input:
"${userText}"

Task:
- Extract symptoms ONLY from the valid list
- Map synonyms to closest valid symptom
- Return ONLY a JSON array of strings
- No markdown, no explanation

Examples:
Input: "I have itching and a skin rash"
Output: ["itching", "skin_rash"]

Input: "I feel fine"
Output: []
`;

        let extractedSymptoms: string[] = [];

        try {
            const raw = await generateContentWithFallback(extractionPrompt);
            const clean = raw.replace(/```json|```/g, "").trim();

            extractedSymptoms = JSON.parse(clean);
        } catch (err) {
            console.warn("⚠️ Gemini extraction fallback used");

            extractedSymptoms = allSymptoms.filter((s) =>
                userText.toLowerCase().includes(s.replace(/_/g, " "))
            );
        }

        // Normalize + safety
        extractedSymptoms = Array.isArray(extractedSymptoms)
            ? extractedSymptoms.map((s) => s.trim().toLowerCase()).filter(Boolean)
            : [];

        console.log("✅ Extracted Symptoms:", extractedSymptoms);

        /* -------------------------------------------------------------- */
        /* Step 2: Python ML Backend */
        /* -------------------------------------------------------------- */
        let diseasePrediction = "Unknown";
        let predictionOk = false;
        let API_URL = process.env.NODE_ENV === "development" ?
            process.env.CHATBOT_API_DEV : process.env.CHATBOT_API_PROD;

        if (extractedSymptoms.length > 0) {
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 50_000);

                const res = await fetch(
                    `${API_URL}/predict`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ symptoms: extractedSymptoms }),
                        signal: controller.signal,
                    }
                );

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
        /* Step 3: Final Response */
        /* -------------------------------------------------------------- */
        const finalPrompt = predictionOk
            ? `
User input:
"${userText}"

Extracted symptoms:
${extractedSymptoms.join(", ")}

Predicted disease:
${diseasePrediction}

Respond empathetically.
Mention the disease as a possibility.
Give brief advice.
Strongly recommend consulting a doctor.
`
            : `
User input:
"${userText}"

Extracted symptoms:
${extractedSymptoms.join(", ")}

No confirmed prediction.
Acknowledge symptoms.
Provide general guidance.
Ask user to clarify if needed.
`;

        const botResponse = await generateContentWithFallback(finalPrompt);

        return NextResponse.json({
            role: "assistant",
            content: botResponse,
            meta: {
                symptoms: extractedSymptoms,
                prediction: diseasePrediction,
                model: predictionOk ? "ml+gemini" : "gemini-only",
            },
        });
    } catch (err: any) {
        console.error("🔥 Chat API Error:", err);
        return NextResponse.json(
            { error: "AI service unavailable" },
            { status: 500 }
        );
    }
}
