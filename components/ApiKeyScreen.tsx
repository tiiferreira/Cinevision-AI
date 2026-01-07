import React, { useState } from 'react';
import { Key, ArrowRight, ExternalLink, AlertCircle } from 'lucide-react';

interface ApiKeyScreenProps {
  onApiKeySet: (apiKey: string) => void;
}

const ApiKeyScreen: React.FC<ApiKeyScreenProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedKey = apiKey.trim();

    if (!trimmedKey) {
      setError('Por favor, insira uma API key válida');
      return;
    }

    if (trimmedKey.length < 10) {
      setError('A API key parece estar incompleta. Verifique e tente novamente.');
      return;
    }

    setIsLoading(true);
    
    try {
      localStorage.setItem('_k1', trimmedKey);
      onApiKeySet(trimmedKey);
    } catch (err) {
      setError('Erro ao salvar a API key. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cinema-900 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cinema-800 border border-cinema-700 mb-6">
            <Key className="w-10 h-10 text-cinema-accent" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
            CineVision AI
          </h1>
          <p className="text-gray-400 text-lg">
            Configure sua API Key do Gemini para começar
          </p>
        </div>

        <div className="bg-cinema-800 rounded-xl border border-cinema-700 p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
                Insira sua API Key aqui
              </label>
              <input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setError(null);
                }}
                placeholder="Cole sua API key aqui"
                className="w-full px-4 py-3 bg-cinema-900 border border-cinema-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cinema-accent focus:ring-2 focus:ring-cinema-accent/20 transition-all"
                disabled={isLoading}
                autoFocus
              />
              <p className="mt-2 text-xs text-gray-500">
                Sua API key é armazenada localmente no navegador e nunca é compartilhada
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-2 text-red-200 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !apiKey.trim()}
              className={`
                w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wide
                transition-all duration-300
                ${isLoading || !apiKey.trim()
                  ? 'bg-cinema-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-cinema-accent text-cinema-900 hover:bg-amber-400 shadow-lg hover:shadow-amber-500/20'}
              `}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-cinema-900 border-t-transparent rounded-full animate-spin"></div>
                  Validando...
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-cinema-700">
            <p className="text-xs text-gray-500 mb-3 text-center">
              Não tem uma API Key?
            </p>
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-cinema-accent hover:text-amber-400 transition-colors border border-cinema-700 rounded-lg hover:border-cinema-accent/50"
            >
              <ExternalLink className="w-4 h-4" />
              Obter API Key do Gemini
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          Powered by Google Gemini
        </p>
      </div>
    </div>
  );
};

export default ApiKeyScreen;

