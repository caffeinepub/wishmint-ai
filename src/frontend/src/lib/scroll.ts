/**
 * Smooth scroll utility with sticky header offset and reduced-motion support
 * Enhanced with completion callback and boundary clamping
 */

/**
 * Dynamically measures the sticky header height
 */
function getStickyHeaderHeight(): number {
  const navbar = document.getElementById('sticky-navbar');
  if (navbar) {
    return navbar.offsetHeight;
  }
  // Fallback to default height if navbar not found
  return 64;
}

/**
 * Smoothly scrolls to an anchor element with proper header offset
 * @param anchorId - The ID of the element to scroll to
 * @param onComplete - Optional callback to execute after scroll completes
 */
export function smoothScrollToAnchor(anchorId: string, onComplete?: () => void) {
  const element = document.getElementById(anchorId);
  if (!element) {
    console.warn(`Element with id "${anchorId}" not found`);
    return;
  }

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Dynamically measure header height
  const headerHeight = getStickyHeaderHeight();
  
  // Calculate target position with offset
  const elementPosition = element.getBoundingClientRect().top + window.scrollY;
  const offsetPosition = elementPosition - headerHeight;

  // Clamp to valid scroll range
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const clampedPosition = Math.max(0, Math.min(offsetPosition, maxScroll));

  window.scrollTo({
    top: clampedPosition,
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  });

  // Execute completion callback after scroll settles
  if (onComplete) {
    if (prefersReducedMotion) {
      // Immediate callback for reduced motion
      setTimeout(onComplete, 50);
    } else {
      // Wait for smooth scroll to complete (estimate based on distance)
      const scrollDistance = Math.abs(clampedPosition - window.scrollY);
      const duration = Math.min(1000, scrollDistance / 2); // Max 1s, adaptive to distance
      setTimeout(onComplete, duration);
    }
  }
}
