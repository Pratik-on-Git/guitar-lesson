import { expect, test } from "@playwright/test";

test("theme follows the system until explicitly selected, then persists across pages", async ({ page, context }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/design-system");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.getByRole("button", { name: /Switch to Light Theme/i })).toBeVisible();
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await page.getByRole("button", { name: /Switch to Dark Theme/i }).click();
  await page.goto("/scales/major");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.locator('meta[name="theme-color"]').first()).toHaveAttribute("content", "#09090c");
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  const other = await context.newPage();
  await other.goto("/");
  await other.getByRole("button", { name: /Switch to Light Theme/i }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await other.close();
});

test("design specimens are interactive and fit small screens in both themes", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/design-system");
  await page.getByRole("button", { name: /^Add to practice$/i, exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Example added");
  await page.getByRole("radio", { name: /^Explore$/i, exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: /^Listen$/i, exact: true })).toBeChecked();
  await page.getByRole("button", { name: /Open dialog/i }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page.getByRole("button", { name: /Open dialog/i })).toBeFocused();
  for (const theme of ["light", "dark"]) {
    if (theme === "dark") await page.getByRole("button", { name: /Switch to Dark Theme/i }).click();
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${theme} at ${width}`).toBe(true);
    }
    await expect(page.locator("main .light")).toHaveCSS("background-color", "rgb(243, 244, 247)");
    await expect(page.locator("main .dark")).toHaveCSS("background-color", "rgb(9, 9, 12)");
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `.local/design-system-${theme}.png`, fullPage: true });
  }
  expect(errors).toEqual([]);
});

test("semantic foregrounds retain readable contrast in both themes", async ({ page }) => {
  await page.goto("/design-system");
  for (const theme of ["light", "dark"]) {
    const values = await page.locator(`main .${theme}`).evaluate(element => {
      const styles = getComputedStyle(element);
      return Object.fromEntries(["foreground", "background", "card", "muted-foreground", "primary", "primary-foreground", "success", "warning", "destructive", "info"].map(token => [token, styles.getPropertyValue(`--${token}`).trim()]));
    });
    function luminance(hex: string) {
      const raw = hex.replace("#", "");
      const expanded = raw.length === 3 ? [...raw].map(c => c + c).join("") : raw;
      const [r, g, b] = expanded.match(/../g)!.map(value => {
        const n = parseInt(value, 16) / 255;
        return n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4;
      });
      return .2126 * r + .7152 * g + .0722 * b;
    }
    function contrast(a: string, b: string) {
      const l = [luminance(a), luminance(b)].sort((x, y) => y - x);
      return (l[0] + .05) / (l[1] + .05);
    }
    for (const background of ["background", "card"]) {
      for (const foreground of ["foreground", "muted-foreground", "primary", "success", "warning", "destructive", "info"]) {
        expect(contrast(values[foreground], values[background]), `${theme} ${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5);
      }
    }
    expect(contrast(values.primary, values["primary-foreground"])).toBeGreaterThanOrEqual(4.5);
  }
});

test("lesson and tool families fit desktop and mobile in both themes", async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const routes = ["/scales/major", "/modes/major", "/chords", "/voicings", "/learn/indian-classical", "/book", "/practice", "/rhythm-lab", "/composition", "/listening", "/circle-of-fifths", "/harmony-lab"];
  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme });
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator("main h1")).toBeVisible();
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${route} ${colorScheme} ${width}`).toBe(true);
      }
      if (route === "/scales/major") await page.screenshot({ path: `.local/scale-${colorScheme}.png` });
      if (route === "/practice") {
        await page.getByRole("heading", { name: /Practice metronome/i }).locator("xpath=ancestor::section").screenshot({ path: `.local/metronome-${colorScheme}.png` });
      }
    }
  }
  await page.keyboard.press("Control+k");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: /Open Menu/i }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  expect(errors).toEqual([]);
});
