import { test, expect } from "@playwright/test";

const products = [
    {
        _id: "aurora-lamp",
        name: "Aurora Desk Lamp",
        category: "Electronics",
        price: 39.99,
        description: "A compact lamp for a brighter workspace.",
        image: "",
        inStock: true,
        stockQuantity: 12,
    },
    {
        _id: "ceramic-mug",
        name: "Ceramic Mug",
        category: "Kitchen",
        price: 14.99,
        description: "A durable mug for everyday coffee.",
        image: "",
        inStock: true,
        stockQuantity: 20,
    },
];

async function mockApi(page) {
    await page.route("**/api/products**", async (route) => {
        const requestUrl = new URL(route.request().url());
        const productId = requestUrl.pathname.match(/\/api\/products\/([^/]+)$/)?.[1];

        if (productId) {
            const product = products.find((item) => item._id === productId);
            await route.fulfill({
                status: product ? 200 : 404,
                contentType: "application/json",
                body: JSON.stringify(product || { message: "Product not found" }),
            });
            return;
        }

        const search = requestUrl.searchParams.get("search")?.toLowerCase() || "";
        const category = requestUrl.searchParams.get("category") || "All";
        const visibleProducts = products.filter((product) => {
            const matchesSearch = product.name.toLowerCase().includes(search);
            const matchesCategory = category === "All" || product.category === category;
            return matchesSearch && matchesCategory;
        });

        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
                products: visibleProducts,
                categories: ["Electronics", "Kitchen"],
                pagination: {
                    page: 1,
                    limit: 12,
                    total: visibleProducts.length,
                    totalPages: 1,
                },
            }),
        });
    });

    await page.route("**/api/reviews/**", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
                reviews: [],
                summary: { average: 0, total: 0, distribution: [] },
            }),
        });
    });
}

test.describe("shopping flow", () => {
    test.beforeEach(async ({ page }) => {
        await mockApi(page);
    });

    test("navigates from the homepage to the product catalogue", async ({ page }) => {
        await page.goto("/");

        await expect(page.getByRole("heading", { name: "Featured Products" })).toBeVisible();
        await expect(page.getByText("Aurora Desk Lamp")).toBeVisible();

        await page.getByRole("link", { name: "View all →" }).click();

        await expect(page).toHaveURL(/\/products$/);
        await expect(page.getByRole("heading", { name: "All Products" })).toBeVisible();
        await expect(page.getByText("Showing 2 of 2 products")).toBeVisible();
    });

    test("filters products by search text", async ({ page }) => {
        await page.goto("/products");

        await page.getByPlaceholder("Search").fill("mug");

        await expect(page.getByText("Showing 1 of 1 products")).toBeVisible();
        await expect(page.getByText("Ceramic Mug")).toBeVisible();
        await expect(page.getByText("Aurora Desk Lamp")).not.toBeVisible();
    });

    test("opens a product detail page", async ({ page }) => {
        await page.goto("/products");

        await page.getByRole("link", { name: "Aurora Desk Lamp" }).first().click();

        await expect(page).toHaveURL(/\/products\/aurora-lamp$/);
        await expect(page.getByRole("heading", { name: "Aurora Desk Lamp" })).toBeVisible();
        await expect(page.getByText("A compact lamp for a brighter workspace.")).toBeVisible();
    });
});
