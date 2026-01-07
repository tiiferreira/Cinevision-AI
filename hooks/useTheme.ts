import { useState, useEffect } from 'react';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

export const defaultThemes: Record<string, ThemeColors> = {
  dark: {
    primary: '#0a0a0a',
    secondary: '#171717',
    accent: '#f59e0b',
    text: '#e5e5e5',
    background: '#0a0a0a'
  },
  cyber: {
    primary: '#0a0a0f',
    secondary: '#1a1a2e',
    accent: '#00f5ff',
    text: '#e0e0e0',
    background: '#0a0a0f'
  },
  neon: {
    primary: '#0d0d0d',
    secondary: '#1a1a1a',
    accent: '#ff00ff',
    text: '#ffffff',
    background: '#0d0d0d'
  },
  matrix: {
    primary: '#000000',
    secondary: '#0a0a0a',
    accent: '#00ff00',
    text: '#00ff00',
    background: '#000000'
  }
};

export const useTheme = () => {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('cinevision-theme');
      return saved || 'dark';
    }
    return 'dark';
  });

  const currentColors = defaultThemes[theme] || defaultThemes.dark;

  useEffect(() => {
    const root = document.documentElement;
    
    const hexToRgb = (hex: string): string => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result 
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '0, 0, 0';
    };
    
    root.style.setProperty('--theme-primary', currentColors.primary);
    root.style.setProperty('--theme-secondary', currentColors.secondary);
    root.style.setProperty('--theme-accent', currentColors.accent);
    root.style.setProperty('--theme-text', currentColors.text);
    root.style.setProperty('--theme-background', currentColors.background);
    
    root.style.setProperty('--theme-accent-rgb', hexToRgb(currentColors.accent));
    root.style.setProperty('--theme-secondary-rgb', hexToRgb(currentColors.secondary));
    
    sessionStorage.setItem('cinevision-theme', theme);
  }, [theme, currentColors]);

  return {
    theme,
    colors: currentColors,
    setTheme,
    availableThemes: Object.keys(defaultThemes)
  };
};

