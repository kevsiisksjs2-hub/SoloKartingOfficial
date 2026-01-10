
import { GoogleGenAI, Type } from "@google/genai";

export const aiService = {
  /**
   * Genera una respuesta de chat fluida usando Gemini 3 Pro.
   */
  async chatMessage(history: { role: 'user' | 'model', parts: { text: string }[] }[], message: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: 'Eres un experto en Karting y asistente de la plataforma KDO (Karting Disciplina Oficial). Ayudas a los usuarios con dudas sobre inscripciones oficiales, circuitos federados y reglamentos técnicos KDO. Sé conciso, profesional y directo.',
      }
    });
    
    const result = await chat.sendMessage({ message });
    return result.text;
  },

  /**
   * Extrae rankings desde una imagen (foto de planilla) usando Gemini Vision.
   */
  async extractRankingsFromImage(base64Image: string, mimeType: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Analiza esta planilla de resultados oficial de KDO. 
    Extrae la lista de pilotos con su posición (ranking), número de kart y nombre completo.
    Devuelve ESTRICTAMENTE un arreglo JSON con objetos: {"ranking": número, "number": "string", "name": "string"}.
    IMPORTANTE: Si los nombres están como 'APELLIDO, NOMBRE', dales la vuelta a 'NOMBRE APELLIDO'. 
    No incluyas texto explicativo, solo el JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Image,
                mimeType: mimeType
              }
            }
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

    try {
      const text = response.text;
      return JSON.parse(text || '[]');
    } catch (e) {
      console.error("Error parsing AI response", e);
      return [];
    }
  }
};
