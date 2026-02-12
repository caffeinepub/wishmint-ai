export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines?: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
      
      // Check max lines limit
      if (maxLines && lines.length >= maxLines) {
        break;
      }
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine && (!maxLines || lines.length < maxLines)) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Wraps text with emoji-aware handling
 */
export function wrapTextEmojiAware(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines?: number
): string[] {
  // Split by spaces but keep emojis intact
  const tokens = text.match(/[\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\p{Emoji_Presentation}]+|[^\s\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\p{Emoji_Presentation}]+/gu) || [];
  const lines: string[] = [];
  let currentLine = '';

  for (const token of tokens) {
    const testLine = currentLine + (currentLine ? ' ' : '') + token;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = token;
      
      if (maxLines && lines.length >= maxLines) {
        break;
      }
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine && (!maxLines || lines.length < maxLines)) {
    lines.push(currentLine);
  }

  return lines;
}
