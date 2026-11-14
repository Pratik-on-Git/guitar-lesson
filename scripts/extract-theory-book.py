"""Extract illustration assets and audio-link provenance from the supplied Carter PDF.

Optional build-time utility: Python + PyMuPDF. The app has no PDF/Python runtime
dependency. Source prose remains in ignored .local review files.
"""
from pathlib import Path
import json
import re
import pymupdf

ROOT = Path(__file__).resolve().parents[1]
SOURCE = next(ROOT.glob("Music Theory From Beginner to Expert*.pdf"))
titles = {
    15: ["Notes on the keyboard"], 16: ["Chromatic note circle"],
    18: ["Piano octave registers"], 20: ["Pitch adjustment example"],
    26: ["Chromatic interval table"], 36: ["Minor pentatonic structure"],
    38: ["Major pentatonic structure"], 44: ["Minor-pentatonic modes in A"],
    45: ["Pentatonic mode interval comparison"],
    49: ["Major-scale step structure", "Major scale on low E"],
    50: ["A major on the keyboard"], 51: ["Relative major and minor"],
    52: ["Natural minor on low E"], 53: ["A natural minor structure"],
    56: ["Major scales in all keys"], 66: ["Parallel major modes in C"],
    67: ["Major-mode intervals and notes"], 73: ["A harmonic minor structure"],
    79: ["Harmonic-minor modes in A"], 80: ["Harmonic-minor mode intervals"],
    82: ["A melodic minor structure"], 87: ["Melodic-minor modes in A"],
    88: ["Melodic-minor mode intervals"], 89: ["Scale comparison 1", "Scale comparison 2"],
    93: ["Circle of fifths"], 95: ["Scale degrees and stacked thirds"],
    101: ["Triad chord formulas"], 102: ["Triad interval structures"],
    105: ["Four-note chord formulas", "Four-note chord interval structures"],
    107: ["Degrees beyond the octave"], 108: ["Extending chords in thirds"],
    111: ["Compound intervals and extensions"], 117: ["Major-chord alterations"],
    118: ["Minor-chord alterations"], 120: ["Dominant-chord alterations"],
    123: ["C7 chord tones", "C7 with altered tensions", "Altered collection respelling"],
    124: ["Mixolydian and dominant harmony"], 125: ["Stacked-fourth example"],
    126: ["C major through the thirteenth", "Thirds on every C-major degree"],
    127: ["D-major reference"], 128: ["B-major reference", "Diatonic triads in C"],
    129: ["Major-key triad sequence"], 130: ["Major-key seventh sequence"],
    131: ["Natural-minor triad sequence", "Natural-minor seventh sequence"],
    137: ["Slash-chord notation"], 140: ["Polychord notation"],
    141: ["Gmaj7 above A minor", "G major above D minor"],
    153: ["Quarter-note pulse in 4/4", "Eighth-note subdivision in 4/4"],
    154: ["Sixteenth-note subdivision in 4/4"],
    156: ["Six eighth-note units in 6/8"], 218: ["Major-key cheat sheet"],
}

def lesson(page):
    if page <= 20: return "/learn/tuning" if page == 20 else "/learn/notes"
    if page == 26: return "/learn/intervals"
    if page <= 45: return "/modes/minor-pentatonic"
    if page <= 56: return "/scales/major"
    if page <= 67: return "/modes/major"
    if page <= 80: return "/modes/harmonic-minor"
    if page <= 89: return "/modes/melodic-minor"
    if page == 93: return "/circle-of-fifths"
    if page <= 106: return "/chords"
    if page <= 124: return "/learn/extended-chords"
    if page == 125 or 137 <= page <= 141: return "/harmony-lab"
    if page <= 131: return "/harmonization"
    if page <= 156: return "/rhythm-lab"
    return "/scales/major"

figures, audio, pages = [], [], []
with pymupdf.open(SOURCE) as document:
    assert len(document) == 220
    for number, page in enumerate(document, 1):
        source_text = page.get_text(sort=True)
        pages.append(f"=== PDF PAGE {number} ===\n{source_text}")
        for match in re.finditer(r"https?://goo\.gl/[A-Za-z0-9]+", source_text):
            lead = source_text[max(0, match.start() - 150):match.start()]
            labels = ([f"Minor pentatonic · mode {i} · A tonic" for i in range(1, 6)]
                + [f"Major family · {name} · C tonic" for name in ["Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian"]]
                + [f"Harmonic minor · mode {i} · A tonic" for i in range(1, 8)]
                + [f"Melodic minor · mode {i} · A tonic" for i in range(1, 8)]
                + [f"Rhythm unit {i}" for i in range(1, 10)] + ["Four-bar sequence 1"]
                + [f"Rhythm unit {i}" for i in range(10, 18)] + ["Four-bar sequence 2"])
            label = labels[len(audio)]
            audio.append({"id": f"audio-{len(audio)+1}", "page": number,
                          "label": label, "href": match.group(0)})
        if number not in titles:
            continue
        images = page.get_image_info()
        assert len(images) == len(titles[number]), f"Check illustrations on page {number}"
        for i, info in enumerate(images):
            # Figures are redrawn in components/visuals/theory-figures.tsx; only their identity is kept.
            figures.append({"id": f"p{number}-{i+1}", "page": number, "title": titles[number][i], "href": lesson(number)})
review = ROOT / ".local/theory-book"
review.mkdir(parents=True, exist_ok=True)
(review / "book.txt").write_text("\n".join(pages), encoding="utf-8")
(ROOT / "lib/content/theory-book-assets.ts").write_text(
    "// Generated by scripts/extract-theory-book.py from the supplied PDF.\n"
    "export type TheoryFigure = { id: string; page: number; title: string; src: string; width: number; height: number; href: string };\n"
    "export const THEORY_FIGURES: TheoryFigure[] = " + json.dumps(figures, ensure_ascii=False, indent=2)
    + ";\nexport const THEORY_ORIGINAL_AUDIO = " + json.dumps(audio, ensure_ascii=False, indent=2) + ";\n",
    encoding="utf-8")
print(f"Reviewed {len(pages)} PDF pages; extracted {len(figures)} illustrations and {len(audio)} original audio-link references.")
