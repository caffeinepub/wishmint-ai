import type { TemplateId } from '../generator/types';
import type { PremiumDesignerState } from '../premiumCardDesigner/types';
import { TEMPLATES } from '../templates/templates';
import { getThemeById } from '../premiumCardDesigner/themes';
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

export async function exportPremiumCard(
  wish: string,
  name: string,
  designerState: PremiumDesignerState,
  format: 'square' | 'story',
  returnBlob = false
): Promise<Blob | void> {
  const theme = getThemeById(designerState.selectedTheme);
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas size based on format
  if (format === 'story') {
    canvas.width = 1080;
    canvas.height = 1920;
  } else {
    canvas.width = 1080;
    canvas.height = 1080;
  }

  // Draw background
  if (designerState.backgroundStyle === 'gradient') {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, theme.backgroundColors[0]);
    gradient.addColorStop(1, theme.backgroundColors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    // Glassmorphism - use semi-transparent gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, theme.backgroundColors[0] + '66');
    gradient.addColorStop(1, theme.backgroundColors[1] + '66');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Draw decorative emojis
  if (designerState.emojiDecorationsEnabled) {
    ctx.font = '64px Arial';
    theme.decorativeEmojis.forEach((emoji, index) => {
      const x = ((index * 23 + 10) % 90) * canvas.width / 100;
      const y = ((index * 17 + 5) % 90) * canvas.height / 100;
      ctx.globalAlpha = 0.6;
      ctx.fillText(emoji, x, y);
      ctx.globalAlpha = 1;
    });
  }

  // Draw uploaded photo if present
  if (designerState.uploadedPhoto) {
    try {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = designerState.uploadedPhoto!;
      });

      const photoSize = 250;
      const photoX = canvas.width / 2 - photoSize / 2;
      let photoY: number;
      
      if (designerState.photoPlacement === 'top') {
        photoY = canvas.height * 0.1;
      } else if (designerState.photoPlacement === 'center') {
        photoY = canvas.height / 2 - photoSize / 2;
      } else {
        photoY = canvas.height * 0.9 - photoSize;
      }

      // Draw circular photo with border
      ctx.save();
      ctx.beginPath();
      ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, photoX, photoY, photoSize, photoSize);
      ctx.restore();

      // Draw border
      ctx.strokeStyle = theme.accentColor;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
      ctx.stroke();
    } catch (error) {
      console.error('Failed to draw photo:', error);
    }
  }

  // Draw border
  if (designerState.borderStyle !== 'none') {
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = designerState.borderStyle === 'decorative' ? 12 : 8;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    if (designerState.borderStyle === 'decorative') {
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
    }
  }

  // Set font based on style
  let fontFamily = 'Arial, sans-serif';
  switch (designerState.fontStyle) {
    case 'rounded':
      fontFamily = 'Comic Sans MS, cursive';
      break;
    case 'elegant':
      fontFamily = 'Georgia, serif';
      break;
    case 'modern':
      fontFamily = 'Helvetica, Arial, sans-serif';
      break;
    case 'handwritten':
      fontFamily = 'Courier New, monospace';
      break;
  }

  // Draw title
  ctx.fillStyle = designerState.fontColor;
  ctx.font = `bold 72px ${fontFamily}`;
  ctx.textAlign = designerState.textAlignment;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  const titleX = designerState.textAlignment === 'left' ? 100 : 
                 designerState.textAlignment === 'right' ? canvas.width - 100 : 
                 canvas.width / 2;
  const titleY = format === 'story' ? 300 : 200;
  
  ctx.fillText(`Happy Birthday ${name}!`, titleX, titleY);

  // Draw wish text with wrapping
  ctx.font = `48px ${fontFamily}`;
  const maxWidth = canvas.width - 200;
  const lines = wrapText(ctx, wish, maxWidth);
  const lineHeight = 70;
  const startY = format === 'story' ? 450 : 350;

  lines.forEach((line, index) => {
    const lineX = designerState.textAlignment === 'left' ? 100 : 
                  designerState.textAlignment === 'right' ? canvas.width - 100 : 
                  canvas.width / 2;
    ctx.fillText(line, lineX, startY + index * lineHeight);
  });

  // Draw footer
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.font = `36px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.globalAlpha = 0.8;
  ctx.fillText('Made with ❤️ by WishMint AI', canvas.width / 2, canvas.height - 80);
  ctx.globalAlpha = 1;

  // Return blob or download
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve();
        return;
      }

      if (returnBlob) {
        resolve(blob);
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `birthday-card-${format}-${name.toLowerCase().replace(/\s+/g, '-')}.png`;
        a.click();
        URL.revokeObjectURL(url);
        resolve();
      }
    });
  });
}
