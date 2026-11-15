import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  page.on("pageerror", (error) => { throw error; });
});

test("raga notes are discoverable, sourced and complete through the chart", async ({ page }) => {
  await page.goto("/");
  const map = page.locator("#study-map");
  await map.locator("summary").filter({ hasText: "Scales" }).click();
  await map.getByRole("link", { name: "Indian classical & raga", exact: true }).click();
  await expect(page).toHaveURL("/learn/indian-classical");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Indian classical music & raga");
  await expect(page.locator("#raga-elements")).toContainText("Bhimpalasi’s usual pair is shuddha Ma and Sa");
  await expect(page.locator("#raga-vs-scale")).toContainText("Re is not mandatory in the pentatonic form");
  await expect(page.locator("#carnatic-svaras")).toContainText("E𝄫");
  await expect(page.locator("#carnatic-svaras")).toContainText("B𝄫");
  await expect(page.locator("#classification tbody tr")).toHaveCount(10);
  await expect(page.locator("#melakarta-chart tbody tr")).toHaveCount(72);
  await expect(page.locator("#melakarta-chart tbody tr").nth(26)).toContainText("Sarasangi");
  await expect(page.locator("#melakarta-chart tbody tr").nth(27)).toContainText("Harikambhoji");
  await expect(page.locator("#melakarta-chart tbody tr").nth(64)).toContainText("S R2 G3 M2 P D2 N3");
  await expect(page.getByRole("heading", { name: "Sources & further reading", exact: true })).toBeVisible();
  await expect(page.locator("main").getByRole("link", { name: "Tanarang · Dhani", exact: false })).toHaveAttribute("href", "https://tanarang.com/raag-dhani/");

  // This name is beyond the search index's ordinary 400-character section excerpt.
  await page.keyboard.press("Control+k");
  await page.getByRole("combobox", { name: "Search", exact: true }).fill("Rasikapriya");
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
