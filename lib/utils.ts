import { createCn } from "cn/config";

/*
 * Class merging that knows the design system's custom tokens. Without this,
 * `text-caption` (a font size) and `text-slate` (a colour) look like the same
 * group and one is silently dropped.
 */
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: ["caption", "body", "subheading", "heading-sm", "heading", "display"] }],
      rounded: [{ rounded: ["card", "input", "button", "icon"] }],
      shadow: [{ shadow: ["soft"] }],
    },
  },
});
