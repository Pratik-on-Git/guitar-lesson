import { expect, test } from "./fixtures";

test("dropdowns across study tools and lessons use accessible shadcn menus on desktop and mobile", async ({ page }) => {
  test.setTimeout(180_000);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const routes = ["/arpeggios", "/improvisation", "/harmonization", "/harmony-lab", "/voicings", "/progressions", "/listening", "/composition", "/practice", "/rhythm-lab", "/book", "/books/music-theory", "/learn/indian-classical", "/learn/melakarta-construction", "/learn/katapayadi-and-chakras", "/learn/melakarta-chart", "/learn/carnatic-talas", "/learn/tala-practice", "/learn/raga-guitar"];
  for (const width of [1440, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ colorScheme: width === 320 ? "dark" : "light" });
    for (const route of routes) {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator("main select:visible")).toHaveCount(0);
      const triggers = page.locator('main [data-slot="select-trigger"]:visible');
      expect(await triggers.count(), route).toBeGreaterThan(0);
      for (const trigger of await triggers.all()) {
        await expect(trigger).toHaveAccessibleName(/\S/);
        await trigger.click();
        const list = page.getByRole("listbox");
        await expect(list).toBeVisible();
        expect(await page.getByRole("option").count()).toBeGreaterThan(0);
        const box = await list.boundingBox();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
        await page.keyboard.press("Escape");
        await expect(trigger).toBeFocused();
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), route).toBe(true);
    }
  }
  expect(errors).toEqual([]);
});

test("keyboard selection, typeahead and grouped guitar materials work", async ({ page }) => {
  await page.goto("/learn/tala-practice");
  const tempo = page.getByRole("combobox", { name: "Teental practice tempo", exact: true });
  await tempo.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  await expect(tempo).toContainText("100 counts/min");
  await expect(tempo).toBeFocused();
  await page.goto("/learn/raga-guitar");
  const material = page.getByRole("combobox", { name: "Practice material", exact: true });
  await material.click();
  for (const name of ["Pitch maps", "Raga outlines", "Ten thaats", "Melakartas"]) {
    await expect(page.getByRole("group", { name, exact: true })).toHaveCount(1);
  }
  await page.keyboard.type("Yaman");
  await page.keyboard.press("Enter");
  await expect(material).toContainText("Yaman");
});
