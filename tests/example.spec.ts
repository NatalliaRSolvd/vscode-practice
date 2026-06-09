import { test, expect } from '@playwright/test';  //  Import tools

test('has title', async ({ page }) => {           //  test case
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);    // Assert it's present
});

test('get started link', async ({ page }) => {     //  test case
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();    // Click button

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();    // Assert it's present with name
});
