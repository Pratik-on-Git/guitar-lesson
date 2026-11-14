"""Transcribe every Fretboard Concepts diagram sheet into typed data.

Optional tool: pip install pymupdf numpy pillow. Run from the repository root.
The original user-supplied PDF is never modified and no image is exported:
each embedded diagram is measured (string lines, fret wires, marker shapes and
printed fret numbers) and written to lib/content/fretboard-sheets.ts, which the
app renders as coded SVG. Every marker is validated against its sheet formula.
"""
from pathlib import Path
import json, re, sys
import numpy as np
import pymupdf
from PIL import Image

sys.stdout.reconfigure(encoding="utf-8")
SOURCE = next(Path.cwd().glob("Yiannis Papadopoulos*.pdf"))
TUNING = [40, 45, 50, 55, 59, 64]  # low E to high e
SEMI = {"1": 0, "b2": 1, "2": 2, "#2": 3, "b3": 3, "3": 4, "b4": 4, "4": 5, "#4": 6, "b5": 6,
        "5": 7, "#5": 8, "b6": 8, "6": 9, "bb7": 9, "b7": 10, "7": 11}
SCALES = {
    20: ("Major pentatonic", "1 2 3 5 6"), 21: ("Minor pentatonic", "1 b3 4 5 b7"),
    22: ("Major blues", "1 2 b3 3 5 6"), 23: ("Minor blues", "1 b3 4 b5 5 b7"),
    24: ("Kumoi", "1 2 b3 5 6"), 25: ("Pelog", "1 b2 b3 5 b6"), 26: ("Hirajoshi", "1 2 b3 5 b6"),
    28: ("Ionian (major)", "1 2 3 4 5 6 7"), 29: ("Dorian", "1 2 b3 4 5 6 b7"),
    30: ("Phrygian", "1 b2 b3 4 5 b6 b7"), 31: ("Lydian", "1 2 3 #4 5 6 7"),
    32: ("Mixolydian", "1 2 3 4 5 6 b7"), 33: ("Aeolian (natural minor)", "1 2 b3 4 5 b6 b7"),
    34: ("Locrian", "1 b2 b3 4 b5 b6 b7"),
    36: ("Harmonic minor", "1 2 b3 4 5 b6 7"), 37: ("Locrian ♮6", "1 b2 b3 4 b5 6 b7"),
    38: ("Ionian ♯5", "1 2 3 4 #5 6 7"), 39: ("Dorian ♯4", "1 2 b3 #4 5 6 b7"),
    40: ("Phrygian dominant", "1 b2 3 4 5 b6 b7"), 41: ("Lydian ♯2", "1 #2 3 #4 5 6 7"),
    42: ("Ultra Locrian (altered 𝄫7)", "1 b2 b3 b4 b5 b6 bb7"),
    44: ("Melodic minor", "1 2 b3 4 5 6 7"), 45: ("Dorian ♭2", "1 b2 b3 4 5 6 b7"),
    46: ("Lydian augmented", "1 2 3 #4 #5 6 7"), 47: ("Lydian dominant", "1 2 3 #4 5 6 b7"),
    48: ("Mixolydian ♭6", "1 2 3 4 5 b6 b7"), 49: ("Locrian ♮2", "1 2 b3 4 b5 b6 b7"),
    50: ("Altered (super Locrian)", "1 b2 b3 b4 b5 b6 b7"),
    54: ("Whole tone", "1 2 3 #4 #5 b7"), 55: ("Augmented", "1 #2 3 5 b6 7"),
    56: ("Half-whole diminished", "1 b2 b3 3 #4 5 6 b7"), 57: ("Whole-half diminished", "1 2 b3 4 b5 b6 6 7"),
}
CHORD_NAMES = ["Major triad", "Minor triad", "Augmented triad", "Diminished triad", "Major 7th", "Dominant 7th",
               "Minor-major 7th", "Minor 7th", "Augmented major 7th", "Half-diminished 7th", "Diminished 7th"]
