/*
 * The structured shape every page of notes is written in. Prose from
 * Guitar.docx lives in these blocks; interactive diagrams are `widget`
 * blocks that the renderer swaps for a component.
 */

export type WidgetName =
  | "note-circle"
  | "keyboard-enharmonics"
  | "keyboard-octaves"
  | "note-durations"
  | "step-keyboards"
  | "interval-table"
  | "interval-on-guitar"
  | "double-note"
  | "scale-sizes"
  | "scale-degrees"
  | "numbers-to-notes"
  | "secondary-dominants"
  | "substitute-dominants"
  | "tritone-substitution"
  | "relative-keys"
  | "mode-parent-finder"
  | "key-characters";

export type Block =
  | { type: "p"; text: string }
  | { type: "term"; term: string; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "facts"; items: { label: string; value: string }[] }
  | { type: "table"; columns: string[]; rows: string[][]; caption?: string; firstColumnHeader?: boolean }
  | { type: "callout"; tone: "tip" | "fix" | "todo"; title?: string; text: string }
  | { type: "figure"; src: string; alt: string; caption?: string; width: number; height: number }
  | { type: "audio"; href: string; label: string }
  | { type: "links"; items: { label: string; href: string }[] }
  | { type: "widget"; name: WidgetName };

export type Section = {
  id: string;
  title: string;
  blocks: Block[];
};

export type Topic = {
  slug: string;
  title: string;
  description: string;
  sections: Section[];
};
