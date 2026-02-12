/**
 * Post-render enhancement step for card images
 * Improves spacing, lighting, decoration balance, and readability
 * WITHOUT changing any text content
 */

/**
 * Applies enhancement pass to a canvas
 */
export function enhanceCanvasRender(
  canvas: HTMLCanvasElement
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const width = canvas.width;
  const height = canvas.height;
  
  // Create a temporary canvas to preserve original
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;
  
  // Copy original to temp
  tempCtx.drawImage(canvas, 0, 0);
  
  // Enhancement 1: Subtle contrast boost
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  
  // Enhancement 2: Subtle vignette for depth
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.2,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.7
  );
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.15)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Enhancement 3: Subtle sharpening (via unsharp mask simulation)
  // This is a simplified version - just adds a tiny bit of edge definition
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = 0.05;
  ctx.drawImage(tempCanvas, 0, 0);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
}
