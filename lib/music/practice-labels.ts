/** Older browser-local sessions may still contain the previous source-prefixed labels. */
export function practiceFocusLabel(focus: string): string {
  const label = focus.replace(/^Carter\s*·\s*/i, "");
  return label.charAt(0).toUpperCase() + label.slice(1);
}
