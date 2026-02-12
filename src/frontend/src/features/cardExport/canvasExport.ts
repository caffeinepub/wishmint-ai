/**
 * Canvas-based card image export with strict text rules, theme support,
 * typography hierarchy, premium visual effects, text fitting, decorations,
 * enhancement pass, and variation generation for both standard and premium cards.
 */

import { convertToShortWish } from './shortWishConverter';
import { sanitizeCardText } from './cardTextRules';
import { getThemeConfig, type CardTheme } from './cardThemes';
import { fitTextInBounds, calculateSafeTextRegion } from './fitText';
import { drawVignetteOverlay, drawMinimalCorners } from './canvasEffects';
import { enhanceCanvasRender } from './enhanceCanvasRender';
import { loadCardBackgroundImage } from './loadCardBackgroundImage';
import { getThemeById } from '../premiumCardDesigner/themes';
import type { PremiumDesignerState } from '../premiumCardDesigner/types';

export interface CardExportOptions {
  title?: string;
  footer?: string;
  resolution?: number;
  watermark?: boolean;
}

export interface CardVariationParams {
  decorationOffset: number;
  vignetteIntensity: number;
  glowIntensity: number;
  layoutVariant: 'centered' | 'top-heavy' | 'bottom-heavy';
}

/**
 * Exports a card to canvas with all visual effects and text rendering
 */