CHORD_FORMULAS = ["1 3 5", "1 b3 5", "1 3 #5", "1 b3 b5", "1 3 5 7", "1 3 5 b7", "1 b3 5 7", "1 b3 5 b7",
                  "1 3 #5 7", "1 b3 b5 b7", "1 b3 b5 bb7"]
# Root-chord extensions as printed in each scale sheet's formula table.
EXTENSIONS = {20: "9, 11 or ♯11, 13", 21: "♭9 or 9, 11, ♭13 or 13", 22: "9, 11 or ♯11, 13", 23: "♭9 or 9, 11, ♭13 or 13",
              24: "9, 11, 13", 25: "♭9, 11, ♭13", 26: "9, 11, ♭13", 28: "9, 11, 13", 29: "9, 11, 13", 30: "♭9, 11, ♭13",
              31: "9, ♯11, 13", 32: "9, 11, 13", 33: "9, 11, ♭13", 34: "♭9, 11, ♭13", 36: "9, 11, ♭13", 37: "♭9, 11, 13",
              38: "9, 11, 13", 39: "9, ♯11, 13", 40: "♭9, 11, ♭13", 41: "♯9, ♯11, 13", 42: "♭9, ♭11, ♭13", 44: "9, 11, 13",
              45: "♭9, 11, 13", 46: "9, ♯11, 13", 47: "9, ♯11, 13", 48: "9, 11, ♭13", 49: "9, 11, ♭13", 50: "♭9, ♭11, ♭13",
              54: "9, ♯11, ♭13", 55: "♯9, ♭13", 56: "♭9, ♯9, ♯11, 13", 57: "9, 11, ♭13, 13"}
# Parent-collection chords printed for the three Japanese/Indonesian pentatonics.
PRINTED_HARMONY = {24: "Im7 IIm7 IIImaj7 Vm7 VIø", 25: "Im7 IImaj7 III7 Vø VImaj7", 26: "Im7 IIø IIImaj7 Vm7 VImaj7"}
HARMONY_REFERENCE = {20: "pp. 18–19", 21: "p. 19", 22: "p. 19", 23: "p. 19", 54: "pp. 51–52", 55: "p. 52", 56: "p. 53", 57: "p. 53"}

# ------------------------------------------------------------------ detector
R = 18
YY, XX = np.mgrid[-R:R + 1, -R:R + 1]
DISK = (XX ** 2 + YY ** 2) <= 15.5 ** 2
SQUARE = (abs(XX) <= 16) & (abs(YY) <= 16)
TRI = (YY >= -16) & (YY <= 14) & (abs(XX) <= (YY + 16) * 16 / 30 + 0.5)
BAND = abs(YY) > 4
TEMPLATES: dict[str, np.ndarray] = {}


def groups(idx, gap=2):
    out = []
    for i in idx:
        if out and i - out[-1][-1] <= gap: out[-1].append(i)
        else: out.append([i])
    return out


def grid(g):
    rows = [(a[0] + a[-1]) / 2 for a in groups(np.where((g < 200).mean(axis=1) > 0.5)[0], gap=7)]
    if len(rows) != 6: raise ValueError("not a six-string diagram")
    sub = (g[int(rows[0]):int(rows[-1]) + 1] < 200).mean(axis=0)
    cols = [(a[0], a[-1]) for a in groups(np.where(sub > 0.8)[0]) if a[-1] - a[0] >= 5]
    return rows, cols


def components(mask):
    h, w = mask.shape; seen = np.zeros_like(mask); found = []
    for y in range(h):
        for x in range(w):
            if mask[y, x] and not seen[y, x]:
                stack = [(y, x)]; seen[y, x] = True; pts = []
                while stack:
                    cy, cx = stack.pop(); pts.append((cy, cx))
                    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        ny, nx = cy + dy, cx + dx
                        if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not seen[ny, nx]:
                            seen[ny, nx] = True; stack.append((ny, nx))
                ys = [p[0] for p in pts]; xs = [p[1] for p in pts]
                found.append((min(xs), min(ys), max(xs), max(ys), len(pts)))
    return found


def glyph(g, box):
    x0, y0, x1, y1 = box
    im = Image.fromarray(g[y0:y1 + 1, x0:x1 + 1].astype(np.uint8)).resize((10, 14), Image.BILINEAR)
    return (np.asarray(im, dtype=float) < 140).astype(float)


def fret_labels(g, rows, centers):
    top = int(rows[-1] + 22)
    comps = sorted((c[0], c[1] + top, c[2], c[3] + top, c[4]) for c in components(g[top:] < 120) if c[4] > 12 and c[3] - c[1] >= 8)
    labels = []
    for c in comps:
        if labels and c[0] - labels[-1][-1][2] < 10: labels[-1].append(c)
        else: labels.append([c])
    return [(int(np.argmin([abs((L[0][0] + L[-1][2]) / 2 - x) for x in centers])), L) for L in labels]


def read(g, label):
    return "".join(min(TEMPLATES.items(), key=lambda kv: np.abs(kv[1] - glyph(g, c[:4])).sum())[0] for c in label)


def marker(g, x, y):
    x, y = int(round(x)), int(round(y))
    patch = np.full((2 * R + 1, 2 * R + 1), 255.0)
    y0, x0 = max(0, y - R), max(0, x - R)
    sub = g[y0:y + R + 1, x0:x + R + 1]
    patch[y0 - (y - R):y0 - (y - R) + sub.shape[0], x0 - (x - R):x0 - (x - R) + sub.shape[1]] = sub
    dark = (patch < 120) & BAND
    if dark.sum() < 120: return None
    sil = np.zeros_like(dark)
    for i, row in enumerate(dark):
        idx = np.where(row)[0]
        if len(idx): sil[i, idx[0]:idx[-1] + 1] = True
    sil &= BAND
    scores = {name: (sil & m & BAND).sum() / max(1, (sil | (m & BAND)).sum()) for name, m in (("dot", DISK), ("root", SQUARE), ("double", TRI))}
    shape = max(scores, key=scores.get)
    if scores[shape] < 0.6: return None  # grid artefact, not a marker
    corner = (patch < 120)[(abs(XX) >= 12) & (abs(XX) <= 16) & (abs(YY) >= 12) & (abs(YY) <= 16)].mean()
    if corner >= 0.4: return "root"  # the hollow boxed anchor root
    return "double" if shape == "double" else "dot"


def analyse(g):
    rows, cols = grid(g)
    centers = [(cols[i][1] + cols[i + 1][0]) / 2 for i in range(len(cols) - 1)]
    marks = [(5 - si, ci, k) for si, y in enumerate(rows) for ci, x in enumerate(centers) if (k := marker(g, x, y))]
    return rows, centers, marks


def pixels(document, xref):
    pix = pymupdf.Pixmap(document, xref)
    if pix.n - pix.alpha >= 4: pix = pymupdf.Pixmap(pymupdf.csRGB, pix)
    return np.asarray(Image.frombytes("RGB" if pix.n >= 3 else "L", (pix.width, pix.height), pix.samples).convert("L"), dtype=float)


def diagrams_on(document, number):
    page = document[number - 1]
    out = []
    for info in page.get_image_info(xrefs=True):
        if info["width"] < 200 or info["height"] < 100: continue
        try:
            g = pixels(document, info["xref"]); rows, centers, marks = analyse(g)
        except ValueError:
            continue  # the author's photographs share some pages
        out.append((info["bbox"], g, rows, centers, marks))
    return page, out


def learn_digits(document):
    # Known printed fret numbers on the major-pentatonic sheet (positions 5, 1, 4) and the major-triad neck.
    known = {(20, 1): ["12", "15"], (20, 2): ["3", "5", "7"], (20, 5): ["9", "12"], (83, 0): ["3", "5", "7", "9", "12", "15"]}
    for (number, index), values in known.items():
        _, found = diagrams_on(document, number)
        _, g, rows, centers, _ = found[index]
        for (_, label), value in zip(fret_labels(g, rows, centers), values, strict=True):
            for c, ch in zip(label, value):
                TEMPLATES.setdefault(ch, glyph(g, c[:4]))


# ------------------------------------------------------------------ sheets
def steps(formula):
    semis = [SEMI[d] for d in formula.split()] + [12]
    names = {1: "H", 2: "W", 3: "3H", 4: "2W"}
    return " ".join(names[b - a] for a, b in zip(semis, semis[1:]))


def harmony(formula):
    degrees = formula.split()
    if len(degrees) != 7: return None
    semis = [SEMI[d] for d in degrees]
    quality = {(4, 7, 11): "maj7", (4, 7, 10): "7", (3, 7, 10): "m7", (3, 7, 11): "m(maj7)", (3, 6, 10): "ø",
               (3, 6, 9): "°", (4, 8, 11): "+maj7", (4, 8, 10): "+7", (2, 6, 10): "7♭5(𝄫3)", (4, 6, 10): "7♭5", (4, 6, 11): "maj7♭5", (3, 6, 11): "°(maj7)"}
    romans = ["I", "II", "III", "IV", "V", "VI", "VII"]
    chords = []
    for i in range(7):
        tones = tuple((semis[(i + k) % 7] - semis[i]) % 12 for k in (2, 4, 6))
        chords.append(romans[i] + quality.get(tones, "?"))
    return " ".join(chords)


def words_above(words, bbox):
    x0, y0, x1, _ = bbox
    near = [w for w in words if y0 - 30 < w[3] <= y0 + 2 and w[0] < x1 and w[2] > x0 and not re.match(r"^\d+\.\d", w[4]) and w[4] != "`"]
    if not near: return ""
    line = max(w[3] for w in near)
    return " ".join(w[4] for w in sorted((w for w in near if abs(w[3] - line) < 4), key=lambda w: w[0]))


def string_set(words, bbox):
    digits = sorted((w for w in words if w[2] < 70 and re.match(r"^[\d/]$", w[4])), key=lambda w: w[1])
    clusters = []
    for w in digits:
        if clusters and w[1] - clusters[-1][-1][1] < 40: clusters[-1].append(w)
        else: clusters.append([w])
    centre = (bbox[1] + bbox[3]) / 2
    best = min(clusters, key=lambda c: abs((c[0][1] + c[-1][3]) / 2 - centre))
    return "".join(w[4] for w in best)


ORDER = {"Root Position": 0, "1st Inversion": 1, "2nd Inversion": 2, "3rd Inversion": 3}


def transcribe(number, bbox, g, rows, centers, marks, formula, errors):
    offsets = {int(read(g, L)) - ci for ci, L in fret_labels(g, rows, centers)}
    if len(offsets) != 1: raise RuntimeError(f"p. {number}: inconsistent fret numbers {offsets}")
    offset = offsets.pop()
    allowed = {SEMI[d] for d in formula.split()}
    tokens = []
    for string, column, kind in sorted(marks, key=lambda m: (m[0], m[1])):
        fret = column + offset
        semi = (TUNING[string] + fret - 45) % 12  # A is the root of every sheet
        if semi not in allowed or (kind == "root" and semi != 0):
            errors.append(f"p. {number} string {string} fret {fret}: {kind} outside {formula}")
        tokens.append(f"{string}.{fret}{ {'dot': '', 'root': 'r', 'double': 'd'}[kind] }".replace(" ", ""))
    return {"from": offset, "to": offset + len(centers) - 1, "marks": " ".join(tokens)}


def main():
    sheets, errors = [], []
    with pymupdf.open(SOURCE) as document:
        learn_digits(document)
        pages = [*SCALES, *range(59, 65), *range(67, 74), *range(75, 82), *range(83, 94)]
        for number in pages:
            page, found = diagrams_on(document, number)
            words = [tuple(w) for w in page.get_text("words")]
            section = next((w[4] for w in sorted(words, key=lambda w: (w[1], w[0])) if re.match(r"^\d+\.\d+(\.\d+)+$", w[4])), "")
            if number in SCALES or number >= 83:
                if number in SCALES: title, formula = SCALES[number]
                else: title, formula = CHORD_NAMES[number - 83], CHORD_FORMULAS[number - 83]
                neck, positions = None, []
                for bbox, g, rows, centers, marks in found:
                    data = transcribe(number, bbox, g, rows, centers, marks, formula, errors)
                    label = words_above(words, bbox)
                    if label.startswith("Position"): positions.append({"label": label, **data})
                    else: neck = {"label": "Full neck", **data}
                positions.sort(key=lambda d: int(d["label"].split()[1]))
                sheet = {"page": number, "section": section, "title": title, "kind": "scale" if number in SCALES else "arpeggio",
                         "neck": neck, "groups": [{"title": "", "formula": formula.split(), "diagrams": positions}]}
                if number in SCALES:
                    sheet["table"] = {"melodic": steps(formula), "intervallic": formula,
                                      "harmonic": PRINTED_HARMONY.get(number) or harmony(formula) or f"See {HARMONY_REFERENCE[number]}",
                                      "extensions": EXTENSIONS[number]}
                sheets.append(sheet)
            elif number <= 64:
                pairs = [(0, 1), (2, 3), (4, 5), (6, 7), (8, 9), (10,)][number - 59]
                columns = {}
                for bbox, g, rows, centers, marks in found:
                    side = 0 if len(pairs) == 1 or (bbox[0] + bbox[2]) / 2 < 306 else 1
                    chord = pairs[side]
                    data = transcribe(number, bbox, g, rows, centers, marks, CHORD_FORMULAS[chord], errors)
                    columns.setdefault(chord, []).append({"label": words_above(words, bbox), **data})
                groups_ = [{"title": CHORD_NAMES[c], "formula": CHORD_FORMULAS[c].split(),
                            "diagrams": sorted(columns[c], key=lambda d: int(d["label"].split()[1]))} for c in pairs]
                sheets.append({"page": number, "section": section, "title": " & ".join(CHORD_NAMES[c] for c in pairs) + " shapes",
                               "kind": "shapes", "groups": groups_})
            else:
                chord = 4 + (number - 67 if number < 75 else number - 75)
                drop = "Drop 2" if number < 75 else "Drop 3"
                sets = {}
                for bbox, g, rows, centers, marks in found:
                    data = transcribe(number, bbox, g, rows, centers, marks, CHORD_FORMULAS[chord], errors)
                    sets.setdefault(string_set(words, bbox), []).append({"label": words_above(words, bbox), **data})
                groups_ = [{"title": f"Strings {name}", "formula": CHORD_FORMULAS[chord].split(),
                            "diagrams": sorted(items, key=lambda d: ORDER[d["label"]])} for name, items in sorted(sets.items())]
                sheets.append({"page": number, "section": section, "title": f"{CHORD_NAMES[chord]} · {drop}", "kind": drop.lower().replace(" ", "-"), "groups": groups_})
    if errors:
        raise SystemExit("\n".join(errors))
    total = sum(len(d["marks"].split()) for s in sheets for g in s["groups"] for d in g["diagrams"]) + sum(len(s["neck"]["marks"].split()) for s in sheets if s.get("neck"))
    body = json.dumps(sheets, ensure_ascii=False, indent=1)
    Path("lib/content/fretboard-sheets.ts").write_text(
        "// Generated by scripts/extract-book-diagrams.py: exact transcription of every Fretboard Concepts\n"
        "// diagram (A root). A mark is `string.fret` (0 = low E) plus r (boxed anchor root) or d (Double Note).\n"
        "import type { FretSheet } from \"./fretboard-sheet-types\";\n"
        f"export const FRET_SHEETS: FretSheet[] = {body};\n", encoding="utf-8")
    print(f"Transcribed {len(sheets)} sheets and {total} validated markers to lib/content/fretboard-sheets.ts.")


if __name__ == "__main__":
    main()
