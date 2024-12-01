require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function main() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = "create a simple todo application in nextjs";

  const result = await model.generateContentStream(prompt);

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    process.stdout.write(chunkText);

  }
}

main();
