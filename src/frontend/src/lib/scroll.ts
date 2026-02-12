/**
 * Smooth scroll utility with sticky header offset and reduced-motion support
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
 */
export function smoothScrollToAnchor(anchorId: string) {
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

  window.scrollTo({
    top: offsetPosition,
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  });
}
