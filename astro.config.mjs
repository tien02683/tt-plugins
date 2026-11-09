import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://tt-plugins.pages.dev",
  output: "static",
  build: {
    format: "directory"
  }
});
