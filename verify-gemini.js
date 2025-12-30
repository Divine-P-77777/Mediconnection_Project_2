const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ GEMINI_API_KEY not found in .env.local");
        // Try .env as fallback
        require('dotenv').config({ path: '.env' });
        if (!process.env.GEMINI_API_KEY) {
            console.error("❌ GEMINI_API_KEY not found in .env either");
            return;
        }
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    try {
        console.log("Checking available models...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // Attempt a barebones generation to test access
        const result = await model.generateContent("Hello");
        console.log("✅ simple generation with gemini-1.5-flash SUCCESS");
        console.log("Response:", result.response.text());
    } catch (error) {
        console.error("❌ gemini-1.5-flash failed:", error.message);

        // Fallback: List all models
        console.log("\nListing all available models for this key:");
        // Note: older SDKs might not expose listModels easily directly on genAI, 
        // but let's try simply iterating known candidates if listModels isn't available
        // or use the model manager if accessible.
        // Actually, in the node SDK, finding models is raw REST or via separate call.
        // Let's just try gemini-pro and gemini-1.0-pro explicitly.

        const candidates = ["gemini-pro", "gemini-1.0-pro", "gemini-1.5-pro"];
        for (const m of candidates) {
            try {
                console.log(`Trying ${m}...`);
                const mod = genAI.getGenerativeModel({ model: m });
                await mod.generateContent("Hi");
                console.log(`✅ ${m} WORKS!`);
            } catch (e) {
                console.log(`❌ ${m} failed`);
            }
        }
    }
}

listModels();
