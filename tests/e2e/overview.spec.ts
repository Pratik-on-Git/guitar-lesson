import { expect, test } from "./fixtures";
import { STUDY_PAGES } from "../../lib/nav";
import { practiceSummary, studySummary } from "../../lib/overview";
import type { PracticeSession } from "../../lib/store";

const now = new Date("2026-11-15T12:00:00.000Z");
const session = (date: string, minutes: number, focus = "Pentatonic & blues scales"): PracticeSession => ({
  id: `${date}-${minutes}`, date, minutes, focus, root: "A", bpm: 72, tasks: ["Play evenly"],
});

test("overview summaries respect calendar boundaries and canonical study pages", () => {
  const result = practiceSummary([
    session("2026-11-08T18:30:00Z", 10), // Nov 9 in India, first day of the seven-day window.
    session("2026-11-08T18:29:59Z", 90),
    session("2026-11-14T19:00:00Z", 20),
    session("2026-11-15T10:00:00Z", 30, "Chords"),
    session("2026-11-16T10:00:00Z", 80),
    session("invalid", 100),
    session("2026-11-15T10:00:00Z", -20),
  ], 7, now);
  expect(result.minutes).toBe(60);
  expect(result.count).toBe(3);
  expect(result.activeDays).toBe(2);
  expect(result.activity[0]).toEqual({ date: "2026-11-09", minutes: 10, sessions: 1 });
  expect(result.activity[6]).toEqual({ date: "2026-11-15", minutes: 50, sessions: 2 });
  expect(result.focus.reduce((sum, focus) => sum + focus.minutes, 0)).toBe(result.minutes);
  const progress = studySummary([STUDY_PAGES[0].href, STUDY_PAGES[0].href, "/books"]);
  expect(progress.done).toBe(1);
  expect(progress.groups.reduce((sum, group) => sum + group.done, 0)).toBe(progress.done);
  expect(progress.remaining).toHaveLength(STUDY_PAGES.length - 1);
});

test("new learners see truthful empty states and can explore the whole study map", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /^Overview$/i, exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: `0.0% studied: 0 of ${STUDY_PAGES.length} pages` })).toBeVisible();
  const activity = page.getByRole("region", { name: /Practice activity/i });
  await expect(activity.getByRole("button")).toHaveCount(28);
  await expect(activity.getByRole("button").first()).toBeVisible();
  await expect(page.locator(".overview-dashboard")).toHaveCSS("display", "grid");
  await expect(page.locator(".overview-gauge").first()).toHaveCSS("position", "relative");
  await expect(activity).toContainText("Save a session in the practice studio");
  await expect(page.getByRole("region", { name: /^Up next$/i, exact: true }).getByRole("listitem")).toHaveCount(5);
  const map = page.locator("#study-map");
  await map.locator("summary").first().click();
  await expect(map.getByRole("link", { name: /^Music Theory book guide$/i, exact: true })).toBeVisible();
  await expect(page.locator('a[href="/books"]')).toHaveCount(0);
  await page.getByRole("region", { name: /Progress by part/i }).getByRole("button", { name: /^Foundations:/i }).click();
  await expect(page.getByRole("link", { name: /^Study Foundations$/i, exact: true })).toHaveAttribute("href", "/learn/sound-and-pitch");
});

test("marking a lesson updates overview, next lesson and persisted progress", async ({ page, context }) => {
  await page.goto("/books");
  await expect(page).toHaveURL("/books/music-theory");
  await page.getByRole("button", { name: /^Mark as Studied$/i, exact: true }).click();
  await page.goto("/");
  const gauge = page.getByRole("region", { name: /Study progress/i });
  await expect(gauge.getByRole("img")).toHaveAttribute("aria-label", new RegExp(`1 of ${STUDY_PAGES.length} pages`));
  await expect(gauge.getByRole("link", { name: /Continue learning/i })).toHaveAttribute("href", "/book");
  await page.reload();
  await expect(gauge.getByRole("img")).toHaveAttribute("aria-label", new RegExp(`1 of ${STUDY_PAGES.length} pages`));
  const other = await context.newPage();
  await other.goto("/book");
  await other.getByRole("button", { name: /^Mark as Studied$/i, exact: true }).click();
  await expect(gauge.getByRole("img")).toHaveAttribute("aria-label", new RegExp(`2 of ${STUDY_PAGES.length} pages`));
  await other.close();
});

