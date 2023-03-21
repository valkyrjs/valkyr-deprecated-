import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import paths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      path: "path-browserify"
    }
  },
  plugins: [
    paths(),
    solid({
      hot: false
    })
  ]
});
