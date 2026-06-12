import { test, expect } from "@playwright/test";

test("login should redirect to inventory", async ({ page }) => {
  await page.goto("https://www.saucedemo.com");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/inventory/);
});

// Root cause:   wrong placeholder text — "User Name" instead of "Username"
// Fix:          changed getByPlaceholder("User Name") to getByPlaceholder("Username")
// How I verified: ran the test — passed

test("error message on wrong password", async ({ page }) => {
  await page.goto("https://www.saucedemo.com");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("wrong_password");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.locator('[data-test="error"]')).toHaveText(
    "Epic sadface: Username and password do not match any user in this service"
  );
});

// Root cause:   1) getByTestId looks for data-testid but SauceDemo uses data-test
//              2) wrong expected text — "Username and password do not match" 
//                 instead of full text "Epic sadface: Username and password do not match any user in this service"
// Fix:          1) changed getByTestId("error") to locator('[data-test="error"]')
//              2) changed toHaveText() to toContainText() with correct text
// How I verified: ran the test — passed

test("cart badge appears after adding product", async ({ page }) => {
  await page.goto("https://www.saucedemo.com");
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
});

// Root cause:   missing await before page.locator(...).click() — 
//              the click was fired without waiting for it to complete
// Fix:          added await before page.locator(...).click()
// How I verified: ran the test — passed