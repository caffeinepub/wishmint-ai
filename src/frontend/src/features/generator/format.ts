import type { BirthdayPack } from './types';

export function formatBirthdayPack(pack: BirthdayPack): string {
  return `🎉 BIRTHDAY PACK 🎉

📝 MAIN WISH:
${pack.mainWish}

💬 WHATSAPP SHORT:
${pack.whatsappShort}

📸 INSTAGRAM CAPTION:
${pack.instagramCaption}

🎤 MINI SPEECH (10-15s):
${pack.miniSpeech}

#️⃣ HASHTAGS:
${pack.hashtags}

---
Generated with ❤️ by WishMint AI`;
}
