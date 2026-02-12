import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useInView } from '../hooks/useInView';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { threshold: 0.1, triggerOnce: true });
  const prefersReducedMotion = usePrefersReducedMotion();
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isInView && !prefersReducedMotion) {
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, delay * 1000);
      return () => clearTimeout(timer);
    } else if (isInView && prefersReducedMotion) {
      setShouldAnimate(true);
    }
  }, [isInView, delay, prefersReducedMotion]);

  return (
    <div
      ref={ref}
      className={`${className} ${
        prefersReducedMotion
          ? ''
          : shouldAnimate
          ? 'animate-fade-in-up'
          : 'opacity-0'
      }`}
    >
      {children}
    </div>
  );
}
