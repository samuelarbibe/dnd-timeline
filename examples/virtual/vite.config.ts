import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["dnd-timeline"],
  },
  resolve: {
    alias: {
      react: path.resolve("./node_modules/react"),
    },
  },
});
