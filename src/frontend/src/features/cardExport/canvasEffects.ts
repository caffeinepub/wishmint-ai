/**
 * Canvas visual effects utilities for premium card rendering
 */

/**
 * Draws a soft vignette overlay for better text readability
 */
export function drawVignetteOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number = 0.4
): void {
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.3,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.8
  );
  
  gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
  gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity})`);
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Draws text with a subtle glow effect
 */
export function drawTextWithGlow(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  glowColor: string,
  glowBlur: number = 20
): void {
  // Draw glow layer
  ctx.save();
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = glowBlur;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.fillText(text, x, y);
  ctx.restore();
  
  // Draw text layer (crisp)
  ctx.fillText(text, x, y);
}

/**
 * Draws text with soft shadow for depth
 */
export function drawTextWithShadow(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  shadowColor: string = 'rgba(0, 0, 0, 0.5)',
  shadowBlur: number = 8,
  shadowOffset: number = 3
): void {
  ctx.save();
  ctx.shadowColor = shadowColor;
  ctx.shadowBlur = shadowBlur;
  ctx.shadowOffsetX = shadowOffset;
  ctx.shadowOffsetY = shadowOffset;
  ctx.fillText(text, x, y);
  ctx.restore();
}

/**
 * Draws sparkle decorations at edges
 */
export function drawEdgeSparkles(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
  count: number = 12
): void {
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.6;
  
  const edgeMargin = 50;
  const sparkleSize = 8;
  
  for (let i = 0; i < count; i++) {
    const isTopBottom = i % 2 === 0;
    let x: number, y: number;
    
    if (isTopBottom) {
      x = (i / count) * width;
      y = i % 4 === 0 ? edgeMargin : height - edgeMargin;
    } else {
      x = i % 4 === 1 ? edgeMargin : width - edgeMargin;
      y = (i / count) * height;
    }
    
    // Draw sparkle (4-pointed star)
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((i * Math.PI) / 6);
    
    ctx.beginPath();
    ctx.moveTo(0, -sparkleSize);
    ctx.lineTo(sparkleSize * 0.3, 0);
    ctx.lineTo(sparkleSize, 0);
    ctx.lineTo(sparkleSize * 0.3, 0);
    ctx.lineTo(0, sparkleSize);
    ctx.lineTo(-sparkleSize * 0.3, 0);
    ctx.lineTo(-sparkleSize, 0);
    ctx.lineTo(-sparkleSize * 0.3, 0);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }
  
  ctx.globalAlpha = 1;
}

/**
 * Draws confetti decorations at edges
 */
export function drawEdgeConfetti(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
  count: number = 20
): void {
  ctx.globalAlpha = 0.7;
  
  const edgeMargin = 60;
  const confettiSize = 12;
  
  for (let i = 0; i < count; i++) {
    const isTopBottom = i % 2 === 0;
    let x: number, y: number;
    
    if (isTopBottom) {
      x = (i / count) * width + (Math.random() - 0.5) * 100;
      y = i % 4 === 0 ? edgeMargin + Math.random() * 50 : height - edgeMargin - Math.random() * 50;
    } else {
      x = i % 4 === 1 ? edgeMargin + Math.random() * 50 : width - edgeMargin - Math.random() * 50;
      y = (i / count) * height + (Math.random() - 0.5) * 100;
    }
    
    // Random confetti shape
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.random() * Math.PI * 2);
    
    // Random color variation
    const hue = (i * 360 / count) % 360;
    ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
    
    // Draw rectangle confetti
    ctx.fillRect(-confettiSize / 2, -confettiSize / 4, confettiSize, confettiSize / 2);
    
    ctx.restore();
  }
  
  ctx.globalAlpha = 1;
}

/**
 * Draws minimal decorative elements (corners)
 */
export function drawMinimalCorners(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
  size: number = 40
): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.globalAlpha = 0.8;
  
  const margin = 30;
  
  // Top-left
  ctx.beginPath();
  ctx.moveTo(margin + size, margin);
  ctx.lineTo(margin, margin);
  ctx.lineTo(margin, margin + size);
  ctx.stroke();
  
  // Top-right
  ctx.beginPath();
  ctx.moveTo(width - margin - size, margin);
  ctx.lineTo(width - margin, margin);
  ctx.lineTo(width - margin, margin + size);
  ctx.stroke();
  
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(margin, height - margin - size);
  ctx.lineTo(margin, height - margin);
  ctx.lineTo(margin + size, height - margin);
  ctx.stroke();
  
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(width - margin - size, height - margin);
  ctx.lineTo(width - margin, height - margin);
  ctx.lineTo(width - margin, height - margin - size);
  ctx.stroke();
  
  ctx.globalAlpha = 1;
}
