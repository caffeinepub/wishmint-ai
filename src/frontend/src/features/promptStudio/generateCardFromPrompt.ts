/**
 * AI-powered card generation from user prompt
 * Generates 3 professional card variations with title, mainText, footerText
 */

export interface CardVariation {
  title: string;
  subtitle?: string;
  mainText: string;
  footerText: string;
  themeTags: string[];
  layoutHints: {
    safeMargins: string;
    fontPairing: string;
    textPlacement: string;
  };
}

export interface AICardGenerationResponse {
  variations: CardVariation[];
}

const SYSTEM_PROMPT = `You are WishMint AI, a professional greeting card & invitation writer and designer. 
Analyze the user prompt and generate 3 variations. 
Each variation must include:
- title (short)
- subtitle (optional)
- mainText (max 35 words, no long paragraphs)
- footerText (short signature)
- themeTags (3–5 keywords)
- layoutHints (safe margins, font pairing suggestion, text placement zones)
Return JSON only.`;

/**
 * Generate card variations from user prompt using AI
 * @param promptText User's card description
 * @returns Promise with 3 card variations
 * @throws Error if generation fails or response is invalid
 */
export async function generateCardFromPrompt(
  promptText: string
): Promise<AICardGenerationResponse> {
  // For now, simulate AI response with deterministic generation
  // In production, this would call an actual AI API endpoint
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Parse prompt for context
  const lowerPrompt = promptText.toLowerCase();
  
  // Detect event type
  let eventType = 'celebration';
  let themeTags = ['modern', 'elegant', 'professional'];
  
  if (lowerPrompt.includes('birthday') || lowerPrompt.includes('bday')) {
    eventType = 'birthday';
    themeTags = ['birthday', 'celebration', 'joy', 'festive'];
  } else if (lowerPrompt.includes('wedding')) {
    eventType = 'wedding';
    themeTags = ['wedding', 'love', 'elegant', 'romantic'];
  } else if (lowerPrompt.includes('anniversary')) {
    eventType = 'anniversary';
    themeTags = ['anniversary', 'love', 'memories', 'celebration'];
  } else if (lowerPrompt.includes('baby')) {
    eventType = 'baby shower';
    themeTags = ['baby', 'cute', 'sweet', 'celebration'];
  } else if (lowerPrompt.includes('graduation')) {
    eventType = 'graduation';
    themeTags = ['graduation', 'success', 'achievement', 'future'];
  } else if (lowerPrompt.includes('corporate') || lowerPrompt.includes('business')) {
    eventType = 'corporate event';
    themeTags = ['professional', 'business', 'elegant', 'formal'];
  }
  
  // Detect tone
  let tone = 'warm';
  if (lowerPrompt.includes('formal') || lowerPrompt.includes('professional')) {
    tone = 'formal';
  } else if (lowerPrompt.includes('fun') || lowerPrompt.includes('playful')) {
    tone = 'fun';
  } else if (lowerPrompt.includes('romantic') || lowerPrompt.includes('love')) {
    tone = 'romantic';
  } else if (lowerPrompt.includes('cute') || lowerPrompt.includes('sweet')) {
    tone = 'cute';
  }
  
  // Generate 3 variations
  const variations: CardVariation[] = [
    {
      title: generateTitle(eventType, 1),
      subtitle: generateSubtitle(eventType, tone, 1),
      mainText: generateMainText(eventType, tone, 1),
      footerText: generateFooter(1),
      themeTags: themeTags,
      layoutHints: {
        safeMargins: '40px all sides',
        fontPairing: 'Playfair Display + Open Sans',
        textPlacement: 'centered with balanced spacing',
      },
    },
    {
      title: generateTitle(eventType, 2),
      subtitle: generateSubtitle(eventType, tone, 2),
      mainText: generateMainText(eventType, tone, 2),
      footerText: generateFooter(2),
      themeTags: themeTags,
      layoutHints: {
        safeMargins: '50px all sides',
        fontPairing: 'Montserrat + Lora',
        textPlacement: 'top-aligned with elegant flow',
      },
    },
    {
      title: generateTitle(eventType, 3),
      subtitle: generateSubtitle(eventType, tone, 3),
      mainText: generateMainText(eventType, tone, 3),
      footerText: generateFooter(3),
      themeTags: themeTags,
      layoutHints: {
        safeMargins: '45px all sides',
        fontPairing: 'Cormorant + Raleway',
        textPlacement: 'centered with modern layout',
      },
    },
  ];
  
  return { variations };
}

