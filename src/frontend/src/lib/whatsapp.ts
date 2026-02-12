export function createWhatsAppLink(text: string): string {
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/?text=${encodedText}`;
}
