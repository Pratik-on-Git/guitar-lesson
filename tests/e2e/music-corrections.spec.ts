import { expect, test } from "@playwright/test";
import { SCALES } from "../../lib/music/scales";
import { MODE_FAMILIES } from "../../lib/music/modes";
import { TOPICS } from "../../lib/content/topics";

test.beforeEach(async ({ page }) => {
  // Treat hydration/runtime failures as failures in every interaction below.
  page.on("pageerror", (error) => { throw error; });
});

test("every study route renders and exposes its sources", async ({ page }) => {
  test.setTimeout(90_000);
  const routes = [
    ...TOPICS.map((t) => `/learn/${t.slug}`),
    ...SCALES.map((s) => `/scales/${s.id}`),
    ...MODE_FAMILIES.map((f) => `/modes/${f.id}`),
    "/chords", "/circle-of-fifths", "/book", "/voicings", "/arpeggios", "/harmonization", "/improvisation", "/practice",
  ];
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("main h1"), route).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sources & further reading", exact: true }), route).toBeVisible();
  }
});

test("compound meter and borrowing have distinct explanations", async ({ page }) => {
  await page.goto("/learn/rhythm");
  await expect(page.locator("#meter")).toContainText("two dotted-quarter beats");
  await page.goto("/learn/keys#modal-interchange");
  await expect(page.locator("#modal-interchange")).toContainText("C–Fm–C");
  await expect(page.locator("#modulation")).toContainText("Common-tone modulation");
});

test("interval membership identifies the selected major scale", async ({ page }) => {
  await page.goto("/learn/intervals");
  const section = page.locator("#intervals-from-root");
  await expect(section.getByRole("columnheader", { name: "In C major", exact: true })).toBeVisible();
  await section.getByRole("radio", { name: "D", exact: true }).click();
  await expect(section.getByRole("columnheader", { name: "In D major", exact: true })).toBeVisible();
  const tritone = section.getByRole("row").filter({ hasText: "Augmented 4th (tritone)" });
  await expect(tritone).toContainText("G♯ / A♭");
  await expect(tritone).toContainText("Diminished 5th");
});

test("substitute table includes iii even with a diatonic root", async ({ page }) => {
  await page.goto("/learn/harmony");
  const section = page.locator("#substitute-dominants");
  await section.getByRole("radio", { name: "C", exact: true }).click();
  await expect(section.getByRole("columnheader", { name: "Em", exact: true })).toBeVisible();
  const row = section.getByRole("row").filter({ hasText: "Tritone substitute" });
  await expect(row.getByRole("cell").nth(2)).toHaveText("F7");
  await expect(section).toContainText("subV7/iii");
  await expect(row).toContainText("Not a usual tonic target");
});

test("altered dominant application transposes and survives reload", async ({ page }) => {
  await page.goto("/modes/melodic-minor?mode=altered&key=c");
  const panel = page.locator("section").filter({ has: page.getByRole("heading", { name: "C7alt · dominant application", exact: true }) });
  await expect(panel).toContainText("C D♭ D♯ E F♯ A♭ B♭");
  await expect(panel).toContainText("C E B♭");
  await expect(page.getByRole("heading", { name: "Theoretical harmony from stacked thirds", exact: true })).toBeVisible();
  await page.getByRole("radiogroup", { name: "Key", exact: true }).getByRole("radio", { name: "D", exact: true }).click();
  await expect(page).toHaveURL(/key=d/);
  await expect(page.getByRole("heading", { name: "D7alt · dominant application", exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "D7alt · dominant application", exact: true })).toBeVisible();
  const matrix = page.locator("section").filter({ has: page.getByRole("heading", { name: /^All melodic minor modes from/ }) });
  await expect(matrix.getByRole("columnheader").nth(4)).toHaveText("3");
});

test("classical descending minor follows the selected root", async ({ page }) => {
  await page.goto("/scales/melodic-minor?key=c");
  const panel = page.locator("section").filter({ has: page.getByRole("heading", { name: "Classical descending melodic minor", exact: true }) });
  await expect(panel).toContainText("C → B♭ → A♭ → G → F → E♭ → D → C");
  await page.getByRole("radiogroup", { name: "Key", exact: true }).getByRole("radio", { name: "A", exact: true }).click();
  await expect(panel).toContainText("A → G → F → E → D → C → B → A");
});

test("circle uses correct enharmonic neighbours and exact historical lookup", async ({ page }) => {
  await page.goto("/circle-of-fifths");
  await page.getByRole("button", { name: "F♯ major, relative minor D♯ minor", exact: true }).click();
  await expect(page.locator("dl")).toContainText("IV B · V C♯");
  await page.getByRole("radiogroup", { name: "Spelling", exact: true }).getByRole("radio", { name: "G♭", exact: true }).click();
  await expect(page.locator("dl")).toContainText("IV C♭ · V D♭");
  await expect(page.getByText("No historical description has been transcribed for this exact key spelling.", { exact: true })).toHaveCount(2);
  await page.getByRole("button", { name: "B major, relative minor G♯ minor", exact: true }).click();
  await expect(page.locator("dl")).toContainText("IV E · V F♯");
  await expect(page.getByText("No historical description has been transcribed for this exact key spelling.", { exact: true })).toHaveCount(1);
});

test("renamed and merged chord bookmarks resolve and remain selectable", async ({ page }) => {
  for (const [id, symbol] of [
    ["minor-9-suspended", "Cm11"],
    ["augmented-raised-nine-flat-thirteen", "C+7♯9"],
    ["augmented-flat-nine-flat-thirteen", "C+7♭9"],
    ["6-sharp-11", "C6/9♯11"],
  ]) {
    await page.goto(`/chords?chord=${id}&key=c`);
    await expect(page.getByRole("heading", { name: symbol, exact: true })).toBeVisible();
    await expect(page.getByRole("row", { selected: true })).toHaveCount(1);
  }
  await page.getByRole("textbox", { name: "Filter chords", exact: true }).fill("minor-major 7");
  await expect(page.getByRole("button", { name: "Minor-major 7th", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Minor-major 7th", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Cm(maj7)", exact: true })).toBeVisible();
});

test("completed pentatonic modes have study notes and no TODO callouts", async ({ page }) => {
  await page.goto("/modes/minor-pentatonic?mode=mode-4&key=e");
  await expect(page.locator("main")).toContainText("E G A C D");
  const parent = page.locator("dt").filter({ hasText: /^Parent scale$/ }).locator("..");
  await expect(parent).toContainText("A minor pentatonic · mode 4");
  await expect(page.getByText("Not in your notes yet", { exact: true })).toHaveCount(0);
  await page.getByRole("tab", { name: /Mode 5/, exact: false }).click();
  await expect(page).toHaveURL(/mode=mode-5/);
  await expect(page.locator("main")).toContainText("no third or seventh");
});

test("new data and source links fit a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/scales/minor-blues", "/scales/diminished-half-whole", "/modes/melodic-minor?mode=altered&key=c", "/circle-of-fifths", "/chords?chord=minor-major-7th"]) {
    await page.goto(route);
    await expect(page.locator("main h1")).toBeVisible();
    const sources = page.locator("section").filter({ has: page.getByRole("heading", { name: "Sources & further reading", exact: true }) });
    await expect(sources.getByRole("link").first()).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(overflow, route).toBe(false);
  }
});
