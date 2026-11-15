import { chooseOption } from "./select-helpers";
import { guitarStudy } from "../../lib/music/raga-guitar";
import { expect, test } from "./fixtures";

test.beforeEach(async ({ page }) => { page.on("pageerror", (error) => { throw error; }); });

test("ornament sketches and source symbolism preserve their different meanings", async ({ page }) => {
  await page.goto("/learn/gamaka");
  const ornaments = page.locator("#gamaka");
  await ornaments.getByRole("radio", { name: "Andolan", exact: true }).click();
  await expect(ornaments.getByRole("img")).toHaveAttribute("aria-label", /Andolan/);
  await ornaments.getByRole("radio", { name: /Separate Pitch Targets/i }).click();
  await expect(ornaments.getByRole("img")).toHaveAttribute("aria-label", /isolated targets/);
  await page.goto("/learn/svara-symbolism");
  const symbolism = page.locator("#symbolism");
  await symbolism.getByRole("radio", { name: "Ni", exact: true }).click();
  await expect(symbolism.locator('[aria-live="polite"]')).toContainText("Elephant");
  await expect(symbolism.locator('[aria-live="polite"]')).toContainText("Venus");
  await expect(symbolism).toContainText("not acoustic facts");
  await expect(page.locator("#guitar-application")).toHaveCount(0);
  await symbolism.locator("summary").click();
  await expect(symbolism.locator("tbody tr")).toHaveCount(7);
});

test("all 35 tala combinations calculate groups and preserve gesture boundaries", async ({ page }) => {
  await page.goto("/learn/carnatic-talas");
  const section = page.locator("#carnatic-tala-structure");
  await expect(section.getByRole("region", { name: "35-tala combinations, scroll horizontally", exact: true }).getByRole("button")).toHaveCount(35);
  await section.getByRole("button", { name: "Dhruva: 29 counts", exact: true }).click();
  await expect(section.getByLabel("Laghu jati", { exact: true })).toContainText("Sankirna · 9 counts");
  await expect(section).toContainText("9 + 2 + 9 + 9 = 29 counts");
  await section.getByRole("button", { name: "Carnatic count 11: Wave", exact: true }).click();
  await expect(section.locator('[aria-live="polite"]')).toContainText("Count 11 of 29 · Wave · Drutam");
  await section.getByRole("button", { name: "Carnatic count 29: Finger count", exact: true }).click();
  await section.getByRole("button", { name: "Next Carnatic count", exact: true }).click();
  await expect(section.locator('[aria-live="polite"]')).toContainText("Count 1 of 29 · Clap");
  await section.getByRole("button", { name: /Play One Carnatic Cycle/i }).click();
  await expect(section.getByRole("button", { name: /Stop Example/i })).toBeVisible();
  await chooseOption(page, section.getByLabel("Laghu jati", { exact: true }), "Chaturasra · 4 counts");
  await expect(section.getByRole("button", { name: /Play One Carnatic Cycle/i })).toBeVisible();
});

test("teental returns to sam and keeps khali as a sounded division", async ({ page }) => {
  await page.goto("/learn/tala-practice");
  const section = page.locator("#tala-practice");
  await section.getByRole("button", { name: "Beat 9", exact: true }).click();
  await expect(section.locator('[aria-live="polite"]')).toContainText("Wave · khali");
  await section.getByRole("button", { name: "Beat 16", exact: true }).click();
  await section.getByRole("button", { name: /Next beat/i }).click();
  await expect(section.locator('[aria-live="polite"]')).toContainText("Beat 1 of 16 · Clap · sam");
  await expect(page.locator("#tala-practice-notes")).toContainText("Identify the recording");
});

test("listening studies preserve pitch differences, turns and exact guitar excerpts", async ({ page }) => {
  await page.goto("/learn/yaman-listening");
  const yaman = page.locator("#yaman-listening");
  await yaman.getByRole("radio", { name: /Shuddha Ma/i }).click();
  await expect(yaman.locator('[aria-live="polite"]')).toContainText("outside this Yaman");
  await yaman.getByRole("radio", { name: /Tivra Ma/i }).click();
  await expect(yaman.getByRole("img", { name: /phrase excerpt/ })).toHaveAttribute("aria-label", /,Ni Re Ga/);
  await yaman.getByRole("link", { name: "Play Yaman on guitar", exact: true }).click();
  await expect(page).toHaveURL("/learn/raga-guitar?study=phrase-yaman#guitar-application");
  const guitar = page.locator("#guitar-application:visible");
  await expect(guitar.getByRole("combobox", { name: "Practice material", exact: true })).toContainText(guitarStudy("phrase-yaman").title);
  await expect(guitar.locator('[aria-live="polite"]')).toContainText("B2");
  await page.goto("/learn/durga-listening");
  const durga = page.locator("#durga-listening");
  await durga.getByRole("radio", { name: /Descent Outline/i }).click();
  await expect(durga.getByRole("img", { name: /^Durga · descent:/ })).toHaveAttribute("aria-label", /Sa′ Dha Pa Dha Ma Re Sa/);
  await page.goto("/learn/malkauns-listening");
  await expect(page.locator("#malkauns-listening")).toContainText("Re · Pa");
  await expect(page.locator("#guitar-application").getByRole("combobox", { name: "Practice material", exact: true })).toContainText(guitarStudy("listening-malkauns").title);
});

test("the seven new pages fit phones and both themes", async ({ page }) => {
  test.setTimeout(60_000);
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const slug of ["gamaka", "svara-symbolism", "carnatic-talas", "yaman-listening", "durga-listening", "malkauns-listening", "tala-practice"]) {
      await page.goto(`/learn/${slug}`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), slug).toBe(true);
      if (width === 390 && ["carnatic-talas", "durga-listening", "svara-symbolism"].includes(slug)) {
        await page.locator('main section').first().screenshot({ path: `.local/performance-${slug}.png`, style: "header { visibility: hidden !important; }" });
      }
    }
  }
  await page.getByRole("button", { name: /Switch to Dark Theme/i }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
});
