import { test, expect } from '@playwright/test';


test.describe("Login page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://www.saucedemo.com");
  });

  test("successful login redirects to inventory", async ({ page }) => {
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/inventory/);
  });

  test("wrong password shows error message", async ({ page }) => {
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("wrong_password");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(
      page.locator('[data-test="error"]'),
      "Error should appear for wrong credentials"
    ).toBeVisible();
  });

  test("empty form shows validation error", async ({ page }) => {
    await page.getByRole("button", { name: "Login" }).click();

    await expect(
      page.locator('[data-test="error"]'),
      "Error should appear when form is empty"
    ).toBeVisible();
  });

  test("only username shows validation error", async ({ page }) => {
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(
      page.locator('[data-test="error"]'),
      "Error should appear when password is missing"
    ).toBeVisible();
  });

  test("only password shows validation error", async ({ page }) => {
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(
      page.locator('[data-test="error"]'),
      "Error should appear when username is missing"
    ).toBeVisible();
  });

  test("locked user cannot login", async ({ page }) => {
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

  test("working with product list", async ({ page }) => {
  const products = page.locator(".inventory_item");

  await expect(
    products,
    "There should be 6 products on inventory page"
  ).toHaveCount(6);

  await products.nth(1).locator(".inventory_item_name").click();

  await expect(
    page,
    "Should navigate to product page after clicking item"
  ).toHaveURL(/inventory-item/);
});

  test("add product to cart shows badge 1", async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    await expect(
      page.locator('[data-test="shopping-cart-badge"]'),
      "Cart badge should show 1 after adding a product"
    ).toHaveText("1");
  });

  test("remove product from cart hides badge", async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

    await expect(
      page.locator('[data-test="shopping-cart-badge"]'),
      "Cart badge should not be visible after removing product"
    ).not.toBeVisible();
  });

  test("cart persists after page refresh", async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.reload();

    await expect(
      page.locator('[data-test="shopping-cart-badge"]'),
      "Cart badge should persist after page refresh"
    ).toHaveText("1");
  });

  test("add 3 products to cart shows badge 3", async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();

    await expect(
      page.locator('[data-test="shopping-cart-badge"]'),
      "Cart badge should show 3 after adding three products"
    ).toHaveText("3");

    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

    await expect(
      page.locator('[data-test="shopping-cart-badge"]'),
      "Cart badge should show 2 after removing one product"
    ).toHaveText("2");
  });

  test("sorting by price low to high changes first product", async ({ page }) => {
    await page.locator('[data-test="product-sort-container"]').selectOption("lohi");

    await expect(
      page.locator(".inventory_item_name").first(),
      "First product should be Sauce Labs Onesie when sorted by price low to high"
    ).toHaveText("Sauce Labs Onesie");
  });
});
