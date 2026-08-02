import { defineConfig } from "astro/config";

const deployEnvironment = process.env.PUBLIC_DEPLOY_ENV || "local";
const productionSiteUrl = "https://iocode-solutions.com";
const siteUrl = (
  process.env.PUBLIC_SITE_URL ||
  (deployEnvironment === "local" ? "http://localhost:4321" : productionSiteUrl)
).replace(/\/$/u, "");

if (deployEnvironment === "production") {
  const parsedSiteUrl = new URL(siteUrl);

  if (siteUrl !== productionSiteUrl || parsedSiteUrl.protocol !== "https:") {
    throw new Error(`PUBLIC_SITE_URL debe ser exactamente ${productionSiteUrl} en producción.`);
  }
}

export default defineConfig({
  site: siteUrl,
  output: "static",
  trailingSlash: "always",
  vite: {
    build: {
      chunkSizeWarningLimit: 1200
    }
  }
});