export async function exportCardToCanvas(
  wishMessage: string,
  theme: CardTheme,
  variationParams: CardVariationParams,
  options: CardExportOptions = {}
): Promise<HTMLCanvasElement> {
  const resolution = options.resolution || 1080;
  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Get theme configuration
  const themeConfig = getThemeConfig(theme);

  // Load and draw background
  try {
    const bgImage = await loadCardBackgroundImage(themeConfig.backgroundAsset);
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  } catch (error) {
    console.warn('Failed to load background, using fallback', error);
    // Fallback gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Apply vignette
  drawVignetteOverlay(ctx, canvas.width, canvas.height, variationParams.vignetteIntensity);

  // Convert and sanitize text
  const shortWish = convertToShortWish(wishMessage);
  const sanitizedWish = sanitizeCardText(shortWish);

  // Calculate safe text regions
  const safeRegion = calculateSafeTextRegion(canvas.width, canvas.height, 12);

  // Render title (if provided)
  if (options.title) {
    const sanitizedTitle = sanitizeCardText(options.title);
    const titleRegion = {
      ...safeRegion,
      height: safeRegion.height * 0.2,
    };

    const titleFit = fitTextInBounds(ctx, sanitizedTitle, themeConfig.titleFont, {
      maxWidth: titleRegion.width,
      maxHeight: titleRegion.height,
      initialFontSize: 72,
      minFontSize: 36,
      lineHeightMultiplier: 1.2,
      minLineHeightMultiplier: 1.0,
    });

    ctx.fillStyle = themeConfig.titleColor;
    ctx.font = `bold ${titleFit.fontSize}px ${themeConfig.titleFont}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    if (variationParams.glowIntensity > 0) {
      ctx.shadowColor = themeConfig.titleGlow;
      ctx.shadowBlur = variationParams.glowIntensity * 15;
    }

    let yOffset = titleRegion.y;
    for (const line of titleFit.lines) {
      ctx.fillText(line, canvas.width / 2, yOffset);
      yOffset += titleFit.lineHeight;
    }
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }

  // Render main message
  const messageYStart = options.title ? safeRegion.y + safeRegion.height * 0.25 : safeRegion.y + safeRegion.height * 0.15;
  const messageHeight = options.footer ? safeRegion.height * 0.5 : safeRegion.height * 0.7;

  const messageFit = fitTextInBounds(ctx, sanitizedWish, themeConfig.messageFont, {
    maxWidth: safeRegion.width,
    maxHeight: messageHeight,
    initialFontSize: 48,
    minFontSize: 28,
    lineHeightMultiplier: 1.4,
    minLineHeightMultiplier: 1.2,
  });

  ctx.fillStyle = themeConfig.messageColor;
  ctx.font = `${messageFit.fontSize}px ${themeConfig.messageFont}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  let messageY = messageYStart;
  if (variationParams.layoutVariant === 'centered') {
    messageY = (canvas.height - messageFit.totalHeight) / 2;
  } else if (variationParams.layoutVariant === 'bottom-heavy') {
    messageY = canvas.height - safeRegion.y - messageFit.totalHeight - (options.footer ? 100 : 50);
  }

  for (const line of messageFit.lines) {
    ctx.fillText(line, canvas.width / 2, messageY);
    messageY += messageFit.lineHeight;
  }

  // Render footer (if provided)
  if (options.footer) {
    const sanitizedFooter = sanitizeCardText(options.footer);
    const footerY = canvas.height - safeRegion.y - 60;

    ctx.fillStyle = themeConfig.footerColor;
    ctx.font = `italic 32px ${themeConfig.footerFont}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(sanitizedFooter, canvas.width / 2, footerY);
  }

  // Apply decorations
  drawMinimalCorners(
    ctx,
    canvas.width,
    canvas.height,
    themeConfig.decorationColor,
    40 + variationParams.decorationOffset
  );

  // Apply watermark if needed
  if (options.watermark) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('WishMint', canvas.width / 2, canvas.height - 20);
  }

  // Enhancement pass
  enhanceCanvasRender(canvas);

  return canvas;
}

/**
 * Exports a premium card with custom designer state
 * Returns a Blob for sharing or triggers download
 */
export async function exportPremiumCard(
  wishText: string,
  recipientName: string,
  designerState: PremiumDesignerState,
  format: 'square' | 'story',
  returnBlob: boolean = false
): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  
  // Set dimensions based on format
  if (format === 'square') {
    canvas.width = 1080;
    canvas.height = 1080;
  } else {
    canvas.width = 1080;
    canvas.height = 1920;
  }
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Get theme
  const theme = getThemeById(designerState.selectedTheme);

  // Draw background
  if (designerState.backgroundStyle === 'gradient') {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, theme.backgroundColors[0]);
    gradient.addColorStop(1, theme.backgroundColors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    // Glassmorphism
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, theme.backgroundColors[0]);
    gradient.addColorStop(1, theme.backgroundColors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add glass effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Draw uploaded photo if present
  if (designerState.uploadedPhoto) {
    try {
      const img = new Image();
      img.src = designerState.uploadedPhoto;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      const photoSize = Math.min(canvas.width, canvas.height) * 0.3;
      let photoY = 0;
      
      if (designerState.photoPlacement === 'top') {
        photoY = 100;
      } else if (designerState.photoPlacement === 'center') {
        photoY = (canvas.height - photoSize) / 2;
      } else {
        photoY = canvas.height - photoSize - 100;
      }
      
      const photoX = (canvas.width - photoSize) / 2;
      
      // Draw circular photo
      ctx.save();
      ctx.beginPath();
      ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, photoX, photoY, photoSize, photoSize);
      ctx.restore();
      
      // Draw border
      if (designerState.borderStyle !== 'none') {
        ctx.strokeStyle = theme.borderColor;
        ctx.lineWidth = designerState.borderStyle === 'decorative' ? 6 : 3;
        ctx.beginPath();
        ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
        ctx.stroke();
      }
    } catch (error) {
      console.warn('Failed to load uploaded photo', error);
    }
  }

  // Draw text
  const safeRegion = calculateSafeTextRegion(canvas.width, canvas.height, 10);
  const textY = format === 'square' ? canvas.height / 2 : canvas.height * 0.6;
  
  // Title
  ctx.fillStyle = designerState.fontColor || theme.textColor;
  ctx.font = `bold 64px ${theme.fontFamily}`;
  ctx.textAlign = designerState.textAlignment;
  const textX = designerState.textAlignment === 'center' ? canvas.width / 2 : 
                designerState.textAlignment === 'left' ? safeRegion.x : 
                canvas.width - safeRegion.x;
  
  ctx.fillText(`Happy Birthday ${recipientName}!`, textX, textY - 100);
  
  // Message
  ctx.font = `36px ${theme.fontFamily}`;
  const sanitizedWish = sanitizeCardText(wishText);
  const shortWish = convertToShortWish(sanitizedWish);
  
  const messageFit = fitTextInBounds(ctx, shortWish, theme.fontFamily, {
    maxWidth: safeRegion.width * 0.9,
    maxHeight: 400,
    initialFontSize: 36,
    minFontSize: 24,
    lineHeightMultiplier: 1.5,
    minLineHeightMultiplier: 1.3,
  });
  
  ctx.font = `${messageFit.fontSize}px ${theme.fontFamily}`;
  let messageY = textY;
  for (const line of messageFit.lines) {
    ctx.fillText(line, textX, messageY);
    messageY += messageFit.lineHeight;
  }

  // Draw decorative emojis if enabled
  if (designerState.emojiDecorationsEnabled) {
    ctx.font = '48px Arial';
    const emojis = theme.decorativeEmojis;
    const emojiCount = 8;
    
    for (let i = 0; i < emojiCount; i++) {
      const emoji = emojis[i % emojis.length];
      const x = (i / emojiCount) * canvas.width;
      const y = i % 2 === 0 ? 50 : canvas.height - 50;
      ctx.fillText(emoji, x, y);
    }
  }

  // Draw border if enabled
  if (designerState.borderStyle !== 'none') {
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = designerState.borderStyle === 'decorative' ? 8 : 4;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
  }

  // Enhancement pass
  enhanceCanvasRender(canvas);

  // Return blob or download
  if (returnBlob) {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });
  } else {
    // Download
    const link = document.createElement('a');
    link.download = `birthday-${format}-${recipientName.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    return null;
  }
}
