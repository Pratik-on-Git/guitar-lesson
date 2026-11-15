import { expect, test } from "@playwright/test";

test("major sections disclose lessons and follow the current route", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Study topics" });
  await expect(nav.getByRole("button", { name: "Source Library", exact: true })).toHaveAttribute("aria-expanded", "false");
  await expect(nav.getByRole("link", { name: "Fretboard System", exact: true })).toBeHidden();
  await nav.getByRole("button", { name: "Source Library", exact: true }).click();
  await nav.getByRole("link", { name: "Fretboard System", exact: true }).click();
  await expect(page).toHaveURL(/\/learn\/fretboard-system/);
  await expect(nav.getByRole("button", { name: "Source Library", exact: true })).toHaveAttribute("aria-expanded", "true");
  await nav.getByRole("button", { name: "Source Library", exact: true }).press("Enter");
  await expect(nav.getByRole("link", { name: "Fretboard System", exact: true })).toBeHidden();
  await page.goto("/scales/major");
  await expect(nav.getByRole("button", { name: "Scales", exact: true })).toHaveAttribute("aria-expanded", "true");
  await expect(nav.getByRole("link", { name: "Major", exact: true })).toHaveAttribute("aria-current", "page");
  await page.getByRole("button", { name: "Collapse Sidebar" }).click();
  await nav.getByRole("button", { name: "Foundations", exact: true }).click();
  await expect(page.getByRole("button", { name: "Collapse Sidebar" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Sound & Pitch", exact: true })).toBeVisible();
});

test("mobile sections expand inside the sheet and navigation closes it", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: /Open Menu/i }).click();
  const sheet = page.getByRole("dialog");
  await sheet.getByRole("button", { name: "Rhythm & Meter", exact: true }).click();
  await sheet.getByRole("link", { name: "Rhythm Lab", exact: true }).click();
  await expect(page).toHaveURL(/\/rhythm-lab/);
  await expect(sheet).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});
