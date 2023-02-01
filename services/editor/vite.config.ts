import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import monaco from "vite-plugin-monaco-editor";
import paths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000
  },
  plugins: [paths(), react(), monaco({ languageWorkers: ["typescript", "json"] })]
});
