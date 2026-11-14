import { createCn } from "cn/config";

/*
 * Class merging that knows the design system's custom type scale. Without
 * this, `text-body` (a font size) and `text-primary` (a colour) look like the
 * same group and one is silently dropped.
 */
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["overline", "caption", "body", "title", "heading", "display", "metric-sm", "metric", "metric-lg"] },
      ],
    },
  },
});
