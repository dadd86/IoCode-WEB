import { defineConfig, devices } from "@playwright/test";

/**
 * Propósito:
 * Configurar las pruebas end-to-end de escritorio, Android simulado y WebKit
 * con dimensiones de iPhone.
 *
 * Contexto:
 * Chrome en iOS utiliza WebKit. Por ello, el proyecto webkit-iphone es la
 * aproximación automatizada adecuada para detectar regresiones específicas
 * del motor que usa el dispositivo real.
 */
const baseURL =
  process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:8080";

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
    [
      "json",
      {
        outputFile: "qa-artifacts/playwright-results.json"
      }
    ],
    [
      "html",
      {
        outputFolder: "qa-artifacts/playwright-report",
        open: "never"
      }
    ]
  ],

  use: {
    baseURL,
    bypassCSP: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
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
    },
    {
      name: "webkit-iphone",
      use: {
        ...devices["iPhone 13"],
        browserName: "webkit"
      }
    },
    {
      name: "webkit-ipad",
      use: {
        ...devices["iPad Pro 11"],
        browserName: "webkit"
      }
    }
  ]
});