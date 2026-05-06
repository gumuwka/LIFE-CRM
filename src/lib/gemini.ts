import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateContentIdea(topic: string, format: 'tiktok' | 'youtube') {
  if (!process.env.GEMINI_API_KEY) return null;

  const prompt = `
    Działasz jako kreatywny asystent dla twórcy internetowego "Gumskyy". 
    Persona: Twardy charakter, racjonalne podejście, piętnuje absurdy w sieci, "bezpieczna przystań" dla normalności.
    Zadanie: Przygotuj scenariusz dla treści typu ${format === 'tiktok' ? 'krótki pionowy (1 min)' : 'dłuższy film na YouTube (5-10 min)'}.
    Temat: ${topic}

    Zwróć odpowiedź w formacie JSON:
    {
      "title": "Tytuł",
      "description": "Opis",
      "scenario": "Pełny scenariusz z podziałem na sekcje",
      "features": ["emocja 1", "kluczowy fakt 2"],
      "thumbnailSuggestion": "Pomysł na miniaturkę"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
}
