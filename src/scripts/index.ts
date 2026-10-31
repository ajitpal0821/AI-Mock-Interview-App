import {
    GoogleGenAI,
    HarmBlockThreshold,
    HarmCategory,
    ThinkingLevel,
} from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;;
export const genAI = new GoogleGenAI({  apiKey});

export const model = "models/gemini-2.5-flash";
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
];

export const aiConfig = {
  generationConfig,
  safetySettings,
};

/**
 * Resilient AI generation with automatic model fallback
 * Tries modern Gemini Flash models in order of availability
 */
export const generateAIContent = async (prompt: string): Promise<string> => {
  const candidateModels = [
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    model,
    "models/gemini-1.5-flash",
  ];

  let lastError: any = null;

  for (const candidate of candidateModels) {
    try {
      const response = await genAI.models.generateContent({
        model: candidate,
        contents: prompt,
        config: aiConfig,
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`Model "${candidate}" failed, attempting fallback:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error("All candidate Gemini models failed to generate content.");
};
