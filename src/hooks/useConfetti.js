import { useCallback } from 'react';
import confetti from 'canvas-confetti';

export function useConfetti() {
  const fireConfetti = useCallback((options = {}) => {
    const defaults = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#39ff14', '#bf00ff', '#ffd700', '#00ff88', '#ff6b35']
    };
    
    confetti({
      ...defaults,
      ...options
    });
  }, []);
  
  const fireCelebration = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;
    
    const colors = ['#39ff14', '#bf00ff', '#ffd700'];
    
    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });
      
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);
  
  const fireMassiveCelebration = useCallback(() => {
    const duration = 5000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    
    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }
    
    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      
      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#39ff14', '#bf00ff', '#ffd700']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#39ff14', '#bf00ff', '#ffd700']
      });
    }, 250);
  }, []);
  
  return { fireConfetti, fireCelebration, fireMassiveCelebration };
}
