const { GoogleGenerativeAI } = require('@google/generative-ai');
const pool = require('../config/db');

const askAI = async (req, res) => {
    try {
        const { message, subjectId, history } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey === 'your_gemini_api_key_here') {
            return res.status(500).json({ message: 'Gemini API Key is not configured on the server.' });
        }

        // Fetch course context if subjectId is provided
        let context = "";
        if (subjectId) {
            const [subjects] = await pool.execute('SELECT title, description FROM subjects WHERE id = ?', [subjectId]);
            if (subjects.length > 0) {
                context = `The student is currently studying the course: "${subjects[0].title}". Course Description: ${subjects[0].description}. `;
            }
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-flash-latest",
        });

        const systemMessage = `You are "LMS Pro AI", a helpful and expert learning assistant for the LMS Pro platform. 
            ${context}
            Your goal is to help students understand course material, explain complex concepts, and provide guidance. 
            Keep your answers concise, professional, and encouraging. If a student asks about something completely unrelated to learning or the course, politely steer them back to their studies.`;

        const fullPrompt = `${systemMessage}\n\nStudent asks: ${message}`;

        const chat = model.startChat({
            history: history || [],
        });

        const result = await chat.sendMessage(fullPrompt);
        const response = await result.response;
        const text = response.text();

        res.json({ message: text });
    } catch (error) {
        console.error('AI Error:', error);
        if (error.status === 429) {
            return res.status(429).json({ message: 'AI is currently busy (Quota exceeded). Please try again in 30 seconds.' });
        }
        res.status(500).json({ message: 'Failed to get response from AI. Please check your API key and network.' });
    }
};

module.exports = { askAI };
