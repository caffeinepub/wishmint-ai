export interface SampleWish {
  name: string;
  relationship: string;
  tone: string;
  wish: string;
  styleTag?: string;
}

export const SAMPLE_WISHES: SampleWish[] = [
  {
    name: 'Sarah',
    relationship: 'best friend',
    tone: 'emotional',
    wish: 'Happy Birthday Sarah! You are not just my best friend, you are family. Through every laugh, every tear, and every adventure, you have been by my side. Thank you for being the most amazing person I know. Here is to many more years of friendship!',
    styleTag: 'Emotional',
  },
  {
    name: 'Mom',
    relationship: 'mom',
    tone: 'emotional',
    wish: 'Happy Birthday Mom! You are my hero, my inspiration, and my everything. Thank you for your unconditional love, endless support, and for always believing in me. I love you more than words can express. Have the most wonderful day!',
    styleTag: 'Emotional',
  },
  {
    name: 'Alex',
    relationship: 'friend',
    tone: 'funny',
    wish: 'Happy Birthday Alex! Another year older, but let\'s be honest, you stopped maturing at 12. Just kidding! You are awesome, and I am lucky to have a friend like you. Let\'s party like we are still young... oh wait, we are!',
    styleTag: 'Funny',
  },
  {
    name: 'Emma',
    relationship: 'girlfriend',
    tone: 'romantic',
    wish: 'Happy Birthday Emma! You are the love of my life, my best friend, and my everything. Every moment with you is a treasure, and I cannot wait to celebrate many more birthdays together. I love you endlessly. Have the most magical day, my love!',
    styleTag: 'Romantic',
  },
  {
    name: 'Mr. Johnson',
    relationship: 'teacher',
    tone: 'formal',
    wish: 'Happy Birthday Mr. Johnson! Thank you for your dedication, wisdom, and guidance. You inspire us every day to be better students and better people. Wishing you a wonderful birthday and a year filled with joy and success.',
    styleTag: 'Modern',
  },
  {
    name: 'Jake',
    relationship: 'brother',
    tone: 'light roast',
    wish: 'Happy Birthday Jake! Congrats on being one year closer to needing reading glasses and complaining about "kids these days." But seriously, you are an awesome brother, and I am glad we share the same weird sense of humor. Have a great one!',
    styleTag: 'Funny',
  },
];
