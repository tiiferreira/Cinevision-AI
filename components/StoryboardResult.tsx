import React from 'react';
import { StoryboardResult } from '../types';
import { Copy, Film, Clapperboard, Check } from 'lucide-react';

interface StoryboardResultProps {
  data: StoryboardResult;
}

const JsonBlock: React.FC<{ json: any }> = ({ json }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(json, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mt-4 group">
      <div className="absolute -top-3 left-2 bg-cinema-900 px-2 text-xs font-mono text-cinema-accent border border-cinema-700 rounded shadow-sm">
        PROMPT JSON
      </div>
      <div className="bg-black/60 border border-cinema-700 rounded-lg p-4 font-mono text-xs text-green-400 overflow-x-auto">
        <pre>{JSON.stringify(json, null, 2)}</pre>
      </div>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 bg-cinema-800 hover:bg-cinema-700 rounded-md border border-cinema-700 transition-colors group-hover:opacity-100 opacity-0 md:opacity-100"
        title="Copiar JSON"
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
      </button>
    </div>
  );
};

const StoryboardResult: React.FC<StoryboardResultProps> = ({ data }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* Title Card */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2 font-serif tracking-wide">"{data.title}"</h2>
        <p className="text-gray-400 italic max-w-2xl mx-auto">{data.logline}</p>
      </div>

      <div className="space-y-12">
        {data.scenes.map((scene, idx) => (
          <div key={idx} className="relative pl-8 md:pl-0">
            {/* Timeline connector (desktop) */}
            <div className="hidden md:block absolute left-[50%] -ml-[1px] top-0 bottom-0 w-0.5 bg-cinema-800 -z-10" />
            
            <div className="bg-cinema-800 rounded-xl border border-cinema-700 overflow-hidden shadow-xl hover:border-cinema-accent/30 transition-all duration-500">
              
              {/* Scene Header */}
              <div className="bg-cinema-900/80 px-6 py-4 border-b border-cinema-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="bg-cinema-accent text-cinema-900 font-bold px-2 py-1 rounded text-xs uppercase tracking-wider">
                    Cena {idx + 1}
                  </span>
                  <h3 className="font-mono font-bold text-gray-200 uppercase tracking-widest text-sm md:text-base">
                    {scene.sceneHeader}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-cinema-900 px-2 py-1 rounded-full border border-cinema-800">
                  <Film className="w-3 h-3" />
                  {scene.shotType}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-bold">Ação Visual</h4>
                  <p className="text-gray-300 leading-relaxed font-serif text-lg">
                    {scene.visualDescription}
                  </p>
                </div>

                {/* JSON Prompt Area */}
                <JsonBlock json={scene.jsonPrompt} />
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default StoryboardResult;