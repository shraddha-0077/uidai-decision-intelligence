
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDecisionIntelligence = async (dataSummary: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this anonymized Aadhaar data summary and provide a decision-ready insight for UIDAI administrators:
    ${dataSummary}
    
    The output must focus on:
    1. Why this matters to UIDAI policy.
    2. A specific, actionable recommendation.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          whyItMatters: { type: Type.STRING },
          recommendedAction: { type: Type.STRING },
          headline: { type: Type.STRING }
        },
        required: ["whyItMatters", "recommendedAction", "headline"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
