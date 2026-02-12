import type { GeneratorFormData } from './types';
import { RELATIONSHIPS, TONES, LANGUAGES, PERSONALITIES } from './constants';

const SAMPLE_NAMES = [
  'Rahul', 'Priya', 'Amit', 'Sneha', 'Rohan', 'Anjali', 'Arjun', 'Kavya',
  'Vikram', 'Neha', 'Aditya', 'Riya', 'Karan', 'Pooja', 'Siddharth', 'Meera'
];

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function randomizeForm(currentName: string): GeneratorFormData {
  return {
    name: currentName.trim() || randomItem(SAMPLE_NAMES),
    yourName: '',
    relationship: randomItem(RELATIONSHIPS),
    tone: randomItem(TONES),
    language: randomItem(LANGUAGES),
    personality: randomItem(PERSONALITIES),
    memory: '',
  };
}
