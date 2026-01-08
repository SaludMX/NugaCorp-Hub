import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAISupportResponse = async (userMessage: string, clientContext?: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: `Eres NugaBot, asistente de NugaCorp Wireless. 
      Cliente: ${clientContext?.name || 'Invitado'}. Estatus: ${clientContext?.status || 'Desconocido'}.
      Instrucciones: Conciso, profesional, empático, en español.`,
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Support Error:", error);
    return "Dificultades técnicas. Reintenta más tarde.";
  }
};

export const extractClientDataFromID = async (base64Image: string, mimeType: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: "Analiza este documento de identidad (INE o Pasaporte). Extrae el nombre completo, la dirección completa (si aparece) y el número de identificación. Devuelve la respuesta estrictamente en formato JSON con las llaves: 'name', 'address', 'id_number'. Si no encuentras algo, ponlo como string vacío.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            address: { type: Type.STRING },
            id_number: { type: Type.STRING },
          },
          required: ["name", "address", "id_number"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("ID Extraction Error:", error);
    return null;
  }
};