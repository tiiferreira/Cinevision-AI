import React, { useEffect, useRef } from 'react';
import { useTheme } from './useTheme';

declare global {
  interface Window {
    VANTA: any;
    THREE: any;
  }
}

export const useVantaBackground = (elementRef: React.RefObject<HTMLElement>) => {
  const { colors, theme } = useTheme();
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    console.log('useVantaBackground useEffect executado - TEMA:', theme, { 
      accentColor: colors.accent, 
      backgroundColor: colors.background 
    });
    
    if (vantaEffect.current) {
      try {
        console.log('FORÇANDO destruição do Vanta.js para refresh com novo tema:', theme);
        vantaEffect.current.destroy();
      } catch (e) {
        console.warn('Erro ao destruir efeito:', e);
      }
      vantaEffect.current = null;
    }
    
    const waitForElement = (callback: () => void, maxAttempts = 50) => {
      let attempts = 0;
      const check = () => {
        if (elementRef.current) {
          callback();
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(check, 50);
        } else {
          console.warn('Elemento não encontrado após', maxAttempts * 50, 'ms');
        }
      };
      check();
    };

    const hexToInt = (hex: string): number => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? parseInt(result[1] + result[2] + result[3], 16) : 0x0;
    };

    const initVanta = () => {
      if (!elementRef.current) {
        console.warn('Vanta: elementRef.current não está disponível');
        return;
      }

      if (!window.VANTA) {
        console.warn('Vanta: window.VANTA não está disponível');
        return;
      }

      if (!window.THREE) {
        console.warn('Vanta: window.THREE não está disponível');
        return;
      }

      if (window.VANTA && window.THREE && elementRef.current) {
        try {
          const accentColorInt = hexToInt(colors.accent);
          const bgColorInt = hexToInt(colors.background);
          
          console.log('Atualizando Vanta.js NET com novas cores do tema:', theme, {
            color: colors.accent,
            backgroundColor: colors.background,
            accentInt: accentColorInt,
            bgInt: bgColorInt
          });
          
          vantaEffect.current = window.VANTA.NET({
            el: elementRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: true,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: accentColorInt,
            backgroundColor: bgColorInt,
            points: 10.00,
            maxDistance: 20.00,
            spacing: 15.00,
            showDots: true
          });
          
          console.log('Vanta.js NET atualizado com sucesso!');
        } catch (error) {
          console.error('Erro ao atualizar Vanta.js:', error);
        }
      }
    };

    let checkInterval: NodeJS.Timeout | null = null;

    const tryInit = () => {
      if (window.VANTA && window.THREE && elementRef.current) {
        initVanta();
        return true;
      }
      return false;
    };

    if (elementRef.current) {
      if (tryInit()) {
        console.log('Vanta.js inicializado/atualizado imediatamente para tema:', theme);
      } else {
        console.log('Aguardando carregamento das bibliotecas Vanta.js...');
        let attempts = 0;
        const maxAttempts = 100;
        
        checkInterval = setInterval(() => {
          attempts++;
          if (tryInit()) {
            clearInterval(checkInterval!);
            console.log('Vanta.js inicializado após', attempts * 100, 'ms');
          } else if (attempts >= maxAttempts) {
            clearInterval(checkInterval!);
            console.error('Vanta.js não carregou após', maxAttempts * 100, 'ms');
            console.log('Status:', {
              VANTA: !!window.VANTA,
              THREE: !!window.THREE,
              element: !!elementRef.current
            });
          }
        }, 100);
      }
    } else {
      waitForElement(() => {
        if (tryInit()) {
          console.log('Vanta.js inicializado após elemento estar disponível');
        } else {
          console.log('Aguardando carregamento das bibliotecas Vanta.js...');
          let attempts = 0;
          const maxAttempts = 100;
          
          checkInterval = setInterval(() => {
            attempts++;
            if (tryInit()) {
              clearInterval(checkInterval!);
              console.log('Vanta.js inicializado após', attempts * 100, 'ms');
            } else if (attempts >= maxAttempts) {
              clearInterval(checkInterval!);
              console.error('Vanta.js não carregou após', maxAttempts * 100, 'ms');
              console.log('Status:', {
                VANTA: !!window.VANTA,
                THREE: !!window.THREE,
                element: !!elementRef.current
              });
            }
          }, 100);
        }
      });
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (vantaEffect.current) {
        try {
          vantaEffect.current.destroy();
        } catch (e) {
          console.warn('Erro ao limpar efeito:', e);
        }
        vantaEffect.current = null;
      }
    };
  }, [colors.accent, colors.background, theme]);

  return vantaEffect;
};

