import type { GeneratorFormData, BirthdayPack } from './types';
import { getLanguagePhrases } from './languagePacks';

export function generateBirthdayPack(formData: GeneratorFormData): BirthdayPack {
  const phrases = getLanguagePhrases(formData.language);
  const { name, yourName, relationship, tone, personality, memory } = formData;

  // Generate Main Wish
  const mainWish = generateMainWish(name, yourName, relationship, tone, personality, memory, phrases);

  // Generate WhatsApp Short
  const whatsappShort = generateWhatsAppShort(name, relationship, tone, phrases);

  // Generate Instagram Caption
  const instagramCaption = generateInstagramCaption(name, relationship, tone, phrases);

  // Generate Mini Speech (10-15s)
  const miniSpeech = generateMiniSpeech(name, yourName, relationship, tone, personality, phrases);

  // Generate Hashtags
  const hashtags = generateHashtags(relationship, tone);

  return {
    mainWish,
    whatsappShort,
    instagramCaption,
    miniSpeech,
    hashtags,
  };
}

function generateMainWish(
  name: string,
  yourName: string,
  relationship: string,
  tone: string,
  personality: string,
  memory: string,
  phrases: any
): string {
  const greeting = phrases.greetings[Math.floor(Math.random() * phrases.greetings.length)];
  const closing = phrases.closings[Math.floor(Math.random() * phrases.closings.length)];

  let wish = `${greeting} ${name}!\n\n`;

  // Tone-specific content
  if (tone === 'emotional') {
    wish += `${phrases.emotional[relationship] || phrases.emotional.default} `;
    wish += `Your ${personality} nature makes you truly special. `;
  } else if (tone === 'funny') {
    wish += `${phrases.funny[relationship] || phrases.funny.default} `;
    wish += `Your ${personality} personality always cracks me up! `;
  } else if (tone === 'romantic') {
    wish += `${phrases.romantic[relationship] || phrases.romantic.default} `;
    wish += `Your ${personality} soul captivates me every day. `;
  } else if (tone === 'formal') {
    wish += `${phrases.formal[relationship] || phrases.formal.default} `;
    wish += `Your ${personality} character is truly admirable. `;
  } else if (tone === 'short & sweet') {
    wish += `${phrases.shortSweet[relationship] || phrases.shortSweet.default} `;
  } else if (tone === 'light roast') {
    wish += `${phrases.roast[relationship] || phrases.roast.default} `;
    wish += `But seriously, your ${personality} side is what we all love! `;
  }

  // Add memory if provided
  if (memory) {
    wish += `\n\n${memory} Those moments mean the world to me. `;
  }

  wish += `\n\n${closing}`;
  if (yourName) {
    wish += `\n- ${yourName}`;
  }

  return wish;
}

function generateWhatsAppShort(name: string, relationship: string, tone: string, phrases: any): string {
  const emoji = tone === 'funny' ? '😂' : tone === 'romantic' ? '❤️' : '🎉';
  const shortMsg = phrases.whatsappShort[tone] || phrases.whatsappShort.default;
  return `${emoji} ${shortMsg.replace('{name}', name)} ${emoji}`;
}

function generateInstagramCaption(name: string, relationship: string, tone: string, phrases: any): string {
  const caption = phrases.instagramCaption[tone] || phrases.instagramCaption.default;
  return caption.replace('{name}', name);
}

function generateMiniSpeech(
  name: string,
  yourName: string,
  relationship: string,
  tone: string,
  personality: string,
  phrases: any
): string {
  const intro = `Hey ${name}!`;
  const body = phrases.miniSpeech[tone] || phrases.miniSpeech.default;
  const outro = `Have an amazing birthday!`;
  
  return `${intro} ${body.replace('{name}', name).replace('{personality}', personality)} ${outro}`;
}

function generateHashtags(relationship: string, tone: string): string {
  const baseHashtags = ['#HappyBirthday', '#BirthdayWishes', '#Celebration'];
  
  const relationshipTags: Record<string, string[]> = {
    'best friend': ['#BestFriendBirthday', '#BFFGoals', '#FriendshipGoals'],
    'mom': ['#MomBirthday', '#BestMom', '#MomLove'],
    'dad': ['#DadBirthday', '#BestDad', '#DadLove'],
    'girlfriend': ['#GirlfriendBirthday', '#LoveOfMyLife', '#CoupleGoals'],
    'boyfriend': ['#BoyfriendBirthday', '#MyLove', '#RelationshipGoals'],
    'crush': ['#CrushBirthday', '#SecretAdmirer', '#SpecialDay'],
  };

  const toneTags: Record<string, string[]> = {
    'emotional': ['#Heartfelt', '#EmotionalMoment', '#FromTheHeart'],
    'funny': ['#BirthdayHumor', '#FunnyBirthday', '#LOL'],
    'romantic': ['#RomanticBirthday', '#LoveYou', '#ForeverYours'],
  };

  const tags = [
    ...baseHashtags,
    ...(relationshipTags[relationship] || ['#SpecialPerson']),
    ...(toneTags[tone] || ['#BirthdayVibes']),
  ];

  return tags.join(' ');
}
