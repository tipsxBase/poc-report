import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import transformMetric from "./plugin/transformMetric";
// import path from "path";
import { vitePluginForArco } from "@arco-plugins/vite-react";

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
  plugins: [
    vitePluginForArco({}),
    // transformMetric({
    //   options: [
    //     {
    //       file: path.join(
    //         __dirname,
    //         "plugin/cases/5.1.1.5_sample/20240508143152/snapshot.json"
    //       ),
    //       usage: "snapshot",
    //     },
    //     {
    //       file: path.join(
    //         __dirname,
    //         "plugin/cases/5.1.1.5_sample/20240508143152/metricSnapshot_case-1.json"
    //       ),
    //       usage: "metric",
    //     },
    //     {
    //       file: path.join(
    //         __dirname,
    //         "plugin/cases/5.1.1.5_sample/20240508143152/statics_case-1.json"
    //       ),
    //       usage: "statics",
    //     },
    //   ],
    // }),
    react(),
  ],
});
