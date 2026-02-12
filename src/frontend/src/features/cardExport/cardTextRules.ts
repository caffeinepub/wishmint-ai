/**
 * Card text sanitization and validation utilities.
 * Ensures exported/preview card text contains only Title/Message/Footer content
 * and never includes placeholders like "{NAME}" or instruction-like strings.
 */

export interface CardTextContent {
  title: string;
  message: string;
  footer: string;
}

const DISALLOWED_TOKENS = [
  '{NAME}',
  '{name}',
  'Title:',
  'Message:',
  'Footer:',
  'Prompt:',
  'Instructions:',
  'Generate',
  'Create',
];

/**
 * Sanitizes recipient name to prevent placeholder syntax
 */
export function sanitizeRecipientName(name: string): string {
  if (!name || name.trim().length === 0) {
    return 'Friend';
  }
  
  // Remove any curly braces or instruction-like prefixes
  let sanitized = name.trim()
    .replace(/[{}]/g, '')
    .replace(/^(Title|Message|Footer|Prompt|Instructions):\s*/gi, '');
  
  // Capitalize first letter
  sanitized = sanitized.charAt(0).toUpperCase() + sanitized.slice(1);
  
  return sanitized || 'Friend';
}

/**
 * Removes instruction-like lines and disallowed tokens from text
 */
export function stripInstructionLikeContent(text: string): string {
  let cleaned = text;
  
  // Remove lines that start with instruction-like prefixes
  cleaned = cleaned
    .split('\n')
    .filter(line => {
      const trimmed = line.trim();
      return !DISALLOWED_TOKENS.some(token => 
        trimmed.startsWith(token) || trimmed.includes(token)
      );
    })
    .join('\n');
  
  // Remove any remaining disallowed tokens
  DISALLOWED_TOKENS.forEach(token => {
    cleaned = cleaned.replace(new RegExp(token, 'gi'), '');
  });
  
  return cleaned.trim();
}

/**
 * Validates and formats card text content for export/preview
 */
export function formatCardTextContent(
  recipientName: string,
  wishMessage: string
): CardTextContent {
  const sanitizedName = sanitizeRecipientName(recipientName);
  const sanitizedMessage = stripInstructionLikeContent(wishMessage);
  
  return {
    title: `Happy Birthday ${sanitizedName}!`,
    message: sanitizedMessage,
    footer: 'Made with ❤️ by WishMint AI',
  };
}

/**
 * Validates that text doesn't contain placeholders or instructions
 */
export function isValidCardText(text: string): boolean {
  return !DISALLOWED_TOKENS.some(token => 
    text.includes(token)
  );
}
