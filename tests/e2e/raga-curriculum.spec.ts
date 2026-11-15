import { expect, test } from "./fixtures";
import { RAGA_LESSONS, RAGA_PARTS } from "../../lib/content/raga-curriculum";

test.beforeEach(async ({ page }) => {
  page.on("pageerror", (error) => { throw error; });
});

test("all lessons have grouped navigation, guitar application, sources and sequential links", async ({ page }) => {
  test.setTimeout(60_000);
  for (const [index, lesson] of RAGA_LESSONS.entries()) {
    await page.goto(`/learn/${lesson.slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const nav = page.getByRole("navigation", { name: "Study topics" });
    await expect(nav.locator(`a[href="/learn/${lesson.slug}"]`)).toHaveAttribute("aria-current", "page");
    for (const part of RAGA_PARTS) await expect(nav.getByText(new RegExp(part.title, "i"))).toBeVisible();
    await expect(page.locator(`#${lesson.section}`)).toBeVisible();
    await expect(page.locator(`#${lesson.section}-notes`)).toBeVisible();
    await expect(page.locator("#guitar-application")).toBeVisible();
    await expect(page.getByRole("heading", { name: /^Sources & further reading$/i })).toBeVisible();
    const continuation = page.locator("#apply-and-continue");
    await expect(continuation.getByRole("listitem")).toHaveCount(2);
    if (RAGA_LESSONS[index + 1]) await expect(continuation.getByRole("link", { name: /^Next/i })).toHaveAttribute("href", `/learn/${RAGA_LESSONS[index + 1].slug}`);
    if (RAGA_LESSONS[index - 1]) await expect(continuation.getByRole("link", { name: /^Previous/i })).toHaveAttribute("href", `/learn/${RAGA_LESSONS[index - 1].slug}`);
  }
  await page.goto("/");
  const map = page.locator("#study-map");
  await map.locator("summary").filter({ hasText: "Indian Classical Music" }).click();
  for (const lesson of RAGA_LESSONS) await expect(map.locator(`a[href="/learn/${lesson.slug}"]`)).toBeVisible();
  for (const part of RAGA_PARTS) await expect(map.getByText(new RegExp(part.title, "i"))).toBeVisible();
});

test("pitch comparison preserves shared spellings and jati controls count distinct degrees", async ({ page }) => {
  await page.goto("/learn/svara-comparison");
  const comparison = page.locator("#comparison");
  await comparison.getByRole("button", { name: "2 semitones, Re", exact: true }).click();
  await expect(comparison.locator('[aria-live="polite"]')).toContainText("R2 / G1");
  await expect(comparison.locator('[aria-live="polite"]')).toContainText("D / E𝄫");
  await comparison.getByRole("button", { name: "9 semitones, Dha", exact: true }).click();
  await expect(comparison.locator('[aria-live="polite"]')).toContainText("A / B𝄫");

  await page.goto("/learn/what-is-raga");
  const identity = page.locator("#what-is-raga");
  await expect(identity).toContainText("Audav–Sampurna");
  await identity.getByRole("radiogroup", { name: "Ascent degree count" }).getByRole("radio", { name: /6/ }).click();
  await identity.getByRole("radiogroup", { name: "Descent degree count" }).getByRole("radio", { name: /5/ }).click();
  await expect(identity).toContainText("Shadav–Audav");
  await identity.getByRole("radio", { name: "Repose", exact: true }).click();
  await expect(identity).toContainText("Nyasa describes places");
});

test("Kafi contours, note roles, thaats and parent relationships respond to selection", async ({ page }) => {
  await page.goto("/learn/raga-versus-scale");
  const kafi = page.locator("#raga-vs-scale");
  await expect(kafi.getByRole("img", { name: /^Bhimpalasi · ascent:/ })).toBeVisible();
  await kafi.getByRole("radio", { name: "Bageshree", exact: true }).click();
  await expect(kafi.getByRole("img", { name: /^Bageshree · descent:/ })).toHaveAttribute("aria-label", /Ma Pa Dha Ma/);
  await kafi.getByRole("radio", { name: "Dhani", exact: true }).click();
  await expect(kafi).toContainText("pentatonic form omits Re and Dha");
  await expect(kafi.getByText("5 degrees", { exact: true })).toHaveCount(2);
  await page.goto("/learn/raga-elements");
  await page.getByRole("radio", { name: /^Note Treatment$/i }).click();
  await expect(page.locator('#raga-elements [aria-live="polite"]')).toContainText("restricted and omitted");
  await page.goto("/learn/thaats");
  const thaats = page.locator("#classification");
  await thaats.getByRole("button", { name: "Kafi", exact: true }).click();
  await expect(thaats.locator('[aria-live="polite"]')).toContainText("Dorian");
  await expect(thaats.locator('[aria-live="polite"]')).toContainText("Bhimpalasi");
  await expect(thaats.getByRole("table").first().locator("tbody tr")).toHaveCount(10);
  await page.goto("/learn/janaka-and-janya");
  await page.getByRole("radio", { name: "Bhashanga", exact: true }).click();
  await expect(page.locator('#carnatic-raga [aria-live="polite"]')).toContainText("anya svaras");
});

test("melakarta construction links to the selected corrected scale and filters combine correctly", async ({ page }) => {
  await page.goto("/learn/melakarta-construction");
  await page.getByRole("combobox", { name: "Ri–Ga pair", exact: true }).selectOption("4");
  await page.getByRole("combobox", { name: "Dha–Ni pair", exact: true }).selectOption("3");
  const result = page.locator('#melakarta [aria-live="polite"]');
  await expect(result).toContainText("Harikambhoji");
  await expect(result).toContainText("Melakarta 28");
  await page.getByRole("combobox", { name: "Madhyama", exact: true }).selectOption("1");
  await expect(result).toContainText("Vachaspati");
  await expect(result).toContainText("Melakarta 64");
  await page.getByRole("link", { name: /Find Vachaspati/i }).click();
  await expect(page).toHaveURL("/learn/melakarta-chart?mela=64#melakarta-chart");
  const chart = page.locator("#melakarta-chart");
  const detail = chart.locator('[aria-live="polite"]');
  const results = chart.getByRole("region", { name: "Melakarta results", exact: true });
  await expect(detail).toContainText("Vachaspati");
  await expect(results.getByRole("button")).toHaveCount(72);
  await page.getByLabel("Find a melakarta", { exact: true }).fill("Sarasangi");
  await expect(results.getByRole("button")).toHaveCount(1);
  await expect(detail).toContainText("Melakarta 27");
  await page.getByRole("button", { name: "Reset filters", exact: true }).click();
  await page.getByRole("combobox", { name: "Chakra", exact: true }).selectOption("Vasu");
  await expect(results.getByRole("button")).toHaveCount(6);
  await page.getByRole("radio", { name: /M1 · 1–36/ }).click();
  await expect(chart.getByRole("heading", { name: "No matching melakartas" })).toBeVisible();
  await page.getByRole("button", { name: "Show all 72", exact: true }).click();
  await expect(results.getByRole("button")).toHaveCount(72);
  await page.getByRole("radio", { name: /M2 · 37–72/ }).click();
  await expect(results.getByRole("button")).toHaveCount(36);
  await page.getByLabel("Find a melakarta", { exact: true }).fill("65");
  await expect(detail).toContainText("Mechakalyani");
  await expect(detail).toContainText("D2");
  await expect(detail).toContainText("N3");
});

test("Katapayadi examples reverse digits and chakra links select the correct group", async ({ page }) => {
  await page.goto("/learn/katapayadi-and-chakras");
  const section = page.locator("#katapayadi");
  await page.getByRole("combobox", { name: "Documented Katapayadi example", exact: true }).selectOption("2");
  await expect(section.locator('[aria-live="polite"]').first()).toContainText("65");
  await expect(section.locator('[aria-live="polite"]').first()).toContainText("Mechakalyani");
  await expect(section.getByRole("button", { name: /Rudra/ })).toHaveAttribute("aria-pressed", "true");
  await section.getByRole("button", { name: /Vasu/ }).click();
  await expect(section.locator('[aria-live="polite"]').last()).toContainText("43–48");
  await expect(section.locator('[aria-live="polite"]').last()).toContainText("D2 N3");
  await section.getByRole("link", { name: /Explore all six in Vasu/ }).click();
  await expect(page).toHaveURL("/learn/melakarta-chart?chakra=Vasu#melakarta-chart");
  await expect(page.getByRole("region", { name: "Melakarta results", exact: true }).getByRole("button")).toHaveCount(6);
  await expect(page.locator("#melakarta-chart").getByRole("status")).toContainText("6 of 72 melakartas · Vasu");
});

test("all new lessons fit mobile widths and the grouped phone menu opens their pages", async ({ page }) => {
  test.setTimeout(60_000);
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    for (const lesson of RAGA_LESSONS.slice(2)) {
      await page.goto(`/learn/${lesson.slug}`);
      await expect(page.locator(`#${lesson.section}`)).toBeVisible();
      if (lesson.slug === "melakarta-chart") await expect(page.getByRole("region", { name: "Melakarta results", exact: true })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${lesson.slug} at ${width}px`).toBe(true);
    }
  }
  await page.getByRole("button", { name: /Open Menu/i }).click();
  const sheet = page.getByRole("dialog");
  await expect(sheet.getByText(/Part 3 · Carnatic Ragas & Melakarta/i)).toBeVisible();
  await sheet.getByRole("link", { name: /^Build a Melakarta$/i }).click();
  await expect(page).toHaveURL("/learn/melakarta-construction");
  await expect(sheet).toBeHidden();
});

