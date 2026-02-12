import type { Language } from './types';

export function getLanguagePhrases(language: Language) {
  if (language === 'Hindi') {
    return hindiPhrases;
  } else if (language === 'Hinglish') {
    return hinglishPhrases;
  }
  return englishPhrases;
}

const englishPhrases = {
  greetings: ['Happy Birthday', 'Wishing you the happiest birthday', 'Many happy returns'],
  closings: [
    'May all your dreams come true!',
    'Wishing you joy and happiness!',
    'Have the best day ever!',
  ],
  emotional: {
    default: 'You mean the world to me, and I am so grateful to have you in my life.',
    'best friend': 'You are not just my best friend, you are family. Thank you for always being there.',
    mom: 'Mom, you are my hero, my inspiration, and my everything. I love you more than words can say.',
    dad: 'Dad, you have always been my rock and my guide. Thank you for everything.',
    girlfriend: 'You make every day brighter just by being in it. I love you endlessly.',
    boyfriend: 'You are my best friend and my love. I am so lucky to have you.',
  },
  funny: {
    default: 'Another year older, but definitely not wiser! Just kidding, you are amazing!',
    'best friend': 'Happy birthday to someone who is almost as awesome as me! Almost.',
    brother: 'Congrats on being one year closer to needing reading glasses!',
    sister: 'Happy birthday! Remember, age is just a number... a really big number in your case!',
  },
  romantic: {
    default: 'Every moment with you is a treasure. Happy birthday, my love.',
    girlfriend: 'You are the love of my life, and I cannot wait to celebrate many more birthdays with you.',
    boyfriend: 'Happy birthday to the man who stole my heart and never gave it back.',
    crush: 'Wishing you the most wonderful birthday. You deserve all the happiness in the world.',
  },
  formal: {
    default: 'Wishing you a very happy birthday and a prosperous year ahead.',
    teacher: 'Happy birthday! Thank you for your guidance and wisdom. You inspire us every day.',
    colleague: 'Wishing you a wonderful birthday and continued success in all your endeavors.',
  },
  shortSweet: {
    default: 'Happy birthday! Hope your day is as special as you are!',
  },
  roast: {
    default: 'Happy birthday! You are getting old, but at least you are getting better at hiding it!',
    'best friend': 'Another year, another wrinkle! But hey, you still look... interesting!',
  },
  whatsappShort: {
    default: 'Happy Birthday {name}! Have an amazing day!',
    funny: 'Happy Birthday {name}! Time to party like it\'s 1999... oh wait, you were probably born then!',
    romantic: 'Happy Birthday {name}! You make my world complete!',
  },
  instagramCaption: {
    default: 'Celebrating this amazing human today! Happy Birthday {name}! 🎉🎂',
    funny: 'It\'s {name}\'s birthday! Let\'s embarrass them with old photos! 😂🎈',
    romantic: 'Happy Birthday to my everything, {name}! ❤️🎂',
  },
  miniSpeech: {
    default: 'I just wanted to take a moment to wish you the happiest of birthdays. You are such a {personality} person, and I am so grateful to know you.',
    emotional: 'Today we celebrate you, {name}. Your {personality} heart touches everyone around you. Thank you for being you.',
    funny: 'So {name}, you are officially older! But do not worry, you are still {personality} and hilarious.',
  },
};

