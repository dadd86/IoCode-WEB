import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://iocode-solutions.com",
  output: "static",
  trailingSlash: "always",
  vite: {
    build: {
      chunkSizeWarningLimit: 1200
    }
  }
});
