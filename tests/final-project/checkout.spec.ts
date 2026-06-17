import { test, expect } from '@playwright/test';


test.describe("Login page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.saucedemo.com");
  });

  
  test("valid user can log in and see inventory page", async ({ page }) => {
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/inventory/);
  });

  test("locked user cannot log in and sees correct error", async ({ page }) => {
    await page.getByPlaceholder("Username").fill("locked_out_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(
      page.locator('[data-test="error"]'),
      "Locked user should see error message"
    ).toContainText("Sorry, this user has been locked out.");
  });
});

test.describe("Inventory", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.saucedemo.com");
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();
  });

  test("user can add two products to cart and verify badge count", async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    await expect(
      page.locator('[data-test="shopping-cart-badge"]'),
      "Cart badge should show 2 after adding two products"
    ).toHaveText("2");
  });

  test("user can remove one product and verify cart updates", async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    await expect(
      page.locator('[data-test="shopping-cart-badge"]'),
      "Cart badge should show 2 after adding two products"
    ).toHaveText("2");

    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

    await expect(
      page.locator('[data-test="shopping-cart-badge"]'),
      "Cart badge should show 1 after removing one product"
    ).toHaveText("1");
  });
});

test.describe("Checkout", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.saucedemo.com");
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();
  });

  test("user can complete checkout and see success message", async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill("Nata");
    await page.locator('[data-test="lastName"]').fill("Ly");
    await page.locator('[data-test="postalCode"]').fill("12345");
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();

    await expect(
      page,
      "Should redirect to checkout complete page"
    ).toHaveURL(/checkout-complete/);

    await expect(
      page.getByText("Thank you for your order!"),
      "Should show success message"
    ).toBeVisible();
  });
});