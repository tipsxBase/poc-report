import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { vitePluginForArco } from "@arco-plugins/vite-react";
import svgr from "vite-plugin-svgr";
import { resolve } from "path";
import mpa from "./plugins/mpa";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 9000,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  define: {
    "process.env": {},
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        doc: resolve(__dirname, "doc.html"),
      },
    },
  },
  plugins: [vitePluginForArco({}), mpa() as any, react(), svgr()],
});
