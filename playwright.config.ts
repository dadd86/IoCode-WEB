import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:8080";
const chromiumExecutablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
const videoMode = process.env.PLAYWRIGHT_DISABLE_VIDEO === "true" ? "off" : "retain-on-failure";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 45_000,
  expect: {
    timeout: 7_500
  },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ["list"],
    ["json", { outputFile: "qa-artifacts/playwright-results.json" }],
    ["html", { outputFolder: "qa-artifacts/playwright-report", open: "never" }]
  ],
  use: {
    baseURL,
    bypassCSP: true,
    launchOptions: chromiumExecutablePath
      ? {
          executablePath: chromiumExecutablePath
        }
      : undefined,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: videoMode
  },
  projects: [
    {
      name: "chromium-desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: {
          width: 1366,
          height: 900
        }
      }
    },
    {
      name: "chromium-mobile",
      use: {
        ...devices["Pixel 5"]
      }
    }
  ]
});
