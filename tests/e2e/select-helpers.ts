import { expect, type Locator, type Page } from "@playwright/test";

export async function chooseOption(page: Page, trigger: Locator, label: string) {
  await trigger.click();
  await page.getByRole("option", { name: label, exact: true }).click();
  await expect(trigger).toContainText(label);
}