test("practice filters, chart detail and gauges use saved data", async ({ page }) => {
  await page.clock.setFixedTime(now);
  const studied = [...STUDY_PAGES.filter((entry) => entry.group === "Source library" || entry.group === "Foundations").map((entry) => entry.href), "/learn/rhythm"];
  await page.addInitScript(({ studied, sessions }) => {
    localStorage.setItem("gl-studied", JSON.stringify(studied));
    localStorage.setItem("gl-practice-sessions", JSON.stringify(sessions));
  }, { studied, sessions: [session("2026-11-15T10:00:00Z", 20), session("2026-11-14T10:00:00Z", 30, "Chords"), session("2026-10-28T10:00:00Z", 40, "Rhythm"), session("2026-10-01T10:00:00Z", 100)] });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const activity = page.getByRole("region", { name: /Practice activity/i });
  await expect(activity).toContainText("90 minutes across 3 saved sessions");
  await expect(page.getByRole("region", { name: /Learning status/i }).getByRole("img")).toHaveAttribute("aria-label", /^2 complete, 1 in progress, 8 not started/);
  await expect(page.locator("main").getByRole("link", { name: /^Practice logged/i })).toContainText("90");
  await activity.getByRole("button", { name: /15 November: 20 minutes, 1 session/i }).click();
  await expect(activity.locator('[aria-live="polite"]')).toContainText("15 Nov · 20 min · 1 saved session");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: ".local/overview-desktop.png", fullPage: true });
  await page.getByRole("radio", { name: /^7 days$/i, exact: true }).click();
  await expect(activity).toContainText("50 minutes across 2 saved sessions");
  await expect(activity.getByRole("button")).toHaveCount(7);
  await expect(page.locator("main").getByRole("link", { name: /^Practice logged/i })).toContainText("50");
  await page.getByRole("radio", { name: /^7 days$/i, exact: true }).press("ArrowRight");
  await expect(page.getByRole("radio", { name: /^28 days$/i, exact: true })).toBeChecked();
  await expect(activity.getByRole("button")).toHaveCount(28);
  await page.getByRole("button", { name: /Switch to Dark Theme/i }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.screenshot({ path: ".local/overview-dark.png", fullPage: true });
});

test("a real practice session flows into the overview", async ({ page }) => {
  await page.goto("/practice");
  const builder = page.locator("section").filter({ has: page.getByRole("heading", { name: /^Build a practice session$/i, exact: true }) });
  await builder.getByRole("checkbox").first().check();
  await page.getByLabel(/Session minutes/i, { exact: true }).fill("35");
  await page.getByRole("button", { name: /^Save session$/i, exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Saved locally" })).toBeVisible();
  await page.goto("/");
  await expect(page.getByRole("region", { name: /Practice activity/i })).toContainText("35 minutes across 1 saved session");
  await expect(page.locator("main").getByRole("link", { name: /^Saved sessions/i })).toContainText("Across 1 active day");
});

test("complete learners get revision actions and a full gauge", async ({ page }) => {
  await page.addInitScript((hrefs) => localStorage.setItem("gl-studied", JSON.stringify(hrefs)), STUDY_PAGES.map((entry) => entry.href));
  await page.goto("/");
  await expect(page.getByRole("img", { name: `100.0% studied: ${STUDY_PAGES.length} of ${STUDY_PAGES.length} pages` })).toBeVisible();
  await expect(page.getByRole("link", { name: /^Put it into practice$/i, exact: true })).toHaveAttribute("href", "/practice");
  await expect(page.getByRole("region", { name: /Revisit your foundations/i })).toBeVisible();
  await expect(page.getByRole("region", { name: /Learning status/i }).getByRole("img")).toHaveAttribute("aria-label", /^11 complete, 0 in progress, 0 not started/);
});

test("overview fits phone, tablet and desktop in both themes without runtime errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  for (const width of [320, 390, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.getByRole("heading", { name: /^Overview$/i, exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `width ${width}`).toBe(true);
    if (width === 390) await page.screenshot({ path: ".local/overview-mobile.png", fullPage: true });
    if (width === 768) await page.screenshot({ path: ".local/overview-tablet.png", fullPage: true });
  }
  await page.getByRole("button", { name: /Switch to Dark Theme/i }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(errors).toEqual([]);
});
