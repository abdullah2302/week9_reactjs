# React + Vite

This frontend uses React, Vite, Tailwind CSS, and Oxlint.

## Development

```bash
npm install
npm run dev
```

## End-to-end tests

The real Playwright purchase test uses the local Vite frontend, Express API, MongoDB, and an existing customer account. It clears the account cart, adds a real in-stock product, submits checkout, and leaves a real order in the database.

```bash
npm install
npx playwright install chromium
npm run test:e2e:real
```

Set credentials in the terminal before running the test. Do not commit them:

```powershell
$env:E2E_USER_EMAIL = "your-test-account@example.com"
$env:E2E_USER_PASSWORD = "your-test-password"
```

The test starts the backend and frontend automatically when they are not already running. To inspect the HTML report:

```bash
npx playwright show-report
```
