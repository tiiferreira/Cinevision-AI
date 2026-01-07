import React, { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import AnalysisResult from './components/AnalysisResult';
import StoryInput from './components/StoryInput';
import StoryboardResultComponent from './components/StoryboardResult';
import ApiKeyScreen from './components/ApiKeyScreen';
import { analyzeImageForCinema, generateStoryboardFromText, hasApiKey, setApiKey } from './services/geminiService';
import { AppState, CineAnalysisResult, StoryboardResult, ActiveTab } from './types';
import { Sparkles, AlertCircle, Image as ImageIcon, BookOpen } from 'lucide-react';
import { gsap } from 'gsap';
import { useTheme } from './hooks/useTheme';
import { useVantaBackground } from './hooks/useVantaBackground';
import { useGyroPermission } from './hooks/useGyroPermission';

const App: React.FC = () => {
  const { colors } = useTheme();
  const vantaRef = useRef<HTMLDivElement>(null);
  const { hasPermission, needsPermission, requestPermission } = useGyroPermission();
  useVantaBackground(vantaRef);
  const [hasApiKeyConfigured, setHasApiKeyConfigured] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('image');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageResult, setImageResult] = useState<CineAnalysisResult | null>(null);
  const [storyResult, setStoryResult] = useState<StoryboardResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasApiKeyConfigured(hasApiKey());
  }, []);

  useEffect(() => {
    if (hasApiKeyConfigured && titleRef.current) {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: -30,
        duration: 1,
        ease: 'power3.out'
      });
    }
  }, [hasApiKeyConfigured]);

  useEffect(() => {
    if (tabsRef.current) {
      gsap.from(tabsRef.current.children, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.3
      });
    }
  }, []);

  const handleApiKeySet = (apiKey: string) => {
    setApiKey(apiKey);
    setHasApiKeyConfigured(true);
  };

  const handleOpenSettings = () => {
    if (window.confirm('Deseja alterar a API Key? Você precisará inserir uma nova chave.')) {
      localStorage.removeItem('gemini_api_key');
      setHasApiKeyConfigured(false);
    }
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setAppState(AppState.IDLE);
    setErrorMsg(null);
    if ((tab === 'image' && imageResult) || (tab === 'story' && storyResult)) {
        setAppState(AppState.SUCCESS);
    }
  };

  const handleImageSelected = useCallback(async (base64Image: string) => {
    setAppState(AppState.ANALYZING);
    setCurrentImage(base64Image);
    setErrorMsg(null);
    setImageResult(null);

    try {
      const data = await analyzeImageForCinema(base64Image);
      setImageResult(data);
      setAppState(AppState.SUCCESS);
    } catch (err) {
      console.error(err);
      setAppState(AppState.ERROR);
      setErrorMsg("Falha ao analisar a imagem. Por favor, tente novamente.");
    }
  }, []);

  const handleStorySubmit = useCallback(async (story: string) => {
    setAppState(AppState.ANALYZING);
    setErrorMsg(null);
    setStoryResult(null);

    try {
      // Valida se a história não está vazia
      if (!story || story.trim().length < 10) {
        throw new Error("A história deve ter pelo menos 10 caracteres.");
      }

      const data = await generateStoryboardFromText(story, currentImage, imageResult);
      setStoryResult(data);
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      console.error("Erro ao gerar storyboard:", err);
      setAppState(AppState.ERROR);
      
      // Usa a mensagem de erro melhorada do serviço, ou uma mensagem padrão
      const errorMessage = err?.message || "Falha ao gerar o storyboard. Tente encurtar a história ou tente novamente.";
      setErrorMsg(errorMessage);
    }
  }, [currentImage, imageResult]);

  if (!hasApiKeyConfigured) {
    return <ApiKeyScreen onApiKeySet={handleApiKeySet} />;
  }

  return (
    <div 
      className="min-h-screen transition-colors duration-300 relative overflow-hidden"
      style={{ 
        color: 'var(--theme-text)'
      }}
    >
      <div 
        ref={vantaRef}
        className="fixed inset-0 z-0 w-full h-full"
        style={{ 
          backgroundColor: 'var(--theme-background)',
          minHeight: '100vh',
          minWidth: '100vw'
        }}
      />
      <div className="scan-line" />
      {needsPermission && !hasPermission && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div 
            className="px-4 py-2 rounded-lg border flex items-center gap-2 shadow-lg"
            style={{
              backgroundColor: 'rgba(var(--theme-secondary-rgb), 0.9)',
              borderColor: 'var(--theme-accent)',
              color: 'var(--theme-text)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <p className="text-sm">Ative o movimento do fundo:</p>
            <button
              onClick={async () => {
                const granted = await requestPermission();
                if (granted && vantaRef.current) {
                  const hexToInt = (hex: string): number => {
                    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                    return result ? parseInt(result[1] + result[2] + result[3], 16) : 0x0;
                  };
                  if ((window as any).VANTA && (window as any).THREE) {
                    const vantaEffect = (window as any).VANTA.NET({
                      el: vantaRef.current,
                      mouseControls: true,
                      touchControls: true,
                      gyroControls: true,
                      minHeight: 200.00,
                      minWidth: 200.00,
                      scale: 1.00,
                      scaleMobile: 1.00,
                      color: hexToInt(colors.accent),
                      backgroundColor: hexToInt(colors.background),
                      points: 10.00,
                      maxDistance: 20.00,
                      spacing: 15.00,
                      showDots: true
                    });
                  }
                }
              }}
              className="px-3 py-1 rounded text-xs font-semibold transition-all duration-300"
              style={{
                backgroundColor: 'var(--theme-accent)',
                color: 'var(--theme-background)'
              }}
            >
              Ativar
            </button>
          </div>
        </div>
      )}
      <div className="relative z-10">
        <Header onSettingsClick={handleOpenSettings} />

      <main className="container mx-auto px-4 py-8 pb-24">
        
        <div className="text-center mb-8 space-y-4 max-w-2xl mx-auto">
          <h1 
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold tracking-tighter transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, var(--theme-text) 0%, var(--theme-accent) 50%, var(--theme-text) 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: `drop-shadow(0 0 20px rgba(var(--theme-accent-rgb), 0.5))`,
              lineHeight: '1.2',
              paddingBottom: '0.2em',
              display: 'inline-block'
            }}
          >
            {activeTab === 'image' ? "Visão Cinematográfica" : "Roteiro para Cena"}
          </h1>
          <p className="text-lg" style={{ color: 'var(--theme-text)', opacity: 0.8 }}>
            {activeTab === 'image' 
              ? "Transforme fotos em prompts de Hollywood e ideias de comerciais."
              : "Transforme sua história em um storyboard detalhado com prompts JSON."
            }
          </p>
        </div>

        <div ref={tabsRef} className="flex justify-center mb-10">
          <div 
            className="p-1 rounded-full flex gap-1 shadow-2xl overflow-hidden"
            style={{ 
              backgroundColor: 'var(--theme-secondary)',
              border: `1px solid var(--theme-accent)`,
              boxShadow: `0 0 30px rgba(var(--theme-accent-rgb), 0.3)`
            }}
          >
            <button
              onClick={() => handleTabChange('image')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 relative ${
                activeTab === 'image' ? '' : 'hover:scale-105'
              }`}
              style={activeTab === 'image' 
                ? {
                    backgroundColor: 'var(--theme-accent)',
                    color: 'var(--theme-background)',
                    boxShadow: `inset 0 0 10px rgba(var(--theme-accent-rgb), 0.3)`
                  }
                : {
                    color: 'var(--theme-text)',
                    opacity: 0.7,
                    border: 'none'
                  }
              }
              onMouseEnter={(e) => {
                if (activeTab !== 'image') {
                  gsap.to(e.currentTarget, {
                    opacity: 1,
                    scale: 1.05,
                    duration: 0.2
                  });
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'image') {
                  gsap.to(e.currentTarget, {
                    opacity: 0.7,
                    scale: 1,
                    duration: 0.2
                  });
                }
              }}
            >
              <ImageIcon className="w-4 h-4" /> Análise de Imagem
            </button>
            <button
              onClick={() => handleTabChange('story')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 relative ${
                activeTab === 'story' ? '' : 'hover:scale-105'
              }`}
              style={activeTab === 'story' 
                ? {
                    backgroundColor: 'var(--theme-accent)',
                    color: 'var(--theme-background)',
                    boxShadow: `inset 0 0 10px rgba(var(--theme-accent-rgb), 0.3)`
                  }
                : {
                    color: 'var(--theme-text)',
                    opacity: 0.7,
                    border: 'none'
                  }
              }
              onMouseEnter={(e) => {
                if (activeTab !== 'story') {
                  gsap.to(e.currentTarget, {
                    opacity: 1,
                    scale: 1.05,
                    duration: 0.2
                  });
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'story') {
                  gsap.to(e.currentTarget, {
                    opacity: 0.7,
                    scale: 1,
                    duration: 0.2
                  });
                }
              }}
            >
              <BookOpen className="w-4 h-4" /> Criar Cenas (JSON)
            </button>
          </div>
        </div>

        <div className="min-h-[400px]">
          
          <div className={`${appState === AppState.SUCCESS ? 'hidden md:block' : 'block'}`}>
            {activeTab === 'image' && (
               <ImageUploader 
                 onImageSelected={handleImageSelected} 
                 isLoading={appState === AppState.ANALYZING} 
               />
            )}
            {activeTab === 'story' && (
              <StoryInput 
                onStorySubmit={handleStorySubmit}
                isLoading={appState === AppState.ANALYZING}
                hasActiveContext={!!currentImage}
              />
            )}
          </div>

          {appState === AppState.ANALYZING && (
            <div className="flex flex-col items-center justify-center py-12 animate-pulse">
              <Sparkles 
                className="w-8 h-8 mb-4" 
                style={{ color: 'var(--theme-accent)' }}
              />
              <p style={{ color: 'var(--theme-text)', opacity: 0.7 }}>
                {activeTab === 'image' 
                  ? "A inteligência artificial está estudando a cena..."
                  : "Escrevendo as cenas e gerando prompts..."
                }
              </p>
            </div>
          )}

          {appState === AppState.ERROR && (
            <div 
              className="max-w-md mx-auto p-4 rounded-lg flex items-center gap-3 mt-8 border"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                color: '#fca5a5'
              }}
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}

          {appState === AppState.SUCCESS && (
            <div className="mt-8">
              {activeTab === 'image' && imageResult && (
                <AnalysisResult data={imageResult} />
              )}
              {activeTab === 'story' && storyResult && (
                <StoryboardResultComponent data={storyResult} />
              )}
            </div>
          )}
        </div>
      </main>
      
      <footer 
        className="fixed bottom-0 left-0 right-0 py-4 text-center text-sm border-t z-40"
        style={{
          borderColor: 'var(--theme-secondary)',
          backgroundColor: 'var(--theme-background)',
          color: 'var(--theme-text)',
          opacity: 0.7,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        <p>© {new Date().getFullYear()} CineVision AI. Powered by Google Gemini.</p>
      </footer>
      </div>
    </div>
  );
};

export default App;