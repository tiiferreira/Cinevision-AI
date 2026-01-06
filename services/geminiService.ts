import type { GoogleGenAI } from "@google/genai";
import { CineAnalysisResult, StoryboardResult } from "../types";

const getApiKey = (): string | null => {
  if (typeof window !== 'undefined') {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey && storedKey.trim() && storedKey !== 'your_gemini_api_key_here') {
      return storedKey.trim();
    }
  }
  
  const envKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (envKey && envKey !== 'your_gemini_api_key_here') {
    return envKey;
  }
  
  return null;
};

export const setApiKey = (key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('gemini_api_key', key.trim());
    ai = null;
  }
};

export const hasApiKey = (): boolean => {
  return getApiKey() !== null;
};

let ai: GoogleGenAI | null = null;
let currentApiKey: string | null = null;

const getAI = async (): Promise<GoogleGenAI> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('API Key do Gemini não configurada. Por favor, insira sua API key na tela inicial.');
  }

  if (ai && currentApiKey === apiKey) {
    return ai;
  }

  try {
    const { GoogleGenAI } = await import("@google/genai");
    ai = new GoogleGenAI({ apiKey: apiKey });
    currentApiKey = apiKey;
    return ai;
  } catch (error) {
    console.error('Erro ao carregar GoogleGenAI:', error);
    throw new Error('Erro ao carregar o módulo do Gemini. Verifique sua conexão e tente novamente.');
  }
};

const detectMediaType = (base64Data: string): { mimeType: string; isVideo: boolean } => {
  if (base64Data.includes('data:')) {
    const mimeMatch = base64Data.match(/data:([^;]+);/);
    if (mimeMatch) {
      const mimeType = mimeMatch[1];
      return { mimeType, isVideo: mimeType.startsWith('video/') };
    }
  }
  
  return { mimeType: 'image/jpeg', isVideo: false };
};

export const analyzeImageForCinema = async (base64Media: string): Promise<CineAnalysisResult> => {
  try {
    const aiInstance = await getAI();
    const { Type } = await import("@google/genai");

    const analysisSchema = {
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

    const cleanBase64 = base64Media.split(',')[1] || base64Media;
    const { mimeType, isVideo } = detectMediaType(base64Media);
    
    const mediaType = isVideo ? 'vídeo' : 'imagem';
    const promptText = isVideo 
      ? "Atue como um Diretor de Fotografia e Diretor Criativo premiado. Analise este vídeo e forneça uma desconstrução cinematográfica completa conforme o esquema JSON solicitado. Foque nas cenas mais impactantes e na estética geral do vídeo. Seja criativo, técnico e inspirador."
      : "Atue como um Diretor de Fotografia e Diretor Criativo premiado. Analise esta imagem e forneça uma desconstrução cinematográfica completa conforme o esquema JSON solicitado. Seja criativo, técnico e inspirador.";

    const response = await aiInstance.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64,
            },
          },
          {
            text: promptText,
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
    const aiInstance = await getAI();
    const { Type } = await import("@google/genai");

    const storyboardSchema = {
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

    const parts: any[] = [];

    if (imageBase64) {
      const cleanBase64 = imageBase64.split(',')[1] || imageBase64;
      const { mimeType } = detectMediaType(imageBase64);
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: cleanBase64,
        },
      });
    }

    const hasMedia = !!imageBase64;
    const mediaType = hasMedia ? (imageBase64?.includes('video/') ? 'vídeo' : 'imagem') : '';
    
    let promptText = `Atue como um Diretor de Cinema e Storyboard Artist. Transforme a seguinte história/script em uma lista de cenas cinematográficas.
    
    INSTRUÇÕES CRUCIAIS:
    1. Gere ATÉ 20 CENAS (mínimo 5, máximo 20) para contar a história de forma fluida e detalhada.
    2. ESTILO VISUAL: Baseie-se ESTRITAMENTE na ${mediaType} fornecida (se houver) e nos dados de análise abaixo para manter a consistência visual (iluminação, paleta de cores, tipo de filme, atmosfera).
    
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

    const response = await aiInstance.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: parts
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: storyboardSchema,
        temperature: 0.7,
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