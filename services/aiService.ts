
import { GoogleGenAI, Type } from "@google/genai";

export const aiService = {
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
      config: { 
        systemInstruction: 'Eres el asistente oficial de KDO (Kart Disciplina Oficial). Tu objetivo es ayudar a los pilotos con inscripciones, reglamentos técnicos y calendarios de la asociación. Responde de forma profesional, breve y con terminología de karting.' 
      }
    });
    return response.text;
  },

  async parseRankings(rawText?: string, imageBase64?: string, mimeType?: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const parts: any[] = [];
    
    if (rawText) {
      parts.push({ text: `Analiza este texto que contiene un listado de pilotos. Extrae: ranking (posición), nombre completo, número de kart (dorsal), y licencias médica/deportiva si figuran.\n\nTexto: ${rawText}` });
    }
    
    if (imageBase64 && mimeType) {
      parts.push({
        inlineData: {
          data: imageBase64,
          mimeType: mimeType
        }
      });
      if (!rawText) {
        parts.push({ text: "Analiza esta imagen que contiene un listado de pilotos o planilla de ranking. Extrae en formato JSON: ranking (posición), nombre completo, número de kart (dorsal), y licencias médica/deportiva si figuran." });
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rankings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  number: { type: Type.STRING },
                  ranking: { type: Type.INTEGER },
                  medicalLicense: { type: Type.STRING },
                  sportsLicense: { type: Type.STRING }
                },
                required: ["name", "number", "ranking"]
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{"rankings": []}');
  },

  async parseLapByLap(rawText: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Extrae resultados de cronometraje vuelta por vuelta. Texto: ${rawText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            results: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  pos: { type: Type.INTEGER },
                  number: { type: Type.STRING },
                  name: { type: Type.STRING },
                  gap: { type: Type.STRING },
                  bestLap: { type: Type.STRING },
                  lapsHistory: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        lap: { type: Type.INTEGER },
                        time: { type: Type.STRING },
                        isPersonalBest: { type: Type.BOOLEAN }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{"results": []}');
  }
};
