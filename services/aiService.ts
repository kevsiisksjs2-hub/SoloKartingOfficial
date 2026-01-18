
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
    
    const prompt = `Analiza esta planilla de resultados oficial de karting. 
    Tu tarea es extraer CADA piloto listado con su posición final (ranking), número de kart y nombre completo.
    REGLAS CRÍTICAS:
    1. Si el nombre está como 'ALVAREZ, Alexis', conviértelo a 'ALEXIS ALVAREZ'.
    2. Asegúrate de capturar el número de kart correctamente.
    3. Ignora filas vacías o encabezados.
    4. Devuelve el resultado exclusivamente en el formato JSON solicitado.`;

    try {
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
                ranking: { type: Type.INTEGER, description: "Posición final en la planilla" },
                number: { type: Type.STRING, description: "Número de kart/dorsal" },
                name: { type: Type.STRING, description: "Nombre completo del piloto" }
              },
              required: ["ranking", "number", "name"]
            }
          }
        }
      });

      return JSON.parse(response.text || '[]');
    } catch (e) {
      console.error("AI Extraction Error:", e);
      throw new Error("No se pudo procesar la imagen. Asegúrate de que el texto sea legible.");
    }
  }
};
