import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import AnalysisResult from './components/AnalysisResult';
import StoryInput from './components/StoryInput';
import StoryboardResultComponent from './components/StoryboardResult';
import ApiKeyScreen from './components/ApiKeyScreen';
import { analyzeImageForCinema, generateStoryboardFromText, hasApiKey, setApiKey } from './services/geminiService';
import { AppState, CineAnalysisResult, StoryboardResult, ActiveTab } from './types';
import { Sparkles, AlertCircle, Image as ImageIcon, BookOpen } from 'lucide-react';

const App: React.FC = () => {
  const [hasApiKeyConfigured, setHasApiKeyConfigured] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('image');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageResult, setImageResult] = useState<CineAnalysisResult | null>(null);
  const [storyResult, setStoryResult] = useState<StoryboardResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setHasApiKeyConfigured(hasApiKey());
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

  if (!hasApiKeyConfigured) {
    return <ApiKeyScreen onApiKeySet={handleApiKeySet} />;
  }

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
      const data = await generateStoryboardFromText(story, currentImage, imageResult);
      setStoryResult(data);
      setAppState(AppState.SUCCESS);
    } catch (err) {
      console.error(err);
      setAppState(AppState.ERROR);
      setErrorMsg("Falha ao gerar o storyboard. Tente encurtar a história ou tente novamente.");
    }
  }, [currentImage, imageResult]);

  return (
    <div className="min-h-screen bg-cinema-900 text-white selection:bg-cinema-accent selection:text-black">
      <Header onSettingsClick={handleOpenSettings} />

      <main className="container mx-auto px-4 py-8">
        
        <div className="text-center mb-8 space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
            {activeTab === 'image' ? "Visão Cinematográfica" : "Roteiro para Cena"}
          </h1>
          <p className="text-gray-400 text-lg">
            {activeTab === 'image' 
              ? "Transforme fotos em prompts de Hollywood e ideias de comerciais."
              : "Transforme sua história em um storyboard detalhado com prompts JSON."
            }
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="bg-cinema-800 p-1 rounded-full border border-cinema-700 flex">
            <button
              onClick={() => handleTabChange('image')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'image' 
                ? 'bg-cinema-accent text-cinema-900 shadow-lg' 
                : 'text-gray-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Análise de Imagem
            </button>
            <button
              onClick={() => handleTabChange('story')}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === 'story' 
                ? 'bg-cinema-accent text-cinema-900 shadow-lg' 
                : 'text-gray-400 hover:text-white'
              }`}
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
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 animate-pulse">
              <Sparkles className="w-8 h-8 mb-4 text-cinema-accent" />
              <p>
                {activeTab === 'image' 
                  ? "A inteligência artificial está estudando a cena..."
                  : "Escrevendo as cenas e gerando prompts..."
                }
              </p>
            </div>
          )}

          {appState === AppState.ERROR && (
            <div className="max-w-md mx-auto p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-3 text-red-200 mt-8">
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
      
      <footer className="py-6 text-center text-gray-600 text-sm border-t border-cinema-800 bg-cinema-900">
        <p>© {new Date().getFullYear()} CineVision AI. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;