const hinglishPhrases = {
  greetings: ['Happy Birthday', 'Janamdin Mubarak', 'Bahut bahut badhai'],
  closings: [
    'Tumhari saari wishes poori ho!',
    'Khush raho hamesha!',
    'Have the best day yaar!',
  ],
  emotional: {
    default: 'Tum mere liye bahut special ho, aur main bahut lucky hoon ki tum mere life mein ho.',
    'best friend': 'Yaar, tu sirf best friend nahi, family hai. Hamesha saath rehna.',
    mom: 'Maa, aap meri hero ho, meri inspiration ho. I love you so much.',
    dad: 'Papa, aap hamesha mere support rahe ho. Thank you for everything.',
  },
  funny: {
    default: 'Ek saal aur bada ho gaya! Par tension mat lo, abhi bhi young ho!',
    'best friend': 'Happy birthday yaar! Tu almost mere jitna cool hai... almost!',
  },
  romantic: {
    default: 'Har pal tumhare saath special hai. Happy birthday, my love.',
    girlfriend: 'Tum meri zindagi ho. Happy birthday jaan!',
    boyfriend: 'Happy birthday mere hero! Love you so much!',
  },
  formal: {
    default: 'Aapko janamdin ki bahut shubhkamnayein.',
    teacher: 'Happy birthday sir/ma\'am! Aapki guidance ke liye thank you.',
  },
  shortSweet: {
    default: 'Happy birthday! Enjoy karo aaj!',
  },
  roast: {
    default: 'Happy birthday! Budhe ho rahe ho, par koi baat nahi!',
  },
  whatsappShort: {
    default: 'Happy Birthday {name}! Mast din ho aapka!',
    funny: 'Happy Birthday {name}! Party hard karo!',
    romantic: 'Happy Birthday {name}! Love you jaan!',
  },
  instagramCaption: {
    default: 'Celebrating this amazing insaan today! Happy Birthday {name}! 🎉',
    funny: '{name} ka birthday hai! Let\'s party! 😂🎈',
    romantic: 'Happy Birthday to my jaan, {name}! ❤️',
  },
  miniSpeech: {
    default: 'Main bas yeh kehna chahta hoon ki happy birthday {name}. Tum bahut {personality} ho.',
    emotional: 'Aaj hum celebrate karte hain tumhe, {name}. Tumhara {personality} dil sabko touch karta hai.',
  },
};

const hindiPhrases = {
  greetings: ['जन्मदिन मुबारक', 'जन्मदिन की हार्दिक शुभकामनाएं', 'बहुत बहुत बधाई'],
  closings: [
    'आपकी सारी मनोकामनाएं पूरी हों!',
    'हमेशा खुश रहें!',
    'आपका दिन शुभ हो!',
  ],
  emotional: {
    default: 'आप मेरे लिए बहुत खास हैं, और मैं भाग्यशाली हूं कि आप मेरे जीवन में हैं।',
    mom: 'माँ, आप मेरी प्रेरणा हैं। मैं आपसे बहुत प्यार करता हूं।',
    dad: 'पिताजी, आप हमेशा मेरे सहारे रहे हैं। धन्यवाद।',
  },
  funny: {
    default: 'एक साल और बड़े हो गए! पर चिंता मत करो, अभी भी जवान हो!',
  },
  romantic: {
    default: 'हर पल आपके साथ खास है। जन्मदिन मुबारक, मेरे प्यार।',
    girlfriend: 'आप मेरी जिंदगी हो। जन्मदिन मुबारक जान!',
  },
  formal: {
    default: 'आपको जन्मदिन की हार्दिक शुभकामनाएं।',
    teacher: 'जन्मदिन मुबारक! आपके मार्गदर्शन के लिए धन्यवाद।',
  },
  shortSweet: {
    default: 'जन्मदिन मुबारक! आज का दिन खास हो!',
  },
  roast: {
    default: 'जन्मदिन मुबारक! बूढ़े हो रहे हो, पर कोई बात नहीं!',
  },
  whatsappShort: {
    default: 'जन्मदिन मुबारक {name}! शुभ दिन हो!',
    romantic: 'जन्मदिन मुबारक {name}! प्यार करते हैं!',
  },
  instagramCaption: {
    default: 'आज इस अद्भुत व्यक्ति का जन्मदिन है! {name} को बधाई! 🎉',
    romantic: 'मेरे जान {name} को जन्मदिन मुबारक! ❤️',
  },
  miniSpeech: {
    default: 'मैं बस यह कहना चाहता हूं कि जन्मदिन मुबारक {name}। आप बहुत {personality} हैं।',
  },
};
