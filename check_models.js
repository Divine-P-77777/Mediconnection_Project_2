const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });
if (!process.env.GEMINI_API_KEY) {
    require('dotenv').config({ path: '.env' });
}

async function checkModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ No API Key found");
        return;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (!response.ok) {
            console.error(`❌ HTTP Error: ${response.status}`);
            return;
        }

        const data = await response.json();
        const models = data.models || [];
        const modelNames = models.map(m => m.name);

        console.log("Checking for standard models:");
        const targets = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro", "gemini-1.5-pro"];

        let foundAny = false;
        targets.forEach(t => {
            const match = modelNames.find(n => n.endsWith(t));
            if (match) {
                console.log(`✅ FOUND: ${match}`);
                foundAny = true;
            } else {
                console.log(`❌ MISSING: ${t}`);
            }
        });

        if (!foundAny) {
            console.log("⚠️ No standard text generation models found! Available models:");
            console.log(modelNames.filter(n => n.includes("gemini")).join("\n"));
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

checkModels();
