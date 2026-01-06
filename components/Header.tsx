import React from 'react';
import { Clapperboard } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-cinema-700 bg-cinema-900/95 backdrop-blur supports-[backdrop-filter]:bg-cinema-900/60">
      <div className="container flex h-16 items-center mx-auto px-4">
        <div className="flex items-center gap-2 text-cinema-accent">
          <Clapperboard className="h-6 w-6" />
          <span className="text-xl font-bold tracking-tight text-white">CineVision AI</span>
        </div>
        <nav className="ml-auto flex items-center gap-6">
          <span className="text-sm font-medium text-gray-400">
            Powered by Gemini 3 Flash
          </span>
        </nav>
      </div>
    </header>
  );
};

export default Header;