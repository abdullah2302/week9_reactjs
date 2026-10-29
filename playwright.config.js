import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: false,
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 2 : 0,
    reporter: "html",
    use: {
        baseURL: "http://localhost:5173",
        trace: "on-first-retry",
    },
    webServer: [
        {
            command: "npm --prefix ..\\backend run start",
            url: "http://127.0.0.1:5000/api/health",
            reuseExistingServer: true,
            timeout: 120000,
        },
        {
            command: "npm run dev -- --host localhost --port 5173",
            url: "http://localhost:5173",
            reuseExistingServer: true,
            timeout: 120000,
        },
    ],
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
});
