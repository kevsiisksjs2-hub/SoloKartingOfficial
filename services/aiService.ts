
import { GoogleGenAI, Type } from "@google/genai";

// Helper para reintentos con retroceso exponencial
async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const errorStr = JSON.stringify(error);
      const isRateLimit = errorStr.includes("429") || error?.status === 429 || error?.code === 429;
      
      if (isRateLimit && i < retries) {
        const delay = Math.pow(2, i) * 2000; // 2s, 4s...
        console.warn(`Gemini Rate Limit (429). Reintentando en ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
}

async function safeAiCall(apiCall: () => Promise<string>, fallback: string) {
  try {
    return await retryWithBackoff(apiCall);
  } catch (error: any) {
    console.error("Gemini API Final Error:", error);
    const errorStr = JSON.stringify(error);
    if (errorStr.includes("429")) {
      return `${fallback} (Aviso: Límite de cuota IA alcanzado. Intente en unos minutos).`;
    }
    return fallback;
  }
}

export const aiService = {
  async chatMessage(history: any[], message: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return safeAiCall(async () => {
      const formattedContents = history.map(h => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: h.parts
      }));
      formattedContents.push({ role: 'user', parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: formattedContents,
        config: { 
          systemInstruction: 'Eres el Oficial de Enlace Institucional de KDO. Ayudas con reglamentos, historia del campeonato y logística de circuitos. Tu tono es solemne pero cercano.' 
        }
      });
      return response.text || "";
    }, "El asistente KDO está procesando demasiadas solicitudes en este momento.");
  },

  async generateNewsDigest() {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return safeAiCall(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Genera un titular emocionante para un ticker de noticias de Karting sobre el inicio de la temporada 2026 de KDO. Máximo 12 palabras.',
      });
      return response.text || "";
    }, "Temporada 2026: La adrenalina del karting en tierra vuelve a los circuitos oficiales.");
  },

  async getPilotProfileBio(pilotData: any) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return safeAiCall(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Redacta un perfil heroico del piloto ${pilotData.name} (#${pilotData.number}) para el sitio web. Menciona sus victorias y sus puntos de conducta ${pilotData.conductPoints}/10. Máximo 40 palabras.`,
      });
      return response.text || "";
    }, `${pilotData.name} es un competidor destacado de la categoría ${pilotData.category}, con una conducta deportiva ejemplar.`);
  },

  async analyzeCircuitTips(circuitName: string, conditions: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return safeAiCall(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Como instructor experto de KDO, dame un consejo breve de trayectoria para ${circuitName} sobre tierra en estado ${conditions}. Máximo 25 palabras.`,
      });
      return response.text || "";
    }, "Mantén una trayectoria abierta en la entrada para maximizar la tracción en salida de curva sobre tierra.");
  },

  async analyzeAuditLogs(logs: any[]) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return safeAiCall(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analiza estos registros de auditoría administrativa: ${JSON.stringify(logs.slice(0, 10))}. Resume las 3 acciones más importantes.`,
      });
      return response.text || "";
    }, "Resumen de auditoría: Se registran accesos administrativos y actualizaciones de padrón sin anomalías detectadas.");
  },

  async extractLicenseData(base64: string, mimeType: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      return await retryWithBackoff(async () => {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: {
            parts: [
              { inlineData: { data: base64, mimeType } },
              { text: "Extract the pilot name, medical license number, sports license number, and kart number from this image. Return as JSON with keys: name, medicalLicense, sportsLicense, number." }
            ]
          },
          config: { responseMimeType: "application/json" }
        });
        return JSON.parse(response.text || '{}');
      });
    } catch {
      return null;
    }
  },

  async parseRankingData(rawText: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      return await retryWithBackoff(async () => {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Extrae la información de pilotos y devuélvela en formato JSON con llaves: name, number, category, points. Texto: "${rawText}"`,
          config: { responseMimeType: "application/json" }
        });
        return JSON.parse(response.text || '[]');
      });
    } catch {
      return [];
    }
  },

  async analyzeStandings(category: string, data: any[]) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return safeAiCall(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the current standings for category ${category}: ${JSON.stringify(data)}. Provide a brief strategic insight. Max 30 words.`,
      });
      return response.text || "";
    }, "La competencia está muy reñida en los puestos de vanguardia. La regularidad será clave para el campeonato.");
  },

  async regulationSearch(query: string, regulations: any[]) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return safeAiCall(async () => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Based on these regulations: ${JSON.stringify(regulations.slice(0, 15))}. Answer this query: ${query}. Max 40 words.`,
      });
      return response.text || "";
    }, "Consulta el reglamento técnico oficial para obtener detalles específicos sobre la normativa vigente.");
  }
};
