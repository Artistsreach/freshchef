import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

async function generatePexelsQuery(prompt: string): Promise<string> {
  const response = await genAI.models.generateContent({
    model: "gemini-1.5-flash",
    contents: prompt,
    config: {
      systemInstruction:
        "You are an expert at generating concise search queries for image platforms like Pexels. Based on the user's prompt, you will generate a 1-3 word search query that is likely to return a relevant background image.",
    },
  });

  return (response.text ?? "").trim();
}

export async function getPexelsImage(prompt: string): Promise<string | null> {
  try {
    const query = await generatePexelsQuery(prompt);
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&per_page=1`,
      {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY!,
        },
      }
    );

    if (!response.ok) {
      console.error("Pexels API error:", response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    if (data.photos && data.photos.length > 0) {
      return data.photos[0].src.large;
    }

    return null;
  } catch (error) {
    console.error("Error fetching Pexels image:", error);
    return null;
  }
}