function generateTitle(eventType: string, variation: number): string {
  const titles: Record<string, string[]> = {
    'birthday': [
      'Happy Birthday!',
      'Celebrate Your Special Day',
      'Birthday Wishes',
    ],
    'wedding': [
      'Congratulations!',
      'Happily Ever After',
      'Best Wishes',
    ],
    'anniversary': [
      'Happy Anniversary!',
      'Celebrating Love',
      'Years of Joy Together',
    ],
    'baby shower': [
      'Welcome Baby!',
      'Baby Shower Celebration',
      'A New Blessing',
    ],
    'graduation': [
      'Congratulations Graduate!',
      'Success Awaits',
      'Well Done!',
    ],
    'corporate event': [
      'You\'re Invited',
      'Join Us',
      'Special Event',
    ],
    'celebration': [
      'Celebrate!',
      'Special Wishes',
      'For You',
    ],
  };
  
  const options = titles[eventType] || titles['celebration'];
  return options[variation - 1] || options[0];
}

function generateSubtitle(eventType: string, tone: string, variation: number): string | undefined {
  if (variation === 2) {
    return eventType === 'wedding' ? 'Join us in celebrating love' :
           eventType === 'corporate event' ? 'A special occasion' :
           'A memorable celebration';
  }
  return undefined;
}

function generateMainText(eventType: string, tone: string, variation: number): string {
  const messages: Record<string, string[]> = {
    'birthday': [
      'Wishing you a day filled with joy, laughter, and wonderful memories. May this year bring you happiness and success in everything you do.',
      'Another year of amazing adventures! Here\'s to celebrating you and all the wonderful moments ahead. Enjoy your special day!',
      'May your birthday be as special as you are. Sending warm wishes for a day filled with love, joy, and celebration.',
    ],
    'wedding': [
      'Congratulations on your wedding day! May your love story be filled with joy, laughter, and endless happiness together.',
      'Wishing you both a lifetime of love and happiness. May your journey together be blessed with beautiful moments.',
      'Best wishes on this wonderful journey as you build your new lives together. Congratulations and much love!',
    ],
    'anniversary': [
      'Celebrating the beautiful journey you\'ve shared together. Here\'s to many more years of love, laughter, and cherished memories.',
      'Happy Anniversary! Your love continues to inspire. Wishing you endless joy and happiness in the years ahead.',
      'Congratulations on another year of love and partnership. May your bond grow stronger with each passing day.',
    ],
    'baby shower': [
      'Congratulations on your upcoming arrival! Wishing you joy, love, and wonderful memories as you welcome your little one.',
      'A new adventure begins! May your baby bring endless happiness and fill your home with love and laughter.',
      'Celebrating the precious gift on the way. Wishing you all the best as you prepare for this beautiful journey.',
    ],
    'graduation': [
      'Congratulations on your graduation! Your hard work has paid off. Wishing you success and happiness in your next chapter.',
      'Well done on this amazing achievement! May your future be filled with exciting opportunities and continued success.',
      'Celebrating your success today! Your dedication and perseverance have brought you here. Best wishes for what\'s ahead!',
    ],
    'corporate event': [
      'We cordially invite you to join us for this special occasion. Your presence would be greatly appreciated.',
      'Join us in celebrating this important milestone. We look forward to sharing this moment with you.',
      'You\'re invited to an exclusive event. Please join us for an evening of celebration and connection.',
    ],
    'celebration': [
      'Wishing you joy and happiness on this special occasion. May this celebration bring wonderful memories.',
      'Celebrating you today! May this moment be filled with love, laughter, and everything that makes you smile.',
      'Here\'s to a wonderful celebration! Wishing you all the best and many happy moments ahead.',
    ],
  };
  
  const options = messages[eventType] || messages['celebration'];
  return options[variation - 1] || options[0];
}

function generateFooter(variation: number): string {
  const footers = [
    'With warm wishes',
    'Celebrating with you',
    'Best regards',
  ];
  return footers[variation - 1] || footers[0];
}
