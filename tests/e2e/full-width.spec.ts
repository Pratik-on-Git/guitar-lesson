import { expect, test } from "./fixtures";
import { TOPICS } from "../../lib/content/topics";

test("lesson diagrams, widgets and supporting surfaces fill their panels at wide and phone sizes", async ({ page }) => {
  test.setTimeout(60_000);
  const widgetTopic = TOPICS.find(topic => topic.sections.some(section => section.blocks.some(block => block.type === "widget")))!;
  const widgetSection = widgetTopic.sections.find(section => section.blocks.some(block => block.type === "widget"))!;
  const cases = [
    { route: "/learn/carnatic-talas", section: "carnatic-tala-structure", children: "figure" },
    { route: `/learn/${widgetTopic.slug}`, section: widgetSection.id, children: "div.ring-1" },
    ...(["facts", "callout"] as const).map(type => {
      const topic = TOPICS.find(topic => topic.sections.some(section => section.blocks.some(block => block.type === type)))!;
      const section = topic.sections.find(section => section.blocks.some(block => block.type === type))!;
      return { route: `/learn/${topic.slug}`, section: section.id, children: type === "facts" ? "dl" : "aside" };
    }),
  ];
  for (const width of [2560, 1920, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const item of cases) {
      await page.goto(item.route);
      const main = page.locator("main#content");
      await expect(main).toBeVisible();
      expect(await main.evaluate(element => Math.abs(element.getBoundingClientRect().width - element.parentElement!.getBoundingClientRect().width))).toBeLessThan(2);
      const body = page.locator(`[id="${item.section}"] [data-slot="card-content"] > div`).first();
      const surfaces = body.locator(`:scope > :is(${item.children})`);
      expect(await surfaces.count()).toBeGreaterThan(0);
      const bodyBox = await body.boundingBox();
      for (const surface of await surfaces.all()) {
        const box = await surface.boundingBox();
        expect(Math.abs(box!.width - bodyBox!.width)).toBeLessThan(2);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), item.route).toBe(true);
      if (item.section === "carnatic-tala-structure" && width === 1920) {
        await page.getByRole("button", { name: /Switch to Dark Theme/i }).click();
        await page.locator(`[id="${item.section}"]`).screenshot({ path: ".local/full-width-talas.png", style: "header { visibility: hidden !important; }" });
      }
    }
  }
});
