import { chooseOption } from "./select-helpers";
import { guitarStudy } from "../../lib/music/raga-guitar";
import { expect, test } from "./fixtures";
import { RAGA_LESSONS } from "../../lib/content/raga-curriculum";

test.beforeEach(async ({ page }) => {
  page.on("pageerror", (error) => { throw error; });
});

test("the guitar lesson maps exact single-string notes, hand shifts and transposed Sa", async ({ page }) => {
  await page.goto("/learn/raga-guitar");
  const guitar = page.locator("#guitar-application");
  await chooseOption(page, guitar.getByRole("combobox", { name: "Practice material", exact: true }), guitarStudy("thaat-0").title);
  await guitar.getByRole("radio", { name: /^One String$/i }).click();
  await expect(guitar.getByRole("combobox", { name: "Melody string", exact: true })).toContainText("String 5 · A");
  await expect(guitar.getByLabel("Guitar tablature", { exact: true })).toContainText("A|-3--5--7--8-10-12-14-15-|");
  await guitar.getByRole("button", { name: "Guitar step 8: Sa′", exact: true }).click();
  await expect(guitar.locator('[aria-live="polite"]')).toContainText("C4");
  await expect(guitar.locator('[aria-live="polite"]')).toContainText("15");
  await expect(guitar.locator('[aria-live="polite"]')).toContainText("Shift the hand here");
  await guitar.getByRole("radiogroup", { name: "Guitar Sa", exact: true }).getByRole("radio", { name: "D", exact: true }).click();
  await expect(guitar.getByLabel("Guitar tablature", { exact: true })).toContainText("A|-5--7--9-10-12-14-16-17-|");
  await expect(guitar.locator('[aria-live="polite"]')).toContainText("D4");
  await expect(guitar.getByRole("img", { name: /Sa D3/ })).toBeVisible();
  await guitar.locator("summary").click();
  await expect(guitar.locator("tbody tr")).toHaveCount(8);
  await guitar.getByRole("radio", { name: /^Both$/i }).click();
  await expect(guitar.locator("tbody tr")).toHaveCount(15);
});

test("quick material and tonic changes retain both guitar choices", async ({ page }) => {
  await page.goto("/learn/raga-guitar");
  const guitar = page.locator("#guitar-application");
  await chooseOption(page, guitar.getByRole("combobox", { name: "Practice material", exact: true }), guitarStudy("thaat-3").title);
  await guitar.getByRole("radiogroup", { name: "Guitar Sa", exact: true }).getByRole("radio", { name: "D", exact: true }).click();
  await expect(guitar.getByRole("combobox", { name: "Practice material", exact: true })).toContainText(guitarStudy("thaat-3").title);
  await expect(guitar.getByRole("img", { name: /Sa D3/ })).toBeVisible();
});

test("raga routes preserve lower notes and descending turns, and playback stops when material changes", async ({ page }) => {
  await page.goto("/learn/raga-guitar");
  const guitar = page.locator("#guitar-application");
  await expect(guitar.locator('[aria-live="polite"]')).toContainText(",ni");
  await expect(guitar.locator('[aria-live="polite"]')).toContainText("B♭2");
  await chooseOption(page, guitar.getByRole("combobox", { name: "Practice material", exact: true }), guitarStudy("raga-1").title);
  await guitar.getByRole("radio", { name: /^Descent$/i }).click();
  await guitar.getByRole("radio", { name: /^One String$/i }).click();
  await expect(guitar.getByLabel("Guitar tablature", { exact: true })).toContainText("A|15-13-12--8-10-12--8--6--5--3-|");
  await guitar.getByRole("button", { name: "Guitar step 5: Pa", exact: true }).click();
  await expect(guitar.locator('[aria-live="polite"]')).toContainText("G3");
  await guitar.getByRole("button", { name: /^Play Guitar Route$/i }).click();
  await expect(guitar.getByRole("button", { name: /^Stop Example$/i })).toBeVisible();
  await expect(guitar.getByRole("progressbar", { name: "Playback progress", exact: true })).toBeVisible();
  await chooseOption(page, guitar.getByRole("combobox", { name: "Practice material", exact: true }), guitarStudy("melakarta-65").title);
  await expect(guitar.getByRole("button", { name: /^Play Guitar Route$/i })).toBeVisible();
  await expect(guitar.getByRole("button", { name: /^Stop Example$/i })).toHaveCount(0);
});

