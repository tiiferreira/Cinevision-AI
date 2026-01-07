import React, { useState, useRef } from 'react';
import { Key, ArrowRight, ExternalLink, AlertCircle } from 'lucide-react';
import { gsap } from 'gsap';
import { useTheme } from '../hooks/useTheme';
import { useVantaBackground } from '../hooks/useVantaBackground';
import { useGyroPermission } from '../hooks/useGyroPermission';

interface ApiKeyScreenProps {
  onApiKeySet: (apiKey: string) => void;
}

const ApiKeyScreen: React.FC<ApiKeyScreenProps> = ({ onApiKeySet }) => {
  const { colors } = useTheme();
  const vantaRef = useRef<HTMLDivElement>(null);
  const { hasPermission, needsPermission, requestPermission } = useGyroPermission();
  useVantaBackground(vantaRef);
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
    <div 
      className="min-h-screen flex items-center justify-center px-4 transition-colors duration-300 relative"
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
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center w-20 h-20 rounded-full border mb-6"
            style={{
              backgroundColor: 'var(--theme-secondary)',
              borderColor: 'var(--theme-accent)',
              boxShadow: `0 0 20px rgba(var(--theme-accent-rgb), 0.3)`
            }}
          >
            <Key className="w-10 h-10" style={{ color: 'var(--theme-accent)' }} />
          </div>
          <h1 
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{
              background: `linear-gradient(135deg, var(--theme-text) 0%, var(--theme-accent) 50%, var(--theme-text) 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              transition: 'filter 0.3s ease',
              filter: `drop-shadow(0 0 15px rgba(var(--theme-accent-rgb), 0.4))`,
              lineHeight: '1.2',
              paddingBottom: '0.2em',
              display: 'inline-block'
            }}
          >
            CineVision AI
          </h1>
          <p style={{ color: 'var(--theme-text)', opacity: 0.7 }} className="text-lg">
            Configure sua API Key do Gemini para começar
          </p>
        </div>

        <div 
          className="rounded-xl border p-6 shadow-2xl backdrop-blur-sm"
          style={{
            backgroundColor: 'rgba(var(--theme-secondary-rgb), 0.5)',
            borderColor: 'var(--theme-accent)',
            boxShadow: `0 0 30px rgba(var(--theme-accent-rgb), 0.2)`
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)', opacity: 0.9 }}>
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
                className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  border: `1px solid var(--theme-secondary)`,
                  color: 'var(--theme-text)'
                }}
                onFocus={(e) => {
                  gsap.to(e.currentTarget, {
                    borderColor: 'var(--theme-accent)',
                    boxShadow: `0 0 20px rgba(var(--theme-accent-rgb), 0.3)`,
                    duration: 0.3
                  });
                }}
                onBlur={(e) => {
                  gsap.to(e.currentTarget, {
                    borderColor: 'var(--theme-secondary)',
                    boxShadow: 'none',
                    duration: 0.3
                  });
                }}
                disabled={isLoading}
                autoFocus
              />
              <p className="mt-2 text-xs" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
                Sua API key é armazenada localmente no navegador e nunca é compartilhada
              </p>
            </div>

            {error && (
              <div 
                className="p-3 rounded-lg flex items-center gap-2 text-sm border"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5'
                }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !apiKey.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wide transition-all duration-300 relative overflow-hidden group"
              style={isLoading || !apiKey.trim()
                ? {
                    backgroundColor: 'var(--theme-secondary)',
                    color: 'var(--theme-text)',
                    opacity: 0.5,
                    cursor: 'not-allowed'
                  }
                : {
                    backgroundColor: 'var(--theme-accent)',
                    color: 'var(--theme-background)',
                    boxShadow: `0 0 20px rgba(var(--theme-accent-rgb), 0.4)`
                  }
              }
              onMouseEnter={(e) => {
                if (!isLoading && apiKey.trim()) {
                  gsap.to(e.currentTarget, {
                    scale: 1.02,
                    boxShadow: `0 0 30px rgba(var(--theme-accent-rgb), 0.6)`,
                    duration: 0.2
                  });
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && apiKey.trim()) {
                  gsap.to(e.currentTarget, {
                    scale: 1,
                    boxShadow: `0 0 20px rgba(var(--theme-accent-rgb), 0.4)`,
                    duration: 0.2
                  });
                }
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-cinema-900 border-t-transparent rounded-full animate-spin"></div>
                  Validando...
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight className="w-4 h-4 inline-block" />
                </>
              )}
              </span>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{ backgroundColor: 'var(--theme-background)' }}
              />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--theme-secondary)' }}>
            <p className="text-xs mb-3 text-center" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
              Não tem uma API Key?
            </p>
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm transition-all duration-300 border rounded-lg relative overflow-hidden group"
              style={{
                color: 'var(--theme-accent)',
                borderColor: 'var(--theme-secondary)'
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  borderColor: 'var(--theme-accent)',
                  scale: 1.02,
                  duration: 0.2
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  borderColor: 'var(--theme-secondary)',
                  scale: 1,
                  duration: 0.2
                });
              }}
            >
              <ExternalLink className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Obter API Key do Gemini</span>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{ backgroundColor: 'var(--theme-accent)' }}
              />
            </a>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
          Powered by Google Gemini
        </p>
      </div>
    </div>
  );
};

export default ApiKeyScreen;

