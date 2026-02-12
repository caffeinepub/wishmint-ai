export type Relationship =
  | 'friend'
  | 'best friend'
  | 'mom'
  | 'dad'
  | 'brother'
  | 'sister'
  | 'girlfriend'
  | 'boyfriend'
  | 'crush'
  | 'teacher'
  | 'colleague';

export type Tone =
  | 'emotional'
  | 'funny'
  | 'romantic'
  | 'formal'
  | 'short & sweet'
  | 'light roast';

export type Language = 'English' | 'Hinglish' | 'Hindi';

export type Personality =
  | 'kind'
  | 'fun'
  | 'hardworking'
  | 'cute'
  | 'savage'
  | 'supportive'
  | 'creative'
  | 'introvert';

export interface GeneratorFormData {
  name: string;
  yourName: string;
  relationship: Relationship;
  tone: Tone;
  language: Language;
  personality: Personality;
  memory: string;
}

export interface BirthdayPack {
  mainWish: string;
  whatsappShort: string;
  instagramCaption: string;
  miniSpeech: string;
  hashtags: string;
}

export type TemplateId =
  | 'minimal'
  | 'cute'
  | 'luxury'
  | 'anime'
  | 'neon'
  | 'classic'
  | 'aesthetic'
  | 'funny';
