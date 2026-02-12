import type { TemplateId } from '../generator/types';
import { TEMPLATES } from '../templates/templates';
import { wrapText } from './textWrap';
import { loadCardBackgroundImage } from './loadCardBackgroundImage';

export async function exportCardImage(wish: string, name: string, templateId: TemplateId) {
  const template = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas size (mobile-friendly)
  canvas.width = 1080;
  canvas.height = 1080;

  // Try to load and draw background image, fallback to gradient
  let backgroundDrawn = false;
  if (template.backgroundImage) {
    try {
      const bgImage = await loadCardBackgroundImage(template.backgroundImage);
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
      backgroundDrawn = true;
    } catch (error) {
      console.warn('Failed to load background image, using gradient fallback:', error);
    }
  }

  // Fallback to gradient background if image failed
  if (!backgroundDrawn) {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, template.canvasBg1);
    gradient.addColorStop(1, template.canvasBg2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add decorative elements for gradient backgrounds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.arc(200, 200, 300, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(880, 880, 250, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add semi-transparent overlay for better text readability on images
  if (backgroundDrawn) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Add branding
  ctx.fillStyle = template.canvasText;
  ctx.font = 'bold 48px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('WishMint AI', canvas.width / 2, 100);

  // Add recipient name
  ctx.font = 'bold 56px Inter, sans-serif';
  ctx.fillText(`Happy Birthday ${name}!`, canvas.width / 2, 200);

  // Add wish text with wrapping
  ctx.font = '36px Inter, sans-serif';
  ctx.textAlign = 'center';
  const lines = wrapText(ctx, wish, canvas.width - 160);
  const lineHeight = 50;
  const startY = 320;

  lines.forEach((line, index) => {
    ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
  });

  // Add footer
  ctx.font = '28px Inter, sans-serif';
  ctx.fillStyle = backgroundDrawn ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)';
  ctx.fillText('Made with ❤️ by WishMint AI', canvas.width / 2, canvas.height - 60);

  // Download
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `birthday-wish-${name.toLowerCase().replace(/\s+/g, '-')}.png`;
    a.click();
    URL.revokeObjectURL(url);
  });
}
