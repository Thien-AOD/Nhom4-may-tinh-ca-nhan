import { useEffect, useState, useRef } from 'react';
import { Gyroscope } from 'expo-sensors';
import { Platform } from 'react-native';

// Shake detection parameters
const SHAKE_THRESHOLD = 1.5; // Adjust sensitivity as needed
const SHAKE_TIMEOUT = 1000; // Minimum time between shakes (ms)
const SHAKE_COUNT_THRESHOLD = 3; // Number of movements to trigger a shake

export default function useShakeDetection(onShake: () => void) {
  const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState<ReturnType<typeof Gyroscope.addListener> | null>(null);
  
  // Refs to track shake state
  const lastShakeTime = useRef(0);
  const shakeCount = useRef(0);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const lastZ = useRef(0);

  const _subscribe = () => {
    if (Platform.OS === 'web') {
      console.log('Gyroscope not available on web');
      return;
    }
    
    Gyroscope.setUpdateInterval(100); // Update every 100ms
    setSubscription(
      Gyroscope.addListener(gyroscopeData => {
        setData(gyroscopeData);
        detectShake(gyroscopeData);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const detectShake = (data: { x: number; y: number; z: number }) => {
    const now = Date.now();
    
    // Calculate movement
    const deltaX = Math.abs(lastX.current - data.x);
    const deltaY = Math.abs(lastY.current - data.y);
    const deltaZ = Math.abs(lastZ.current - data.z);
    
    // Update last values
    lastX.current = data.x;
    lastY.current = data.y;
    lastZ.current = data.z;
    
    // Calculate magnitude of movement
    const movement = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
    
    if (movement > SHAKE_THRESHOLD) {
      // Increment shake count
      shakeCount.current += 1;
      
      // Check if we've had enough movements in the right amount of time
      if (shakeCount.current >= SHAKE_COUNT_THRESHOLD && now - lastShakeTime.current > SHAKE_TIMEOUT) {
        // Reset shake count and time
        shakeCount.current = 0;
        lastShakeTime.current = now;
        
        // Trigger shake callback
        onShake();
      }
    }
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  return { gyroscopeData: { x, y, z } };
}