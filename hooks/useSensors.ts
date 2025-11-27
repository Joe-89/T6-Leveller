import { useState, useEffect, useCallback } from 'react';
import { SensorValues } from '../types';

interface UseSensorsReturn {
  data: SensorValues;
  permissionGranted: boolean | null; // null = unknown/not requested yet
  requestPermission: () => Promise<void>;
  isIOS: boolean;
}

export const useSensors = (): UseSensorsReturn => {
  const [data, setData] = useState<SensorValues>({ beta: 0, gamma: 0 });
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detekce iOS 13+ prostředí
    const isIOSDevice =
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function';
    
    setIsIOS(isIOSDevice);

    if (!isIOSDevice) {
      // Pro Android a starší iOS není potřeba explicitní povolení (obvykle)
      setPermissionGranted(true);
    }
  }, []);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    setData({
      beta: event.beta || 0,
      gamma: event.gamma || 0,
    });
  }, []);

  const requestPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          setPermissionGranted(true);
        } else {
          setPermissionGranted(false);
          alert('Přístup k senzorům byl zamítnut. Povolte jej v nastavení Safari.');
        }
      } catch (error) {
        console.error(error);
        // Fallback pro dev prostředí nebo simulátor
        setPermissionGranted(false); 
      }
    } else {
      // Non-iOS 13+ devices
      setPermissionGranted(true);
    }
  };

  useEffect(() => {
    if (permissionGranted) {
      window.addEventListener('deviceorientation', handleOrientation);
      return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    }
  }, [permissionGranted, handleOrientation]);

  return { data, permissionGranted, requestPermission, isIOS };
};