const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * @param {string} prompt
 * @param {object} options - opsional (maxOutputTokens, temperature)
 * @returns {Promise<string>}
 */

async function generateText(prompt, options = {}) {
    if(!process.env.GEMINI_API_KEY){
        throw new Error("Gemini API key belum dikonfigurasi.");
    }

    if(!prompt || typeof prompt !== "string"){
        throw new Error("Prompt harus berupa string.");
    }

    const model = genAI.getGenerativeModel({
        model: options.model || "gemini-3.6-flash"
    });

    const result = await model.generateContent({
        contents: [{
            role: "user",
            parts: [{ text: prompt }]
        }],
        generationConfig: {
            temperature: options.temperature ?? 0.4,
            maxOutputTokens: options.maxOutputTokens ?? 4096
        }
    });

    const text = result.response.text();
    return text.trim();
}

module.exports = { generateText };