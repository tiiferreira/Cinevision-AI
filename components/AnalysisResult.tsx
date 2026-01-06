import React from 'react';
import { CineAnalysisResult } from '../types';
import { Copy, Camera, Lightbulb, Film, Clapperboard } from 'lucide-react';

interface AnalysisResultProps {
  data: CineAnalysisResult;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ data }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast here ideally
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* Cinematic Prompt Section */}
      <section className="bg-cinema-800 rounded-xl p-6 border border-cinema-700 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Film className="text-cinema-accent w-5 h-5" />
            <h2 className="text-xl font-bold text-white">Prompt Cinematográfico (Gen AI)</h2>
          </div>
          <button 
            onClick={() => copyToClipboard(data.cinematicPrompt)}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Copy className="w-4 h-4" /> Copiar
          </button>
        </div>
        <div className="bg-black/40 p-4 rounded-lg font-mono text-sm text-gray-300 leading-relaxed border border-cinema-700/50">
          {data.cinematicPrompt}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Camera Angles */}
        <section className="bg-cinema-800 rounded-xl p-6 border border-cinema-700 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Camera className="text-blue-400 w-5 h-5" />
            <h2 className="text-xl font-bold text-white">Ângulos Sugeridos</h2>
          </div>
          <ul className="space-y-4">
            {data.cameraAngles.map((angle, idx) => (
              <li key={idx} className="flex gap-3 items-start p-3 rounded-lg bg-cinema-700/30">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">
                  {idx + 1}
                </span>
                <p className="text-gray-300 text-sm">{angle}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Lighting */}
        <section className="bg-cinema-800 rounded-xl p-6 border border-cinema-700 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="text-yellow-400 w-5 h-5" />
            <h2 className="text-xl font-bold text-white">Sugestões de Iluminação</h2>
          </div>
          <ul className="space-y-4">
            {data.lightingSuggestions.map((light, idx) => (
              <li key={idx} className="flex gap-3 items-start p-3 rounded-lg bg-cinema-700/30">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold border border-yellow-500/30">
                  {idx + 1}
                </span>
                <p className="text-gray-300 text-sm">{light}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Commercial Ideas */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Clapperboard className="text-green-400 w-6 h-6" />
          <h2 className="text-2xl font-bold text-white">Conceitos para Comercial</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.commercialIdeas.map((idea, idx) => (
            <div key={idx} className="bg-cinema-800 rounded-xl p-1 border border-cinema-700 hover:border-cinema-accent/50 transition-colors group">
              <div className="bg-cinema-900/50 p-5 rounded-lg h-full flex flex-col">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cinema-accent transition-colors">
                  {idea.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 flex-grow">
                  {idea.synopsis}
                </p>
                <div className="mt-4 pt-4 border-t border-cinema-700">
                  <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1 block">
                    Gancho Visual
                  </span>
                  <p className="text-sm text-gray-300 italic">
                    "{idea.visualHook}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AnalysisResult;