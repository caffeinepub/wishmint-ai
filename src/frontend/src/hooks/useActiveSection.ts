import { useState, useEffect } from 'react';

/**
 * Scroll-spy hook using IntersectionObserver to determine the currently active section
 * with stability controls to prevent boundary flicker
 */

const SECTION_IDS = ['home', 'create-wish', 'templates', 'marketplace', 'pricing', 'dashboard', 'faq'] as const;
export type SectionId = typeof SECTION_IDS[number];

export function useActiveSection(): SectionId {
  const [activeSection, setActiveSection] = useState<SectionId>('home');

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // Trigger when section is in the upper 40% of viewport
      threshold: 0,
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      // Find the first intersecting section
      const intersecting = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => {
          // Sort by position in document
          return a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top;
        });

      if (intersecting.length > 0) {
        const id = intersecting[0].target.id as SectionId;
        if (SECTION_IDS.includes(id)) {
          setActiveSection(id);
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return activeSection;
}
