/**
 * Canvas text fitting utilities - dynamically adjust font size and line height
 * to fit text within bounded rectangles while maintaining readability
 */

import { wrapText } from './textWrap';

export interface TextFitOptions {
  maxWidth: number;
  maxHeight: number;
  initialFontSize: number;
  minFontSize: number;
  lineHeightMultiplier: number;
  minLineHeightMultiplier: number;
}

export interface FittedTextResult {
  fontSize: number;
  lineHeight: number;
  lines: string[];
  totalHeight: number;
}

/**
 * Fits text within a bounded rectangle by adjusting font size and line height
 */
export function fitTextInBounds(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontFamily: string,
  options: TextFitOptions
): FittedTextResult {
  let fontSize = options.initialFontSize;
  let lineHeightMultiplier = options.lineHeightMultiplier;
  let lines: string[] = [];
  let totalHeight = 0;
  
  // Try to fit text, reducing font size if needed
  while (fontSize >= options.minFontSize) {
    ctx.font = `${fontSize}px ${fontFamily}`;
    lines = wrapText(ctx, text, options.maxWidth);
    
    const lineHeight = fontSize * lineHeightMultiplier;
    totalHeight = lines.length * lineHeight;
    
    // Check if it fits
    if (totalHeight <= options.maxHeight) {
      return {
        fontSize,
        lineHeight,
        lines,
        totalHeight,
      };
    }
    
    // Try tightening line height first
    if (lineHeightMultiplier > options.minLineHeightMultiplier) {
      lineHeightMultiplier -= 0.05;
      continue;
    }
    
    // Reduce font size
    fontSize -= 2;
    lineHeightMultiplier = options.lineHeightMultiplier; // Reset line height
  }
  
  // Return best effort with minimum font size
  ctx.font = `${options.minFontSize}px ${fontFamily}`;
  lines = wrapText(ctx, text, options.maxWidth);
  const lineHeight = options.minFontSize * options.minLineHeightMultiplier;
  totalHeight = lines.length * lineHeight;
  
  return {
    fontSize: options.minFontSize,
    lineHeight,
    lines,
    totalHeight,
  };
}

/**
 * Calculates safe text region bounds with padding
 */
export function calculateSafeTextRegion(
  canvasWidth: number,
  canvasHeight: number,
  paddingPercent: number = 10
): { x: number; y: number; width: number; height: number } {
  const padding = Math.min(canvasWidth, canvasHeight) * (paddingPercent / 100);
  
  return {
    x: padding,
    y: padding,
    width: canvasWidth - (padding * 2),
    height: canvasHeight - (padding * 2),
  };
}
