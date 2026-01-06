import React, { useState } from 'react';
import { PenTool, Wand2, Image as ImageIcon } from 'lucide-react';

interface StoryInputProps {
  onStorySubmit: (story: string) => void;
  isLoading: boolean;
  hasActiveContext: boolean;
}

const StoryInput: React.FC<StoryInputProps> = ({ onStorySubmit, isLoading, hasActiveContext }) => {
  const [story, setStory] = useState('');

  const handleSubmit = () => {
    if (story.trim().length > 10 && !isLoading) {
      onStorySubmit(story);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8 animate-fade-in">
      <div className="bg-cinema-800/50 rounded-xl border border-cinema-700 overflow-hidden shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-cinema-accent">
            <PenTool className="w-5 h-5" />
            <h2 className="text-lg font-semibold text-white">Roteiro / História</h2>
          </div>
          {hasActiveContext && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-900/30 border border-green-700/50 rounded-full text-xs font-medium text-green-400">
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
          className="w-full h-48 bg-black/40 border border-cinema-700 rounded-lg p-4 text-gray-200 focus:outline-none focus:border-cinema-accent focus:ring-1 focus:ring-cinema-accent transition-all resize-none placeholder-gray-600 mb-4"
          disabled={isLoading}
        />

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isLoading || story.trim().length < 10}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wide
              transition-all duration-300
              ${isLoading || story.trim().length < 10
                ? 'bg-cinema-700 text-gray-500 cursor-not-allowed' 
                : 'bg-cinema-accent text-cinema-900 hover:bg-amber-400 shadow-lg hover:shadow-amber-500/20'}
            `}
          >
            {isLoading ? (
              <>
                <Wand2 className="w-4 h-4 animate-spin" /> Gerando Cenas...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" /> Gerar Storyboard
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryInput;