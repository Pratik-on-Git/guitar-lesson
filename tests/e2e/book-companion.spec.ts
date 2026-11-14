import { expect, test } from "@playwright/test";
import { FRET_SHEETS } from "../../lib/content/fretboard-sheets";

test.beforeEach(async ({ page }) => { page.on("pageerror", (error) => { throw error; }); });

test("every diagram sheet is drawn as code and atlas filters preserve deep links", async ({ page }) => {
  expect(FRET_SHEETS).toHaveLength(63);
  await page.goto("/book?page=55");
  await expect(page.getByLabel("Diagram sheet")).toHaveValue("55");
  await expect(page.getByRole("group", { name: /Augmented diagram sheet, page 55/ })).toBeVisible();
  await expect(page.getByRole("img", { name: /^Position 1: A-root shape/ })).toBeVisible();
  await page.getByRole("radio", { name: "C", exact: true }).click();
  await expect(page.getByRole("img", { name: /^Position 1: C-root shape/ })).toBeVisible();
  await page.getByRole("radio", { name: "Drop 3", exact: true }).click();
  await page.getByLabel("Diagram sheet").selectOption("80");
  await expect(page).toHaveURL(/page=80/);
  await page.reload();
  await expect(page.getByLabel("Diagram sheet")).toHaveValue("80");
  await expect(page.getByRole("link", { name: "Open interactive lesson" })).toHaveAttribute("href", "/voicings?chord=half-diminished&voicing=drop-3");
});

test("voicing inversion controls produce correct pitch order and reload", async ({ page }) => {
  await page.goto("/voicings?key=c&chord=major-7&inversion=2");
  await expect(page.locator("main")).toContainText("G3 → C4 → E4 → B4");
  await page.getByLabel("Voicing type", { exact: true }).selectOption("drop-3");
  await page.getByLabel("Resulting bass inversion").selectOption("1");
  await expect(page.locator("main")).toContainText("E3 → C4 → G4 → B4");
  await page.reload();
  await expect(page.getByLabel("Voicing type", { exact: true })).toHaveValue("drop-3");
  await expect(page.locator("main")).toContainText("E3 → C4 → G4 → B4");
  await page.getByLabel("Chord quality", { exact: true }).selectOption("minor");
  await expect(page.getByLabel("Voicing type", { exact: true })).toHaveValue("close");
  await expect(page.locator("main")).toContainText("E♭4 → G4 → C5");
});

test("double-note construction draws and explains the repeated G/B pitch", async ({ page }) => {
  await page.goto("/scales/major?key=a");
  await page.getByRole("radiogroup", { name: "Position", exact: true }).getByRole("radio", { name: "Start R", exact: true }).click();
  const neck = page.locator("section").filter({ has: page.getByRole("heading", { name: "On the neck", exact: true }) });
  await expect(neck).toContainText("Triangles mark the same sounding pitch");
  await expect(neck.locator("svg path")).toHaveCount(2);
  await page.getByRole("radio", { name: "Continuous 3NPS", exact: true }).click();
  await expect(neck.locator("svg path")).toHaveCount(0);
});

test("arpeggios and harmonization transpose selected chord tones", async ({ page }) => {
  await page.goto("/arpeggios?key=c&chord=diminished-7");
  await expect(page.locator("main")).toContainText("C E♭ G♭ B𝄫");
  await page.getByLabel("Practice region", { exact: true }).selectOption("7");
  await expect(page).toHaveURL(/fret=7/);
  await page.reload();
  await expect(page.getByLabel("Practice region", { exact: true })).toHaveValue("7");
  await page.goto("/harmonization?key=a&family=harmonic-minor");
  const table = page.locator("section").filter({ has: page.getByRole("heading", { name: "Diatonic chords", exact: true }) });
  await expect(table).toContainText("G♯°7");
  await table.getByRole("button", { name: "V", exact: true }).click();
  await expect(page.getByRole("heading", { name: "E7 · vertical practice", exact: true })).toBeVisible();
});

