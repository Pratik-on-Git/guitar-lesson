"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/*
 * A horizontal strip that scrolls instead of wrapping (emp-dashboard's
 * LineTabsList): no scrollbar, a fade on whichever edge has more content past
 * it, and the selected item kept in view. A tab cut off mid-word otherwise
 * reads as the end of the list.
 */

const FADE = "1.5rem";

export function ScrollFade({ children, className }: { children: React.ReactNode; className?: string }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });

  useEffect(() => {
    const node = scroller.current;
    if (!node) return;
    const measure = () => {
      const max = node.scrollWidth - node.clientWidth;
      setEdges((prev) => {
        const next = { start: node.scrollLeft > 1, end: node.scrollLeft < max - 1 };
        return prev.start === next.start && prev.end === next.end ? prev : next;
      });
    };
    // Scrolls the strip only; `scrollIntoView` would scroll the page too.
    const reveal = () => {
      const active = node.querySelector<HTMLElement>('[aria-checked="true"], [aria-selected="true"]');
      if (!active || node.scrollWidth <= node.clientWidth) return;
      const { left: activeLeft, width } = active.getBoundingClientRect();
      const { left: nodeLeft } = node.getBoundingClientRect();
      const inView = activeLeft >= nodeLeft && activeLeft + width <= nodeLeft + node.clientWidth;
      if (!inView) node.scrollTo({ left: Math.max(0, node.scrollLeft + activeLeft - nodeLeft - node.clientWidth / 2 + width / 2), behavior: "smooth" });
    };

    // Both observers report once on attach, so the first measure needs no synchronous call.
    const resize = new ResizeObserver(() => {
      measure();
      reveal();
    });
    resize.observe(node);
    const selection = new MutationObserver(reveal);
    selection.observe(node, { subtree: true, attributeFilter: ["aria-checked", "aria-selected"] });
    node.addEventListener("scroll", measure, { passive: true });
    return () => {
      resize.disconnect();
      selection.disconnect();
      node.removeEventListener("scroll", measure);
    };
  }, []);

  const mask =
    edges.start && edges.end
      ? `linear-gradient(to right, transparent, black ${FADE}, black calc(100% - ${FADE}), transparent)`
      : edges.end
        ? `linear-gradient(to right, black calc(100% - ${FADE}), transparent)`
        : edges.start
          ? `linear-gradient(to right, transparent, black ${FADE})`
          : undefined;

  return (
    <div
      ref={scroller}
      className={cn("max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className)}
      style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
    >
      {children}
    </div>
  );
}
