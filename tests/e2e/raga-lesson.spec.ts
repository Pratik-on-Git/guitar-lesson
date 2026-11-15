import { expect, test } from "./fixtures";

test.beforeEach(async ({ page }) => {
  page.on("pageerror", (error) => { throw error; });
});

test("Hindustani pitch ladder supports selection, keyboard navigation and the full reference", async ({ page }) => {
  await page.goto("/learn/indian-classical#hindustani-svaras");
  const section = page.locator("#hindustani-svaras");
  const pitches = section.getByRole("radiogroup", { name: "Hindustani pitch positions" });
  const detail = section.locator('[aria-live="polite"]');
  await expect(pitches.getByRole("radio")).toHaveCount(12);
  await expect(detail).toContainText("Shadja");

  const tivra = pitches.getByRole("radio", { name: "Ḿa, Tivra Madhyam, 6 semitones from Sa, F♯", exact: true });
  await tivra.click();
  await expect(tivra).toBeChecked();
  await expect(detail).toContainText("Tivra Madhyam");
  await expect(detail).toContainText("F♯");
  await expect(detail).toContainText("only svara with a tivra");
  await page.keyboard.press("ArrowRight");
  await expect(detail).toContainText("Pancham");
  await page.keyboard.press("Home");
  await expect(detail).toContainText("Shadja");
  await section.getByRole("button", { name: "Previous svara", exact: true }).click();
  await expect(detail).toContainText("Shuddha Nishad");
  await section.getByRole("button", { name: "Next svara", exact: true }).click();
  await expect(detail).toContainText("Shadja");

  await expect(section.getByRole("table")).toBeHidden();
  await section.locator("summary").click();
  await expect(section.locator("tbody tr")).toHaveCount(12);
  await expect(section.getByRole("table")).toBeVisible();
  await section.locator("summary").click();

  await page.setViewportSize({ width: 390, height: 844 });
  await section.getByRole("button", { name: "Previous svara", exact: true }).click();
  await expect(pitches.getByRole("radio", { checked: true })).toBeInViewport();
  await expect(detail).toContainText("Shuddha Nishad");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test("raga visuals explain pitch names, tala counts and cycle gestures", async ({ page }) => {
  await page.goto("/learn/indian-classical");
  const pitch = page.locator("#comparison");
  await pitch.getByRole("button", { name: /2 semitones/ }).click();
  await expect(pitch.locator('[aria-live="polite"]')).toContainText("R2");
  await expect(pitch.locator('[aria-live="polite"]')).toContainText("G1");
  const tala = page.locator("#carnatic-tala-structure");
  await expect(tala.getByRole("button", { name: "Triputa: 8 counts", exact: true })).toBeVisible();
  await tala.getByLabel("Laghu jati").selectOption("9");
  await expect(tala.getByRole("button", { name: "Dhruva: 29 counts", exact: true })).toBeVisible();
  await expect(tala.getByRole("button", { name: "Triputa: 13 counts", exact: true })).toBeVisible();
  const cycle = page.locator("#tala-practice");
  await cycle.getByRole("button", { name: "Beat 9", exact: true }).click();
  await expect(cycle.locator('[aria-live="polite"]')).toContainText("Wave · khali");
  await cycle.getByRole("button", { name: "Beat 16", exact: true }).click();
  await cycle.getByRole("button", { name: "Next beat" }).click();
  await expect(cycle.locator('[aria-live="polite"]')).toContainText("Beat 1 of 16 · Clap · sam");
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
});

test("raga notes are discoverable, sourced and complete through the chart", async ({ page }) => {
  await page.goto("/");
  const map = page.locator("#study-map");
  await map.locator("summary").filter({ hasText: "Indian Classical Music" }).click();
  await map.getByRole("link", { name: /^Indian classical & raga$/i, exact: true }).click();
  await expect(page).toHaveURL("/learn/indian-classical");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Indian Classical Music & Raga");
  await expect(page.locator("#raga-elements")).toContainText("Bhimpalasi’s usual pair is shuddha Ma and Sa");
  await expect(page.locator("#raga-vs-scale")).toContainText("Re is not mandatory in the pentatonic form");
  await expect(page.locator("#carnatic-svaras")).toContainText("E𝄫");
  await expect(page.locator("#carnatic-svaras")).toContainText("B𝄫");
  await expect(page.locator("#classification tbody tr")).toHaveCount(10);
  await expect(page.locator("#melakarta-chart tbody tr")).toHaveCount(72);
  await expect(page.locator("#melakarta-chart tbody tr").nth(26)).toContainText("Sarasangi");
  await expect(page.locator("#melakarta-chart tbody tr").nth(27)).toContainText("Harikambhoji");
  await expect(page.locator("#melakarta-chart tbody tr").nth(64)).toContainText("S R2 G3 M2 P D2 N3");
  await expect(page.getByRole("heading", { name: /^Sources & further reading$/i, exact: true })).toBeVisible();
  await expect(page.locator("main").getByRole("link", { name: /Tanarang · Dhani/i, exact: false })).toHaveAttribute("href", "https://tanarang.com/raag-dhani/");

  // This name is beyond the search index's ordinary 400-character section excerpt.
  await page.keyboard.press("Control+k");
  await page.getByRole("combobox", { name: /^Search$/i, exact: true }).fill("Rasikapriya");
  await page.getByRole("option").filter({ hasText: "Rasikapriya · melakarta 72" }).click();
  await expect(page).toHaveURL("/learn/indian-classical#melakarta-chart");
  await expect(page.locator("#melakarta-chart")).toBeVisible();
});

test("the complete melakarta table scrolls inside a mobile page", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const response = await page.goto("/learn/indian-classical#melakarta-chart");
  expect(response?.status()).toBe(200);
  await expect(page.locator("#melakarta-chart tbody tr")).toHaveCount(72);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  const wrapper = page.locator('#melakarta-chart [data-slot="table-container"]');
  expect(await wrapper.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  await wrapper.evaluate((element) => { element.scrollLeft = element.scrollWidth; });
  expect(await wrapper.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
});
