import OpenAI from "openai";

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  const { theme = "gentle adventure", choices = [] } = req.body || {};

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `
You are a calm, gentle story generator for an interactive adventure website.
Write a short, peaceful story scene. End with 2-3 choices.
Include a comforting Bible verse at the end if it is the final scene.

Story Theme: ${theme}
Previous Choices: ${JSON.stringify(choices)}

Return ONLY valid JSON:
{
  "text": "<story text>",
  "choices": ["<choice1>", "<choice2>", "<choice3>"],
  "isEnd": <true|false>,
  "verseReward": "<verse if isEnd true>"
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8
    });

    let scene;
    try {
      scene = JSON.parse(completion.choices[0].message.content);
    } catch {
      scene = {
        text: "Oops! Could not generate story. Try again.",
        choices: ["Restart"],
        isEnd: true,
        verseReward: ""
      };
    }

    res.status(200).json(scene);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      text: "Error connecting to GPT API.",
      choices: ["Retry"],
      isEnd: true,
      verseReward: ""
    });
  }
}
