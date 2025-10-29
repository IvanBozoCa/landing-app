import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/app-conductor": {
        target: "https://demo-movilapp-conductor.onrender.com",
        changeOrigin: true,
        secure: true,
        // sirve el index.html y assets como si fueran locales
        rewrite: (path) => path.replace(/^\/app-conductor/, ""),
      },
      "/app-apoderado": {
        target: "https://demo-movilapp.onrender.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/app-apoderado/, ""),
      },
    },
  },
});
