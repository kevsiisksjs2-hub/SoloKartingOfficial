
import { GoogleGenAI, Type } from "@google/genai";

export const aiService = {
  // Use generateContent directly as per guidelines
  async chat(message: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: message,
      config: { systemInstruction: 'Eres el asistente oficial de KDO. Ayudas con inscripciones y reglamentos técnicos de karting.' }
    });
    return response.text;
  },

  // Added chatMessage to handle history from AIChatBot
  async chatMessage(history: { role: string; parts: { text: string }[] }[], message: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const formattedContents = history.map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: h.parts
    }));
    
    formattedContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: formattedContents,
      config: { systemInstruction: 'Eres el asistente oficial de KDO. Ayudas con inscripciones y reglamentos técnicos de karting.' }
    });
    return response.text;
  },

  async extractRankings(base64: string, mime: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { 
          parts: [
            { text: "Extrae: posición (ranking), número de kart (number), nombre del piloto (name). JSON array." }, 
            { inlineData: { data: base64, mimeType: mime } }
          ] 
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              ranking: { type: Type.INTEGER },
              number: { type: Type.STRING },
              name: { type: Type.STRING }
            },
            required: ["ranking", "number", "name"]
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  }
};
