import { Children, cloneElement, isValidElement, type ReactNode } from "react";

const minorWords = new Set(["a", "an", "and", "as", "at", "but", "by", "for", "from", "in", "into", "nor", "of", "on", "or", "per", "the", "to", "via", "vs", "with"]);

/** Title Case for interface copy, preserving notation, acronyms and internal capitals. */
export function titleCase(text: string): string {
  const words = [...text.matchAll(/[\p{L}\p{N}][\p{L}\p{N}♯♭#'’]*/gu)];
  let index = 0;
  return text.replace(/[\p{L}\p{N}][\p{L}\p{N}♯♭#'’]*/gu, (word, offset: number) => {
    const position = index++;
    if (/^(?:p|pp|e\.g|i\.e)$/u.test(word) && text[offset + word.length] === ".") return word;
    // Preserve formulas (m7, b3), roman degrees, acronyms and intentional names.
    if (/\d|[♯♭#]/u.test(word) || /^(?:[ivIV]+|do|re|mi|fa|sol|la|ti)$/u.test(word) || /[A-Z].*[A-Z]|[a-z][A-Z]/u.test(word)) return word;
    const first = position === 0 || /[:.!?·]\s*$/u.test(text.slice(0, offset));
    if (!first && position !== words.length - 1 && minorWords.has(word.toLowerCase())) return word.toLowerCase();
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
}

/** Only formats displayed labels; never changes values, URLs, IDs or stored data. */
export function titleCaseLabel(node: ReactNode): ReactNode {
  if (typeof node === "string") return titleCase(node);
  if (Array.isArray(node)) return Children.map(node, titleCaseLabel);
  if (isValidElement<{ children?: ReactNode }>(node) && node.props.children !== undefined) {
    // Cards and navigation links sometimes contain descriptive copy as well.
    const className = (node.props as { className?: string }).className ?? "";
    if (node.type === "p" || node.type === "small" || className.includes("text-muted-foreground") || className.includes("text-sidebar-foreground/60") || className.includes("sr-only")) return node;
    return cloneElement(node, undefined, titleCaseLabel(node.props.children));
  }
  return node;
}
