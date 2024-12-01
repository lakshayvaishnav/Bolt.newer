import dotenv from 'dotenv';
import express from 'express';
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
dotenv.config();
app.use(express.json());

app.post('/template', async (req: any, res: any) => {
    const prompt = req.body.prompt;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent({
        contents: [
            {
                role: 'user',
                parts: [
                    {
                        text: prompt,
                    },
                ],
            },
        ],
        generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.1,
        },
    });

    const answer = result.response.text();
    console.log('✅ this is the answer : ', answer);
    return res.json({ 'message : ': answer });
});

app.listen(3000, () => {
    console.log('proj running on 3000');
});
