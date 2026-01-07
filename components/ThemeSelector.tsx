import React, { useState, useRef, useEffect } from 'react';
import { Palette, X } from 'lucide-react';
import { gsap } from 'gsap';
import { useTheme, defaultThemes } from '../hooks/useTheme';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      gsap.from(menuRef.current, {
        opacity: 0,
        scale: 0.9,
        y: -10,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [isOpen]);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      });
    }
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg transition-all duration-300 relative group overflow-hidden"
        style={{
          color: 'var(--theme-text)',
          opacity: 0.7
        }}
        title="Escolher tema"
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
      >
        <Palette className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90 relative z-10" />
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"
          style={{ backgroundColor: 'var(--theme-accent)' }}
        />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div
            ref={menuRef}
            className="absolute right-0 top-full mt-2 w-64 rounded-xl shadow-2xl z-50 p-4 border backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(var(--theme-secondary-rgb), 0.95)',
              borderColor: 'var(--theme-accent)',
              boxShadow: `0 0 30px rgba(var(--theme-accent-rgb), 0.3)`
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>Escolher Tema</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 transition-all duration-300 rounded hover:scale-110"
                style={{ color: 'var(--theme-text)', opacity: 0.7 }}
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, { opacity: 1, scale: 1.1, duration: 0.2 });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, { opacity: 0.7, scale: 1, duration: 0.2 });
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {availableThemes.map((themeName) => {
                const themeColors = defaultThemes[themeName];
                return (
                  <button
                    key={themeName}
                    onClick={() => {
                      handleThemeChange(themeName);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 border-2 relative overflow-hidden group"
                    style={theme === themeName
                      ? {
                          backgroundColor: `rgba(var(--theme-accent-rgb), 0.2)`,
                          borderColor: 'var(--theme-accent)',
                          boxShadow: `0 0 15px rgba(var(--theme-accent-rgb), 0.3)`
                        }
                      : {
                          backgroundColor: 'rgba(var(--theme-secondary-rgb), 0.5)',
                          borderColor: 'transparent'
                        }
                    }
                    onMouseEnter={(e) => {
                      if (theme !== themeName) {
                        gsap.to(e.currentTarget, {
                          borderColor: 'var(--theme-accent)',
                          backgroundColor: `rgba(var(--theme-secondary-rgb), 0.7)`,
                          scale: 1.02,
                          duration: 0.2
                        });
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (theme !== themeName) {
                        gsap.to(e.currentTarget, {
                          borderColor: 'transparent',
                          backgroundColor: `rgba(var(--theme-secondary-rgb), 0.5)`,
                          scale: 1,
                          duration: 0.2
                        });
                      }
                    }}
                  >
                    <div className="flex gap-1.5">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ 
                          backgroundColor: themeColors.primary,
                          borderColor: 'var(--theme-secondary)'
                        }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ 
                          backgroundColor: themeColors.accent,
                          borderColor: 'var(--theme-secondary)'
                        }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ 
                          backgroundColor: themeColors.secondary,
                          borderColor: 'var(--theme-secondary)'
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium capitalize relative z-10" style={{ color: 'var(--theme-text)' }}>
                      {themeName}
                    </span>
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                      style={{ backgroundColor: 'var(--theme-accent)' }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;

