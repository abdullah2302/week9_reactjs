import { test, expect } from "@playwright/test";

const email = 'abdullahazhar@gmail.com';
const password = '123456789';

test.describe("real customer purchase", () => {
    test.beforeEach(() => {
        test.skip(
            !email || !password,
            "Set E2E_USER_EMAIL and E2E_USER_PASSWORD before running the real E2E test"
        );
    });

    test("logs in, adds a real product, checks out, and places an order", async ({ page }) => {
        await page.goto("/login");
        await page.getByRole("textbox", { name: "Email", exact: true }).fill(email);
        await page.getByPlaceholder("Password").fill(password);
        await page.getByRole("button", { name: "Sign in" }).click();

        await expect(page).not.toHaveURL(/\/login$/);

        await page.goto("/cart");
        const clearCartButton = page.getByRole("button", { name: "Clear Cart" });
        if (await clearCartButton.isVisible()) {
            await clearCartButton.click();
        }

        await page.goto("/products");
        await expect(page.getByRole("heading", { name: "All Products" })).toBeVisible();

        const productCards = page.locator("main > div.grid > div");
        await expect(productCards.first()).toBeVisible();
        const productName = (await productCards.first().getByRole("link").nth(1).textContent()).trim();

        await productCards.first().getByRole("button", { name: "Add" }).click();
        await page.locator('a[href="/cart"]').click();

        await expect(page).toHaveURL(/\/cart$/);
        await expect(page.getByRole("heading", { name: /Your Cart/ })).toBeVisible();
        await expect(page.getByText(productName, { exact: true })).toBeVisible();

        await page.getByRole("link", { name: "Proceed to Checkout" }).click();
        await expect(page.getByRole("heading", { name: "Checkout" })).toBeVisible();

        await page.locator('[name="email"]').fill(email);
        await page.locator('[name="firstName"]').fill("Playwright");
        await page.locator('[name="lastName"]').fill("Test");
        await page.locator('[name="address"]').fill("123 Test Street");
        await page.locator('[name="city"]').fill("Lahore");
        await page.locator('[name="state"]').fill("Punjab");
        await page.locator('[name="postalCode"]').fill("54000");
        await page.locator('[name="cardNumber"]').fill("4242 4242 4242 4242");
        await page.locator('[name="expiryDate"]').fill("12 / 30");
        await page.locator('[name="cvv"]').fill("123");

        await page.getByRole("button", { name: /Place Order/ }).click();

        await expect(page).toHaveURL(/\/$/);
        await expect(page.getByRole("heading", { name: "Featured Products" })).toBeVisible();

        await page.goto("/cart");
        await expect(page.getByText("Your cart is empty.", { exact: true })).toBeVisible();
    });
});
