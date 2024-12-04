import dotenv from 'dotenv';
import express from 'express';
import { message1, message2 } from './message';
import { reactBasePrompt } from './defaults/react';
import { nodeBasePrompt } from './defaults/node';
import cors from "cors"
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
dotenv.config();
app.use(cors())
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
            maxOutputTokens: 8000,
            temperature: 0.1,
        },
    });
    const answer = result.response.text().trim();
    if (answer.includes('react')) {
        res.json({
            prompts: [
                message2,
                `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
            ],
            uiPrompts: [reactBasePrompt],
        });

        return;
    }
    if (answer.includes('node')) {
        res.json({
            prompts: [
                `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
            ],
            uiPrompts: [nodeBasePrompt],
        });
        return;
    }
    res.status(403).json({
        message: "You can't access this",
        answer: answer,
    });
    return;
});

/*
example format for chat api :
 @dev 
{
  "messages": [
    {
      "role": "user",
      "parts": [
        {
          "text": "For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\nBy default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\nUse icons from lucide-react for logos.\n\nUse stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags."
        },
        {"text":"create react app using typescript make it todo app and use usestate"
        }
      ]
    }
  ]
}
*/

app.post('/chat', async (req, res) => {
    const messages = req.body.messages;
    if (!process.env.GEMINI_API_KEY) {
        throw Error('No api key found');
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent({
        contents: messages
    });

    console.log('✅ generated content : ', result.response.text().trim());

    res.json({
        result: result.response.text().trim(),
    });
});

app.listen(3000, () => {
    console.log('proj running on 3000');
});
