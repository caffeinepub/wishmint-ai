/**
 * Formats a Principal string for display by showing first and last characters
 * with an ellipsis in the middle to prevent layout overflow.
 * @param principal - The principal string to format
 * @param prefixLength - Number of characters to show at the start (default: 5)
 * @param suffixLength - Number of characters to show at the end (default: 3)
 * @returns Shortened principal string
 */
export function shortenPrincipal(
  principal: string,
  prefixLength: number = 5,
  suffixLength: number = 3
): string {
  if (principal.length <= prefixLength + suffixLength + 3) {
    return principal;
  }
  return `${principal.slice(0, prefixLength)}...${principal.slice(-suffixLength)}`;
}
