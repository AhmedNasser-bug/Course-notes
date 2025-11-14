import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

// FIX: Conditionally initialize GoogleGenAI to avoid issues when API_KEY is missing.
let ai: GoogleGenAI | undefined;

if (!API_KEY) {
  console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
} else {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const generateSummary = async (noteContent: string): Promise<string> => {
  // FIX: Check for the initialized 'ai' instance directly.
  if (!ai) {
    return "API key not configured. Summary generation is disabled.";
  }
  
  try {
    const prompt = `Summarize the following notes concisely. Focus on the key takeaways and create a short, easy-to-digest summary. The summary should be a single paragraph.

Notes:
---
${noteContent}
---

Summary:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      // FIX: Simplified the 'contents' property for a text-only prompt, following Gemini API best practices.
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Could not generate summary due to an error.";
  }
};
