/**
 * Card text sanitization and validation utilities
 * Ensures exported/preview card text contains only Title/Message/Footer content
 * and never includes placeholders like "{NAME}" or instruction-like strings
 */

/**
 * Sanitizes card text by removing instruction-like content and placeholders
 */
export function sanitizeCardText(text: string): string {
  let sanitized = text;

  // Remove instruction-like prefixes
  const instructionPrefixes = [
    /^Prompt:\s*/i,
    /^Instructions?:\s*/i,
    /^Generate:\s*/i,
    /^Create:\s*/i,
    /^Title:\s*/i,
    /^Message:\s*/i,
    /^Footer:\s*/i,
  ];

  for (const pattern of instructionPrefixes) {
    sanitized = sanitized.replace(pattern, '');
  }

  // Remove placeholder patterns
  const placeholderPatterns = [
    /\{NAME\}/gi,
    /\{RECIPIENT\}/gi,
    /\{YOUR_NAME\}/gi,
    /\[NAME\]/gi,
    /\[RECIPIENT\]/gi,
  ];

  for (const pattern of placeholderPatterns) {
    sanitized = sanitized.replace(pattern, '');
  }

  // Clean up extra whitespace
  sanitized = sanitized.trim().replace(/\s+/g, ' ');

  return sanitized;
}

/**
 * Formats card text content for export/preview
 * Accepts either fully specified content or generates fallback
 */
export function formatCardTextContent(options: {
  title?: string;
  message: string;
  footer?: string;
  eventType?: string;
}): { title: string; message: string; footer: string } {
  const title = options.title || generateDefaultTitle(options.eventType);
  const message = sanitizeCardText(options.message);
  const footer = options.footer || 'Created with WishMint';

  return {
    title: sanitizeCardText(title),
    message,
    footer: sanitizeCardText(footer),
  };
}

function generateDefaultTitle(eventType?: string): string {
  if (!eventType || eventType === 'birthday') {
    return 'Happy Birthday!';
  }

  const titleMap: Record<string, string> = {
    wedding: 'Congratulations!',
    anniversary: 'Happy Anniversary!',
    party: 'You\'re Invited!',
    corporate: 'Join Us',
    festival: 'Happy Holidays!',
    'baby-shower': 'Baby Shower',
    graduation: 'Congratulations Graduate!',
    'love-card': 'With Love',
    general: 'Celebrate',
  };

  return titleMap[eventType] || 'Celebrate';
}
