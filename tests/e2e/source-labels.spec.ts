import { expect, test } from "@playwright/test";
import { STUDY_PAGES } from "../../lib/nav";
import { SEARCH_INDEX } from "../../lib/search";
import { EXERCISE_TYPES, exerciseQuestion } from "../../lib/music/exercises";
import { practiceSummary } from "../../lib/overview";

const sourceNames = /Fretboard Concepts|Papadopoulos|Nicolas|\bCarter\b|Beginner to Expert|Indian Classical Raga Theory|Guitar\.docx/i;

test("search labels and all exercise prompts omit the original source names", () => {
  for (const entry of SEARCH_INDEX) {
    expect([entry.title, entry.context, entry.keywords].join(" ")).not.toMatch(sourceNames);
  }
  for (const exercise of EXERCISE_TYPES) {
    expect(exercise.label).not.toMatch(sourceNames);
    for (let index = 0; index < 80; index++) {
      const question = exerciseQuestion(exercise.value, index);
      expect([question.prompt, question.hint, question.explanation].join(" ")).not.toMatch(sourceNames);
    }
  }
});

test("every study page omits source names from visible content and metadata", async ({ page }) => {
  test.setTimeout(180_000);
  for (const href of ["/", ...STUDY_PAGES.map((entry) => entry.href)]) {
    const response = await page.goto(href);
    expect(response?.status(), href).toBe(200);
    await expect(page.locator("main h1"), href).toBeVisible();
    expect(await page.locator("body").innerText(), href).not.toMatch(sourceNames);
    expect(await page.title(), href).not.toMatch(sourceNames);
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description ?? "", href).not.toMatch(sourceNames);
  }
});

test("previously saved practice labels stay anonymous and group with new sessions", async ({ page }) => {
  const date = new Date().toISOString();
  const sessions = [
    { id: "legacy", date, root: "A", focus: "Carter · listening & tuning", minutes: 15, bpm: 72, tasks: ["Sing an interval"] },
    { id: "current", date, root: "C", focus: "Listening & tuning", minutes: 20, bpm: 84, tasks: ["Sing an interval"] },
  ];
  expect(practiceSummary(sessions, 28, new Date()).focus).toEqual([{ name: "Listening & tuning", minutes: 35 }]);
  await page.addInitScript((saved) => localStorage.setItem("gl-practice-sessions", JSON.stringify(saved)), sessions);
  await page.goto("/");
  const activity = page.getByRole("region", { name: "Practice activity" });
  await expect(activity).toContainText("Listening & tuning");
  await expect(activity).toContainText("35 min");
  expect(await page.locator("body").innerText()).not.toMatch(sourceNames);
  await page.goto("/practice");
  const history = page.locator("section").filter({ has: page.getByRole("heading", { name: "Recent practice", exact: true }) });
  await expect(history.getByRole("cell", { name: "Listening & tuning", exact: true })).toHaveCount(2);
  expect(await page.locator("body").innerText()).not.toMatch(sourceNames);
});
