import type { GoogleGenAI } from "@google/genai";
import { CineAnalysisResult, StoryboardResult } from "../types";

const _a1 = (): string | null => {
  if (typeof window !== 'undefined') {
    const _k = localStorage.getItem('_k1');
    if (_k && _k.trim() && _k !== 'your_gemini_api_key_here') {
      return _k.trim();
    }
  }
  
  const _e = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (_e && _e !== 'your_gemini_api_key_here') {
    return _e;
  }
  
  return null;
};

export const setApiKey = (key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('_k1', key.trim());
    _a2 = null;
  }
};

export const hasApiKey = (): boolean => {
  return _a1() !== null;
};

let _a2: GoogleGenAI | null = null;
let _k2: string | null = null;

const _a3 = async (): Promise<GoogleGenAI> => {
  const _k3 = _a1();
  
  if (!_k3) {
    throw new Error('API Key do Gemini não configurada. Por favor, insira sua API key na tela inicial.');
  }

  if (_a2 && _k2 === _k3) {
    return _a2;
  }

  try {
    const { GoogleGenAI } = await import("@google/genai");
    _a2 = new GoogleGenAI({ apiKey: _k3 });
    _k2 = _k3;
    return _a2;
  } catch (error) {
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
    const aiInstance = await _a3();
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

    const modelsToTry = [
      "gemini-2.5-flash",
      "gemini-2.5-pro",
      "gemini-flash-latest",
      "gemini-pro-latest",
      "gemini-2.0-flash",
      "gemini-2.0-flash-001",
      "gemini-2.0-flash-exp"
    ];
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        const response = await aiInstance.models.generateContent({
          model: model,
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
      } catch (error: any) {
        lastError = error;
        
        if (error?.message?.includes('not found') || error?.message?.includes('404') || error?.status === 404) {
          continue;
        }
        
        throw error;
      }
    }

    throw lastError || new Error("Não foi possível analisar a imagem com nenhum modelo disponível.");
  } catch (error) {
    throw error;
  }
};

