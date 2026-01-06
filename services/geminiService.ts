import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CineAnalysisResult, StoryboardResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Image Analysis Schema ---
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    cinematicPrompt: {
      type: Type.STRING,
      description: "Um prompt altamente detalhado, em inglês, otimizado para geradores de imagem (como Midjourney/DALL-E) descrevendo a cena da foto com estilo cinematográfico, lentes, iluminação e atmosfera.",
    },
    cameraAngles: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 sugestões de ângulos de câmera alternativos e criativos para reenquadrar esta cena (em português).",
    },
    lightingSuggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 sugestões de setup de iluminação para dramatizar a cena (em português).",
    },
    commercialIdeas: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Título curto do comercial" },
          synopsis: { type: Type.STRING, description: "Resumo da narrativa do comercial" },
          visualHook: { type: Type.STRING, description: "A cena chave que prenderia a atenção do espectador" },
        },
      },
      description: "2 ideias criativas de comerciais de TV ou Web baseados no contexto da imagem (em português).",
    },
  },
  required: ["cinematicPrompt", "cameraAngles", "lightingSuggestions", "commercialIdeas"],
};

// --- Storyboard Schema ---
const storyboardSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Título cinematográfico sugerido para a história" },
    logline: { type: Type.STRING, description: "Um resumo de uma frase da história (Logline)" },
    scenes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sceneHeader: { type: Type.STRING, description: "Cabeçalho da cena padrão de roteiro (Ex: EXT. RUA - NOITE)" },
          visualDescription: { type: Type.STRING, description: "Descrição visual da ação e ambiente (Português)" },
          shotType: { type: Type.STRING, description: "Tipo de plano (Ex: Close-up, Wide Shot, Dolly Zoom)" },
          jsonPrompt: {
            type: Type.OBJECT,
            description: "Objeto JSON contendo o prompt técnico para geração de imagem",
            properties: {
              positive: { type: Type.STRING, description: "Prompt positivo detalhado em INGLÊS (visuals, style, lighting, camera). DEVE seguir estritamente o estilo da imagem fornecida (se houver)." },
              negative: { type: Type.STRING, description: "Prompt negativo padrão (bad quality, distortion, text, watermark)" },
              camera: { type: Type.STRING, description: "Especificações da câmera (Ex: 35mm, f/1.8, Sony Venice)" },
              aspect_ratio: { type: Type.STRING, description: "Proporção sugerida (Ex: 16:9, 2.35:1)" }
            },
            required: ["positive", "negative", "camera", "aspect_ratio"]
          }
        },
        required: ["sceneHeader", "visualDescription", "shotType", "jsonPrompt"]
      }
    }
  },
  required: ["title", "logline", "scenes"]
};

export const analyzeImageForCinema = async (base64Image: string): Promise<CineAnalysisResult> => {
  try {
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64,
            },
          },
          {
            text: "Atue como um Diretor de Fotografia e Diretor Criativo premiado. Analise esta imagem e forneça uma desconstrução cinematográfica completa conforme o esquema JSON solicitado. Seja criativo, técnico e inspirador.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.7,
      },
    });

    const textResponse = response.text;
    if (!textResponse) throw new Error("Resposta vazia da IA.");
    return JSON.parse(textResponse) as CineAnalysisResult;
  } catch (error) {
    console.error("Erro na análise Gemini:", error);
    throw error;
  }
};

export const generateStoryboardFromText = async (
  story: string, 
  imageBase64?: string | null,
  analysisContext?: CineAnalysisResult | null
): Promise<StoryboardResult> => {
  try {
    const parts: any[] = [];

    // Add image if available
    if (imageBase64) {
      const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: cleanBase64,
        },
      });
    }

    let promptText = `Atue como um Diretor de Cinema e Storyboard Artist. Transforme a seguinte história/script em uma lista de cenas cinematográficas.
    
    INSTRUÇÕES CRUCIAIS:
    1. Gere ATÉ 20 CENAS (mínimo 5, máximo 20) para contar a história de forma fluida e detalhada.
    2. ESTILO VISUAL: Baseie-se ESTRITAMENTE na imagem fornecida (se houver) e nos dados de análise abaixo para manter a consistência visual (iluminação, paleta de cores, tipo de filme, atmosfera).
    
    `;

    if (analysisContext) {
      promptText += `\nDADOS DA ANÁLISE VISUAL (Contexto a ser mantido):
      - Prompt Original: ${analysisContext.cinematicPrompt}
      - Iluminação: ${analysisContext.lightingSuggestions.join(', ')}
      `;
    }

    promptText += `
    HISTÓRIA / SCRIPT DO USUÁRIO:
    "${story}"

    Para cada cena, crie um objeto JSON de prompt ('jsonPrompt') otimizado para geradores de imagem AI, mantendo a coerência com o estilo visual da imagem de referência.
    `;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: parts
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: storyboardSchema,
        temperature: 0.7,
        // Increased max tokens just in case, though usually handled by model defaults
      }
    });

    const textResponse = response.text;
    if (!textResponse) throw new Error("Resposta vazia da IA.");
    return JSON.parse(textResponse) as StoryboardResult;
  } catch (error) {
    console.error("Erro na geração de storyboard:", error);
    throw error;
  }
};