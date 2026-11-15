import { expect, test } from "@playwright/test";
import { safeReturnTo } from "../../lib/auth-navigation";

test("all application entry points require authentication, including prefetches", async ({ request }) => {
  for (const path of ["/", "/practice", "/scales", "/scales/major", "/learn/rhythm", "/book", "/books/music-theory", "/design-system", "/account", "/unknown-page"]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(307);
    const location = new URL(response.headers().location, response.url());
    expect(location.pathname).toBe("/sign-in");
    expect(location.searchParams.get("next")).toBe(path);
  }
  const rsc = await request.get("/practice", { headers: { RSC: "1", "Next-Router-Prefetch": "1" }, maxRedirects: 0 });
  expect(rsc.status()).toBe(307);
  const api = await request.get("/api/private-example");
  expect(api.status()).toBe(401);
});

test("return destinations reject external URLs and auth loops", () => {
  for (const value of ["https://untrusted.example", "//untrusted.example", "/\\untrusted.example", "/sign-in", "/api/auth/sign-out", "/\n/evil"]) expect(safeReturnTo(value)).toBe("/");
  expect(safeReturnTo("/scales/major?root=D")).toBe("/scales/major?root=D");
});

test("requested destinations survive switching between sign-in and sign-up", async ({ page }) => {
  await page.goto("/scales/major?root=D");
  await expect(page).toHaveURL(/\/sign-in\?next=/);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await page.getByRole("link", { name: "Create an account", exact: true }).click();
  expect(new URL(page.url()).searchParams.get("next")).toBe("/scales/major?root=D");
  await expect(page.getByRole("heading", { name: "Create your account" })).toBeVisible();
});

test("auth pages are separate, accessible forms with password confirmation", async ({ page }) => {
  await page.goto("/sign-up");
  await expect(page.getByRole("heading", { name: "Create your account" })).toBeVisible();
  await expect(page.locator("aside")).toHaveCount(0);
  await page.getByLabel("Full name").fill("Test Musician");
  await page.getByLabel("Email address").fill("form-test@example.com");
  await page.getByLabel("Password", { exact: true }).fill("practice-notes-123");
  await page.getByLabel("Confirm password").fill("different-password");
  await page.getByRole("button", { name: "Show password", exact: true }).click();
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute("type", "text");
  await page.getByRole("button", { name: "Create account", exact: true }).click();
  await expect(page.locator("main").getByRole("alert")).toHaveText("Your passwords don’t match.");
  await page.getByRole("link", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL("/sign-in");
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await expect(page.getByLabel("Full name")).toBeHidden();
  await expect(page.getByRole("region", { name: "Welcome back" }).getByLabel("Password", { exact: true })).toHaveAttribute("autocomplete", "current-password");
});

test("guests cannot open the account page or forge a session cookie", async ({ page, context, baseURL }) => {
  await page.goto("/account");
  await expect(page).toHaveURL(/\/sign-in\?next=/);
  await context.addCookies([{ name: "better-auth.session_token", value: "forged.invalid", url: baseURL! }]);
  await page.goto("/account");
  await expect(page).toHaveURL(/\/sign-in\?next=/);
});

test("auth forms fit small screens and both themes", async ({ page }) => {
  await page.goto("/sign-up?error=google");
  await expect(page.locator("main").getByRole("alert")).toContainText("Google sign-in");
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.evaluate(() => document.documentElement.classList.add("dark"));
  await expect(page.getByRole("button", { name: "Create account", exact: true })).toBeVisible();
});

test("real individual accounts persist, reject bad credentials, and sign out", async ({ page, context, baseURL }) => {
  test.skip(process.env.AUTH_E2E_LIVE !== "1", "Enable against a development MongoDB with AUTH_E2E_LIVE=1.");
  const email = `auth-e2e-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
  const password = "Practice-notes-123!";
  await page.goto("/sign-up?next=%2Faccount");
  await page.getByLabel("Full name").fill("Test Musician");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Confirm password").fill(password);
  await page.getByRole("button", { name: "Create account", exact: true }).click();
  await expect(page).toHaveURL("/account", { timeout: 30_000 });
  await expect(page.getByText(email, { exact: true })).toBeVisible();
  const cookies = await context.cookies();
  expect(cookies.some((cookie) => cookie.name.includes("session_token") && cookie.httpOnly)).toBe(true);
  await page.reload();
  await expect(page.getByText(email, { exact: true })).toBeVisible();
  // A new browser tab uses the same persisted session.
  const tab = await context.newPage();
  await tab.goto("/account");
  await expect(tab.getByText(email, { exact: true })).toBeVisible();
  const staleCookies = await context.cookies();
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(page).toHaveURL("/sign-in");
  // Signing out revokes the database session, not just the browser cookie.
  await context.addCookies(staleCookies);
  await tab.reload();
  await expect(tab).toHaveURL(/\/sign-in\?next=/);
  await context.clearCookies();
  await tab.close();
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill("wrong-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText("Check your email and password");
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL("/");
  await page.getByRole("link", { name: "Your account", exact: true }).click();
  await expect(page).toHaveURL("/account");
  // Public endpoints reject attempts from an untrusted origin.
  const csrf = await page.request.post(`${baseURL}/api/auth/sign-out`, { headers: { Origin: "https://untrusted.example" }, data: {} });
  expect(csrf.status()).toBe(403);
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(page).toHaveURL("/sign-in");
});
