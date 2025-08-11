import { useEffect, useRef, useState } from 'react';

export const useAnimationControl = <T extends HTMLElement = HTMLDivElement>(animationDuration: number = 800) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (hasAnimated) return;

    const timer = setTimeout(() => {
      setHasAnimated(true);
      if (elementRef.current) {
        elementRef.current.classList.add('animation-completed');
      }
    }, animationDuration);

    return () => clearTimeout(timer);
  }, [hasAnimated, animationDuration]);

  return { elementRef, hasAnimated };
};