test("scale choices separate contained chords from contextual tension", async ({ page }) => {
  await page.goto("/improvisation?key=c&chord=dominant-7&collection=melodic-minor%3Aaltered");
  await expect(page.getByRole("heading", { name: "Altered over C7", exact: true })).toBeVisible();
  const outside = page.locator("dt").filter({ hasText: /^Chord tones outside this collection$/ }).locator("..");
  await expect(outside).toContainText("G");
  await page.goto("/improvisation?key=g&tab=pentatonics&recipe=altered-third");
  await expect(page.getByRole("heading", { name: "B♭ minor pentatonic over G7alt", exact: true })).toBeVisible();
  await expect(page.locator("main")).toContainText("♯9 ♯11 ♭13 ♭7 ♭9");
  await page.getByLabel("Desired sound", { exact: true }).selectOption("altered-below");
  await expect(page.locator("main")).toContainText("♭7 ♭9 ♯9 11 ♭13");
});

test("practice checks interval quality, reveals answers and preserves a session", async ({ page }) => {
  await page.goto("/practice");
  await page.getByRole("textbox", { name: "Your answer", exact: true }).fill("M2");
  await page.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Review the spelling" })).toBeVisible();
  await page.getByRole("button", { name: "Next question", exact: false }).click();
  await page.getByRole("button", { name: "Reveal answer", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "d5" })).toBeVisible();
  await page.getByLabel("Exercise type", { exact: true }).selectOption("missing-note");
  await page.getByRole("textbox", { name: "Your answer", exact: true }).fill("C#");
  await page.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Correct:" })).toBeVisible();
  const session = page.locator("section").filter({ has: page.getByRole("heading", { name: "Build a practice session", exact: true }) });
  await session.getByRole("checkbox").first().check();
  await page.getByRole("button", { name: "Save session", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Saved locally" })).toBeVisible();
  await page.reload();
  await expect(session.getByRole("checkbox").first()).toBeChecked();
  const history = page.locator("section").filter({ has: page.getByRole("heading", { name: "Recent practice", exact: true }) });
  await expect(history.getByRole("cell", { name: "Pentatonic & blues scales", exact: true })).toBeVisible();
});

test("all 214 original assignments are searchable with matching material", async ({ page }) => {
  await page.goto("/practice");
  const bank = page.locator("#source-assignments");
  await expect(bank).toContainText("214 numbered practical assignments");
  await page.getByRole("textbox", { name: "Find an assignment", exact: true }).fill("Hirajoshi");
  await expect(bank).toContainText("2 matching assignments");
  await expect(bank.getByRole("link", { name: "Open matching material" }).first()).toHaveAttribute("href", "/scales/hirajoshi?key=a-sharp");
  await bank.getByRole("checkbox").first().check();
  await page.reload();
  await page.getByRole("textbox", { name: "Find an assignment", exact: true }).fill("Hirajoshi");
  await expect(bank.getByRole("checkbox").first()).toBeChecked();
});

test("new routes fit mobile and audio controls start and stop", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/book?page=75", "/voicings", "/arpeggios", "/harmonization", "/improvisation?tab=pentatonics", "/practice", "/learn/fretboard-system", "/scales/pelog"]) {
    await page.goto(route);
    await expect(page.locator("main h1")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), route).toBe(false);
  }
  await page.goto("/practice");
  await page.getByRole("button", { name: "Start metronome", exact: true }).click();
  await expect(page.getByRole("button", { name: "Stop metronome", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Stop metronome", exact: true }).click();
  await page.goto("/voicings");
  await page.getByRole("button", { name: "Hear the voicing", exact: true }).click();
  await expect(page.getByRole("button", { name: "Stop playback", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Stop playback", exact: true }).click();
  await page.screenshot({ path: ".local/book-review/voicings-mobile.png", fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/book?page=24");
  await page.screenshot({ path: ".local/book-review/book-desktop.png", fullPage: true });
});
