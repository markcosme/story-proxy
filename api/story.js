import OpenAI from "openai";

// Read the API key from Vercel environment variable
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: "Tell me a comforting story for my girlfriend." }
      ],
      max_tokens: 200
    });

    res.status(200).json({ story: response.choices[0].message.content });
  } catch (error) {
    console.error("Error generating story:", error);
    res.status(500).json({ error: "Failed to generate story" });
  }
}
