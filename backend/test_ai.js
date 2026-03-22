const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API key found in .env");
        return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    try {
        // Unfortunately the SDK doesn't have a direct listModels method that's easy to use without the client 
        // But we can try to hit a known model and check the error or use fetch if we had it.
        // Actually, let's just try gemini-1.5-flash again with the latest string.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("test");
        console.log("Success with gemini-1.5-flash");
    } catch (e) {
        console.error("Failed with gemini-1.5-flash:", e.message);
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent("test");
            console.log("Success with gemini-pro");
        } catch (e2) {
            console.error("Failed with gemini-pro:", e2.message);
        }
    }
}

listModels();
