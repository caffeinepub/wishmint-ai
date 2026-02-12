import type { SampleWish } from './sampleWishes';

export interface FormattedWish {
  title: string;
  body: string;
}

/**
 * Converts a sample wish into a compact 2-3 line format with celebratory title
 */
export function formatExampleWish(wish: SampleWish): FormattedWish {
  const name = wish.name;
  
  // Extract the first sentence or up to 100 chars as body
  const fullText = wish.wish;
  
  // Remove the "Happy Birthday {Name}!" part if it exists
  const withoutGreeting = fullText.replace(/^Happy Birthday [^!]+!\s*/i, '');
  
  // Take first 1-2 sentences or up to 120 characters
  const sentences = withoutGreeting.split(/[.!]\s+/);
  let body = sentences[0];
  
  if (body.length < 60 && sentences[1]) {
    body += '. ' + sentences[1];
  }
  
  // Ensure body ends with punctuation
  if (!/[.!?]$/.test(body)) {
    body += '.';
  }
  
  // Limit to ~120 chars for mobile readability
  if (body.length > 120) {
    body = body.substring(0, 117) + '...';
  }
  
  return {
    title: `Happy Birthday ${name}!`,
    body,
  };
}
