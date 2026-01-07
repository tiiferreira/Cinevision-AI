import React, { useState, useRef } from 'react';
import { PenTool, Wand2, Image as ImageIcon } from 'lucide-react';
import { gsap } from 'gsap';

interface StoryInputProps {
  onStorySubmit: (story: string) => void;
  isLoading: boolean;
  hasActiveContext: boolean;
}

const StoryInput: React.FC<StoryInputProps> = ({ onStorySubmit, isLoading, hasActiveContext }) => {
  const [story, setStory] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = () => {
    if (story.trim().length > 10 && !isLoading) {
      if (buttonRef.current) {
        gsap.to(buttonRef.current, {
          scale: 0.95,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut'
        });
      }
      onStorySubmit(story);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <div 
        className="rounded-xl border overflow-hidden shadow-2xl p-6 backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(var(--theme-secondary-rgb), 0.5)',
          borderColor: 'var(--theme-accent)',
          boxShadow: `0 0 30px rgba(var(--theme-accent-rgb), 0.2)`
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2" style={{ color: 'var(--theme-accent)' }}>
            <PenTool className="w-5 h-5" />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--theme-text)' }}>Roteiro / História</h2>
          </div>
          {hasActiveContext && (
            <div 
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
              style={{
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                borderColor: 'rgba(34, 197, 94, 0.5)',
                color: '#4ade80'
              }}
            >
              <ImageIcon className="w-3 h-3" />
              <span>Usando estilo da imagem analisada</span>
            </div>
          )}
        </div>
        
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder={hasActiveContext 
            ? "Escreva uma história para acontecer no cenário da imagem que você carregou..." 
            : "Cole sua história, sinopse ou ideia aqui... Ex: 'Um astronauta solitário descobre uma flor nascendo em Marte...'"
          }
          className="w-full h-48 rounded-lg p-4 focus:outline-none focus:ring-2 transition-all resize-none mb-4"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            border: `1px solid var(--theme-secondary)`,
            color: 'var(--theme-text)',
            placeholder: 'var(--theme-text)',
            opacity: 0.8
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
        />

        <div className="flex justify-end">
          <button
            ref={buttonRef}
            onClick={handleSubmit}
            disabled={isLoading || story.trim().length < 10}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wide transition-all duration-300 relative overflow-hidden group"
            style={isLoading || story.trim().length < 10
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
              if (!isLoading && story.trim().length >= 10) {
                gsap.to(e.currentTarget, {
                  scale: 1.05,
                  boxShadow: `0 0 30px rgba(var(--theme-accent-rgb), 0.6)`,
                  duration: 0.2
                });
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading && story.trim().length >= 10) {
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
                  <Wand2 className="w-4 h-4 animate-spin" /> Gerando Cenas...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" /> Gerar Storyboard
                </>
              )}
            </span>
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
              style={{ backgroundColor: 'var(--theme-background)' }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryInput;