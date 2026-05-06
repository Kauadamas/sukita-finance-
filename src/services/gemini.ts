import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function getFinancialAdvice(context: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          text: `Você é o Agente Financeiro SUKITA. Analise o seguinte contexto financeiro do usuário e forneça dicas curtas, diretas e motivadoras em Português.
          
          Contexto: ${context}
          
          Responda em formato JSON:
          {
            "advice": "string",
            "alerts": ["string"],
            "suggestions": ["string"]
          }`
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      advice: "Não foi possível obter conselhos no momento.",
      alerts: [],
      suggestions: []
    };
  }
}
