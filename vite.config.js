import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/p112/",      // repo name
  build: {
    outDir: "docs",    // build into /docs for GitHub Pages
  },
});
