import { useState, useEffect } from 'react';

export const useGyroPermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [needsPermission, setNeedsPermission] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkGyroSupport = () => {
      if (typeof DeviceOrientationEvent !== 'undefined') {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
          setNeedsPermission(true);
        } else {
          setHasPermission(true);
        }
      }
    };

    checkGyroSupport();
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false;

    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setHasPermission(true);
          setNeedsPermission(false);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Erro ao solicitar permissão do giroscópio:', error);
        return false;
      }
    }
    return false;
  };

  return { hasPermission, needsPermission, requestPermission };
};

