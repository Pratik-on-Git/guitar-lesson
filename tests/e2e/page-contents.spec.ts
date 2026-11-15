import { expect, test } from "./fixtures";
import { TOPICS } from "../../lib/content/topics";

test("lesson contents opens from a fixed button into a right sidebar on desktop and phones", async ({ page }) => {
  const topic = TOPICS.find(topic => topic.slug === "indian-classical")!;
  const last = topic.sections.at(-1)!;
  for (const width of [1440, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ colorScheme: width === 320 ? "dark" : "light" });
    await page.goto("/learn/indian-classical");
    const trigger = page.getByRole("button", { name: "On This Page", exact: true });
    const sheet = page.getByRole("dialog", { name: "On This Page", exact: true });
    await expect(sheet).toBeHidden();
    await expect(trigger).toBeVisible();
    await trigger.click();
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole("navigation", { name: "On this page" }).getByRole("link")).toHaveCount(topic.sections.length);
    await expect.poll(() => sheet.evaluate(element => element.contains(document.activeElement))).toBe(true);
    await expect(sheet).toHaveAttribute("data-side", "right");
    // Allow the document's reserved scrollbar gutter at the right edge.
    await expect.poll(async () => {
      const box = await sheet.boundingBox();
      const edge = box!.x + box!.width;
      return edge <= width + 1 && edge >= width - 20;
    }).toBe(true);
    await sheet.getByRole("link", { name: last.title, exact: true }).click();
    await expect(sheet).toBeHidden();
    await expect(page).toHaveURL(new RegExp(`#${last.id}$`));
    await expect.poll(() => page.locator(`[id="${last.id}"]`).evaluate(element => element.getBoundingClientRect().top)).toBeLessThan(900);
    await expect(trigger).toBeFocused();
    const button = await trigger.boundingBox();
    expect(button!.y + button!.height).toBeLessThanOrEqual(900);
    expect(button!.y).toBeGreaterThan(800);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await trigger.press("Enter");
    await expect(sheet).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await sheet.getByRole("button", { name: "Close", exact: true }).click();
    await expect(sheet).toBeHidden();
  }
});

test("short lessons also expose their sections and the control follows the current lesson", async ({ page }) => {
  await page.goto("/learn/hindustani-svaras");
  await page.getByRole("button", { name: "On This Page", exact: true }).click();
  const contents = page.getByRole("dialog", { name: "On This Page", exact: true });
  await expect(contents.getByRole("link").first()).toBeVisible();
  await page.keyboard.press("Escape");
  await page.goto("/scales/major");
  await expect(page.getByRole("button", { name: "On This Page", exact: true })).toHaveCount(0);
});