test("builder, scale and thaat links carry their selected material into guitar practice", async ({ page }) => {
  await page.goto("/learn/melakarta-construction");
  const guitar = page.locator("#guitar-application");
  await expect(guitar.getByRole("combobox", { name: "Practice material", exact: true })).toContainText(guitarStudy("melakarta-1").title);
  await chooseOption(page, page.getByRole("combobox", { name: "Ri–Ga pair", exact: true }), "R2 G3");
  await chooseOption(page, page.getByRole("combobox", { name: "Dha–Ni pair", exact: true }), "D2 N2");
  await expect(guitar.getByRole("combobox", { name: "Practice material", exact: true })).toContainText(guitarStudy("melakarta-28").title);
  await chooseOption(page, page.getByRole("combobox", { name: "Madhyama", exact: true }), "M2 · numbers 37–72");
  await expect(guitar.getByRole("combobox", { name: "Practice material", exact: true })).toContainText(guitarStudy("melakarta-64").title);
  await page.locator("#melakarta").getByRole("link", { name: /^Play Vachaspati on guitar$/i }).click();
  await expect(page).toHaveURL("/learn/raga-guitar?study=melakarta-64#guitar-application");
  await expect(page.locator("#guitar-application:visible").getByRole("combobox", { name: "Practice material", exact: true })).toContainText(guitarStudy("melakarta-64").title);
  await page.goto("/learn/thaats");
  await page.locator("#classification").getByRole("button", { name: "Kafi", exact: true }).click();
  await page.locator("#classification").getByRole("link", { name: /Play Kafi as a guitar scale exercise/i }).click();
  await expect(page).toHaveURL("/learn/raga-guitar?study=thaat-3#guitar-application");
  await expect(page.locator("#guitar-application:visible").getByRole("combobox", { name: "Practice material", exact: true })).toContainText(guitarStudy("thaat-3").title);
});

test("every dedicated lesson has guitar practice and the new lesson appears in grouped navigation", async ({ page }) => {
  test.setTimeout(60_000);
  for (const lesson of RAGA_LESSONS.filter((lesson) => lesson.guitar === "melody")) {
    await page.goto(`/learn/${lesson.slug}`);
    const guitar = page.locator("#guitar-application");
    await expect(guitar.getByRole("combobox", { name: "Practice material", exact: true })).toBeVisible();
    await expect(guitar.getByRole("img")).toBeVisible();
    await expect(page.getByRole("link", { name: /Berklee · Hammer-ons, pull-offs and finger slides/i })).toBeVisible();
  }
  await expect(page.getByRole("navigation", { name: "Study topics" }).getByText(new RegExp(RAGA_LESSONS.find((lesson) => lesson.slug === "raga-guitar")!.part, "i"))).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Study topics" }).getByRole("link", { name: /^Ragas on Guitar$/i })).toHaveAttribute("aria-current", "page");
});

test("guitar charts, TAB and fingering tables stay inside mobile pages in both themes", async ({ page }) => {
  await page.goto("/learn/raga-guitar?study=melakarta-65&sa=11");
  const guitar = page.locator("#guitar-application");
  await expect(guitar.getByRole("combobox", { name: "Practice material", exact: true })).toContainText(guitarStudy("melakarta-65").title);
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const mode of [/^Across Strings$/i, /^One String$/i]) {
      await guitar.getByRole("radio", { name: mode }).click();
      await expect(guitar.getByRole("img")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  const neck = guitar.getByRole("region", { name: "Guitar fretboard, scroll horizontally", exact: true });
  await neck.focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => neck.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  await guitar.getByRole("radio", { name: /^Both$/i }).click();
  await page.getByRole("button", { name: /Switch to Dark Theme/i }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await guitar.locator("summary").click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  const tab = guitar.getByRole("region", { name: "Guitar tablature, scroll horizontally", exact: true });
  expect(await tab.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  await tab.evaluate((element) => { element.scrollLeft = element.scrollWidth; });
  expect(await tab.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
});
