import React, { useEffect, useRef } from 'react';
import { Clapperboard, Settings } from 'lucide-react';
import { gsap } from 'gsap';
import ThemeSelector from './ThemeSelector';

interface HeaderProps {
  onSettingsClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logoRef.current) {
      gsap.from(logoRef.current, {
        opacity: 0,
        x: -20,
        duration: 0.8,
        ease: 'power3.out'
      });
    }
  }, []);

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b backdrop-blur-md supports-[backdrop-filter]:backdrop-blur-md"
      style={{
        borderColor: 'var(--theme-secondary)',
        backgroundColor: 'rgba(var(--theme-primary-rgb), 0.95)'
      }}
    >
      <div className="container flex h-16 items-center mx-auto px-4">
        <div ref={logoRef} className="flex items-center gap-2" style={{ color: 'var(--theme-accent)' }}>
          <Clapperboard className="h-6 w-6" />
          <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--theme-text)' }}>
            CineVision AI
          </span>
        </div>
        <nav className="ml-auto flex items-center gap-4">
          <span className="text-sm font-medium hidden sm:inline" style={{ color: 'var(--theme-text)', opacity: 0.7 }}>
            Powered by Gemini 3 Flash
          </span>
          <ThemeSelector />
          {onSettingsClick && (
            <button
              onClick={onSettingsClick}
              className="p-2 rounded-lg transition-all duration-300 relative group overflow-hidden"
              style={{
                color: 'var(--theme-text)',
                opacity: 0.7
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  opacity: 1,
                  scale: 1.1,
                  duration: 0.2
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  opacity: 0.7,
                  scale: 1,
                  duration: 0.2
                });
              }}
              title="Alterar API Key"
            >
              <Settings className="w-5 h-5 relative z-10" />
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"
                style={{ backgroundColor: 'var(--theme-accent)' }}
              />
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;