export const generateStoryboardFromText = async (
  story: string, 
  imageBase64?: string | null,
  analysisContext?: CineAnalysisResult | null
): Promise<StoryboardResult> => {
  try {
    if (story.length > 8000) {
      throw new Error("A história é muito longa. Por favor, encurte para no máximo 8000 caracteres.");
    }

    const aiInstance = await _a3();
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
    
    let promptText = `Você é um Diretor de Cinema e Storyboard Artist profissional. Transforme a história fornecida em uma lista de cenas cinematográficas detalhadas.

REGRAS IMPORTANTES:
1. Gere entre 5 e 20 cenas (ajuste conforme necessário para contar a história completa).
2. Cada cena deve ter: cabeçalho (formato padrão de roteiro), descrição visual, tipo de plano e prompt JSON para geração de imagem.
3. Mantenha consistência visual baseada na ${mediaType} fornecida (se houver).
4. Os prompts JSON devem ser detalhados e técnicos, em inglês, otimizados para geradores de imagem AI.
5. Certifique-se de que TODOS os campos obrigatórios estão preenchidos em cada cena.

`;

    if (analysisContext) {
      promptText += `CONTEXTO VISUAL DA ${mediaType.toUpperCase()} (mantenha este estilo):
- Estilo: ${analysisContext.cinematicPrompt.substring(0, 200)}...
- Iluminação sugerida: ${analysisContext.lightingSuggestions.slice(0, 2).join(', ')}

`;
    }

    promptText += `HISTÓRIA PARA TRANSFORMAR EM STORYBOARD:
"${story}"

IMPORTANTE: Retorne APENAS o JSON válido conforme o schema fornecido. Não inclua texto adicional fora do JSON.`;

    parts.push({ text: promptText });

    const modelsToTry = [
      "gemini-2.5-flash",
      "gemini-2.5-pro",
      "gemini-flash-latest",
      "gemini-pro-latest",
      "gemini-2.0-flash",
      "gemini-2.0-flash-001",
      "gemini-2.0-flash-exp"
    ];
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        const response = await aiInstance.models.generateContent({
          model: model,
          contents: {
            parts: parts
          },
          config: {
            responseMimeType: "application/json",
            responseSchema: storyboardSchema,
            temperature: 0.7,
          }
        });

        let textResponse: string | undefined;
        try {
          textResponse = response.text;
        } catch (e) {
          if (response && typeof response === 'object') {
            const responseAny = response as any;
            textResponse = responseAny.text || responseAny.response?.text || responseAny.candidates?.[0]?.content?.parts?.[0]?.text;
          }
        }

        if (!textResponse || textResponse.trim().length === 0) {
          throw new Error("Resposta vazia da IA.");
        }

        let parsedResult: StoryboardResult;
        try {
          parsedResult = JSON.parse(textResponse) as StoryboardResult;
        } catch (parseError) {
          throw new Error("Resposta da IA não está em formato JSON válido.");
        }

        if (!parsedResult.title || !parsedResult.logline || !parsedResult.scenes || !Array.isArray(parsedResult.scenes)) {
          throw new Error("Resposta da IA não contém a estrutura esperada (title, logline, scenes).");
        }

        if (parsedResult.scenes.length === 0) {
          throw new Error("A IA não gerou nenhuma cena.");
        }

        return parsedResult;
      } catch (error: any) {
        lastError = error;
        
        if (error?.message?.includes('not found') || 
            error?.message?.includes('404') || 
            error?.status === 404 ||
            error?.statusCode === 404 ||
            error?.code === 'NOT_FOUND') {
          continue;
        }
        
        if (error?.status === 429 || 
            error?.statusCode === 429 ||
            error?.code === 'RESOURCE_EXHAUSTED' ||
            error?.message?.includes('quota') ||
            error?.message?.includes('429')) {
          if (model === modelsToTry[modelsToTry.length - 1]) {
            throw new Error("Quota da API excedida. Aguarde alguns minutos ou verifique seu plano de uso no Google AI Studio.");
          }
          continue;
        }
        
        if (error?.status === 401 || 
            error?.statusCode === 401 ||
            error?.code === 'UNAUTHENTICATED' ||
            error?.message?.includes('API key') ||
            error?.message?.includes('authentication')) {
          throw new Error("Erro de autenticação. Verifique sua API Key do Gemini.");
        }
        
        throw error;
      }
    }

    throw lastError || new Error("Não foi possível gerar o storyboard com nenhum modelo disponível.");
  } catch (error: any) {
    let errorMessage = "Falha ao gerar o storyboard. ";
    
    if (error?.message) {
      if (error.message.includes("quota") || error.message.includes("Quota") || error.message.includes("429")) {
        errorMessage += "Quota da API excedida. Aguarde alguns minutos ou verifique seu plano de uso no Google AI Studio (https://ai.dev/usage).";
      } else if (error.message.includes("API Key") || error.message.includes("autenticação")) {
        errorMessage += "Verifique sua API Key do Gemini.";
      } else if (error.message.includes("JSON")) {
        errorMessage += "A resposta da IA não está no formato esperado. Tente novamente.";
      } else if (error.message.includes("vazia")) {
        errorMessage += "A IA não retornou uma resposta. Tente encurtar a história ou tente novamente.";
      } else if (error.message.includes("estrutura")) {
        errorMessage += "A resposta não contém todas as informações necessárias. Tente novamente.";
      } else if (error.message.includes("nenhuma cena")) {
        errorMessage += "Nenhuma cena foi gerada. Tente encurtar a história ou tente novamente.";
      } else if (error.message.includes("not found") || error.message.includes("404")) {
        errorMessage += "Modelo não encontrado. Verifique se sua API Key tem acesso aos modelos do Gemini.";
      } else {
        errorMessage += error.message;
      }
    } else {
      errorMessage += "Tente encurtar a história ou tente novamente.";
    }
    
    const enhancedError = new Error(errorMessage);
    (enhancedError as any).originalError = error;
    throw enhancedError;
  }
};