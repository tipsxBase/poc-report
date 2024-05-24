import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vitePluginForArco } from "@arco-plugins/vite-react";
import svgr from "vite-plugin-svgr";

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
  plugins: [vitePluginForArco({}), react(), svgr()],
});
