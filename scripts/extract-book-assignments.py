"""Extract the supplied book's numbered practical assignments (PyMuPDF).

Column and heading boundaries are explicit so two-column continuation lines
cannot become part of the neighbouring exercise. Keep original numbering.
"""
from pathlib import Path
import json
import re
import pymupdf

chapters = {19: "Pentatonic & blues", 27: "Major modes", 35: "Harmonic-minor modes",
            43: "Melodic-minor modes", 53: "Symmetric scales", 58: "Root-position chords",
            66: "Drop 2", 74: "Drop 3", 82: "Arpeggios", 95: "Harmonization"}
assignments = []
with pymupdf.open(next(Path.cwd().glob("Yiannis Papadopoulos*.pdf"))) as document:
    for number, chapter in chapters.items():
        page = document[number - 1]
        headings = []
        for rect in sorted(page.search_for("SUGGESTED EXERCISES AND ASSIGNMENTS"), key=lambda r: r.y0):
            if not headings or abs(headings[-1].y0 - rect.y0) > 3:
                headings.append(rect)
        for part, heading in enumerate(headings, 1):
            bottom = headings[part].y0 - 2 if part < len(headings) else 730
            caution = page.search_for("BE VERY CAREFUL")
            if caution and caution[0].y0 > heading.y1:
                bottom = min(bottom, caution[0].y0 - 3)
            items = []
            for left, right in [(65, 306), (306, 551)]:
                text = page.get_text(clip=pymupdf.Rect(left, heading.y1 + 1, right, bottom), sort=True)
                matches = list(re.finditer(r"(?m)^\s*(\d+)\.\s+", text))
                for i, match in enumerate(matches):
                    end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
                    prompt = re.sub(r"\s+", " ", text[match.end():end]).strip()
                    items.append({"id": f"p{number}-part{part}-{match[1]}", "page": number,
                                  "chapter": chapter, "part": part, "number": int(match[1]), "prompt": prompt})
            assignments.extend(sorted(items, key=lambda a: a["number"]))
assert len(assignments) == 214, f"Unexpected assignment count: {len(assignments)}"
assert len({a["id"] for a in assignments}) == 214
assert all(a["prompt"].endswith(".") for a in assignments), "Check column/paragraph boundaries"
Path("lib/content/book-assignments.ts").write_text(
    "// Generated from the user-supplied PDF by scripts/extract-book-assignments.py.\n"
    "// Source wording and numbering retained; p. 74 part 2 has no items 5 or 6.\n"
    "export type BookAssignment = { id: string; page: number; chapter: string; part: number; number: number; prompt: string };\n"
    "export const BOOK_ASSIGNMENTS: BookAssignment[] = "
    + json.dumps(assignments, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
print(f"Extracted {len(assignments)} numbered assignments across {len(chapters)} practical chapter pages.")
