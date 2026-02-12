/**
 * Smooth scroll utility with sticky header offset and reduced-motion support
 */

const STICKY_HEADER_HEIGHT = 64; // Height of sticky navbar in pixels

export function smoothScrollToAnchor(anchorId: string) {
  const element = document.getElementById(anchorId);
  if (!element) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const elementPosition = element.getBoundingClientRect().top + window.scrollY;
  const offsetPosition = elementPosition - STICKY_HEADER_HEIGHT;

  window.scrollTo({
    top: offsetPosition,
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  });
}
