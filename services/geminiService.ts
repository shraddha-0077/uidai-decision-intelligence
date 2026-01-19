
import { GoogleGenAI, Type } from "@google/genai";

export const generateDecisionIntelligence = async (dataSummary: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this anonymized Aadhaar data summary and provide a decision-ready insight for UIDAI administrators:
    ${dataSummary}
    
    The output must focus on:
    1. Why this matters to UIDAI policy.
    2. A specific, actionable recommendation.
    3. A human-readable justification for the recommendation.
    4. A data provenance note for audit/RTI disclosure (mentioning the data source and model logic).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          whyItMatters: { type: Type.STRING },
          recommendedAction: { type: Type.STRING },
          headline: { type: Type.STRING },
          justification: { type: Type.STRING },
          provenance: { type: Type.STRING }
        },
        required: ["whyItMatters", "recommendedAction", "headline", "justification", "provenance"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
