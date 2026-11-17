import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so the build works at any path, including GitHub Pages project sites.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
