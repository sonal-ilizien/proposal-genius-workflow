
import { useEffect, useState } from 'react';

// Use this hook to add entrance animations to components
export const useEntranceAnimation = (delay = 0) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isVisible;
};

// A hook to stagger children animations
export const useStaggeredChildren = (count: number, baseDelay = 100, initialDelay = 0) => {
  return Array.from({ length: count }, (_, i) => initialDelay + baseDelay * i);
};

// Use this for smooth transitions between pages
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// Use for card hover effects
export const cardHoverEffect = (scale = 1.02, shadowIntensity = 'lg') => {
  return {
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: `scale(${scale})`,
      boxShadow: shadowIntensity === 'lg' ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : 
                shadowIntensity === 'md' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' :
                '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
    }
  };
};
