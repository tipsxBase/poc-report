// vite.config.ts
import { defineConfig } from "file:///Users/zhaowencong/Documents/JavaProject/Poc/poc-report/node_modules/.pnpm/vite@5.2.8_@types+node@20.12.5_less@4.2.0/node_modules/vite/dist/node/index.js";
import react from "file:///Users/zhaowencong/Documents/JavaProject/Poc/poc-report/node_modules/.pnpm/@vitejs+plugin-react@4.2.1_vite@5.2.8/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { vitePluginForArco } from "file:///Users/zhaowencong/Documents/JavaProject/Poc/poc-report/node_modules/.pnpm/@arco-plugins+vite-react@1.3.3/node_modules/@arco-plugins/vite-react/lib/index.js";
import svgr from "file:///Users/zhaowencong/Documents/JavaProject/Poc/poc-report/node_modules/.pnpm/vite-plugin-svgr@4.2.0_typescript@5.4.4_vite@5.2.8/node_modules/vite-plugin-svgr/dist/index.js";
import { resolve } from "path";

// plugins/mpa/index.ts
import history from "file:///Users/zhaowencong/Documents/JavaProject/Poc/poc-report/node_modules/.pnpm/connect-history-api-fallback@2.0.0/node_modules/connect-history-api-fallback/lib/index.js";
import { globbySync } from "file:///Users/zhaowencong/Documents/JavaProject/Poc/poc-report/node_modules/.pnpm/globby@14.0.2/node_modules/globby/index.js";
import fs from "file:///Users/zhaowencong/Documents/JavaProject/Poc/poc-report/node_modules/.pnpm/fs-extra@11.2.0/node_modules/fs-extra/lib/index.js";

// plugins/mpa/matter.ts
import { matter } from "file:///Users/zhaowencong/Documents/JavaProject/Poc/poc-report/node_modules/.pnpm/vfile-matter@5.0.0/node_modules/vfile-matter/index.js";
import { VFile } from "file:///Users/zhaowencong/Documents/JavaProject/Poc/poc-report/node_modules/.pnpm/vfile@6.0.2/node_modules/vfile/index.js";
function getMatterFromMDX(source) {
  const sourceAsVirtualFile = new VFile(source);
  matter(sourceAsVirtualFile, { strip: true });
  return sourceAsVirtualFile.data.matter;
}

// plugins/mpa/index.ts
import { basename, extname } from "path";
async function map() {
  const virtualModuleId = "mpa-routes";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;
  const paths = globbySync(["src-tauri/resources/docs"], {
    cwd: process.cwd()
  });
  const menus = paths.map((path) => {
    const content = fs.readFileSync(path, { encoding: "utf8" });
    const matter2 = getMatterFromMDX(content);
    return {
      key: encodeURI(path.replace(`src-tauri/`, "").split("/").join("___")),
      title: basename(path).replace(extname(path), ""),
      ...matter2
    };
  });
  const menuMapping = menus.reduce((prev, current) => {
    prev[current.key] = current;
    return prev;
  }, {});
  return {
    name: "mpa",
    enforce: "pre",
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load: async (id) => {
      if (id === resolvedVirtualModuleId) {
        return `export const menus = ${JSON.stringify(menus)};

        const menuMapping = ${JSON.stringify(menuMapping)};
        export const getMeta = (pathKey) => {
          pathKey = encodeURI(pathKey);
          return menuMapping[pathKey] || {}
        }
        `;
      }
    },
    configureServer({ middlewares: app }) {
      app.use(
        history({
          verbose: Boolean(process.env.DEBUG) && process.env.DEBUG !== "false",
          disableDotRule: void 0,
          htmlAcceptHeaders: ["text/html", "application/xhtml+xml"],
          rewrites: [{ from: /\/doc/, to: "/doc.html" }]
        })
      );
    }
  };
}

// vite.config.ts
var __vite_injected_original_dirname = "/Users/zhaowencong/Documents/JavaProject/Poc/poc-report";
var vite_config_default = defineConfig({
  server: {
    port: 9e3
  },
  resolve: {
    alias: {
      "@": "/src"
    }
  },
  define: {
    "process.env": {}
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__vite_injected_original_dirname, "index.html"),
        doc: resolve(__vite_injected_original_dirname, "doc.html")
      }
    }
  },
  plugins: [vitePluginForArco({}), map(), react(), svgr()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGx1Z2lucy9tcGEvaW5kZXgudHMiLCAicGx1Z2lucy9tcGEvbWF0dGVyLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3poYW93ZW5jb25nL0RvY3VtZW50cy9KYXZhUHJvamVjdC9Qb2MvcG9jLXJlcG9ydFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3poYW93ZW5jb25nL0RvY3VtZW50cy9KYXZhUHJvamVjdC9Qb2MvcG9jLXJlcG9ydC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvemhhb3dlbmNvbmcvRG9jdW1lbnRzL0phdmFQcm9qZWN0L1BvYy9wb2MtcmVwb3J0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBQbHVnaW4gfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHsgdml0ZVBsdWdpbkZvckFyY28gfSBmcm9tIFwiQGFyY28tcGx1Z2lucy92aXRlLXJlYWN0XCI7XG5pbXBvcnQgc3ZnciBmcm9tIFwidml0ZS1wbHVnaW4tc3ZnclwiO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgbXBhIGZyb20gXCIuL3BsdWdpbnMvbXBhXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiA5MDAwLFxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBcIi9zcmNcIixcbiAgICB9LFxuICB9LFxuICBkZWZpbmU6IHtcbiAgICBcInByb2Nlc3MuZW52XCI6IHt9LFxuICB9LFxuICBidWlsZDoge1xuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGlucHV0OiB7XG4gICAgICAgIG1haW46IHJlc29sdmUoX19kaXJuYW1lLCBcImluZGV4Lmh0bWxcIiksXG4gICAgICAgIGRvYzogcmVzb2x2ZShfX2Rpcm5hbWUsIFwiZG9jLmh0bWxcIiksXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFt2aXRlUGx1Z2luRm9yQXJjbyh7fSksIG1wYSgpIGFzIGFueSwgcmVhY3QoKSwgc3ZncigpXSxcbn0pO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvemhhb3dlbmNvbmcvRG9jdW1lbnRzL0phdmFQcm9qZWN0L1BvYy9wb2MtcmVwb3J0L3BsdWdpbnMvbXBhXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvemhhb3dlbmNvbmcvRG9jdW1lbnRzL0phdmFQcm9qZWN0L1BvYy9wb2MtcmVwb3J0L3BsdWdpbnMvbXBhL2luZGV4LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy96aGFvd2VuY29uZy9Eb2N1bWVudHMvSmF2YVByb2plY3QvUG9jL3BvYy1yZXBvcnQvcGx1Z2lucy9tcGEvaW5kZXgudHNcIjsvKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdmFyLXJlcXVpcmVzICovXG5pbXBvcnQgaGlzdG9yeSBmcm9tIFwiY29ubmVjdC1oaXN0b3J5LWFwaS1mYWxsYmFja1wiO1xuaW1wb3J0IHsgZ2xvYmJ5U3luYyB9IGZyb20gXCJnbG9iYnlcIjtcbmltcG9ydCBmcyBmcm9tIFwiZnMtZXh0cmFcIjtcbmltcG9ydCB7IGdldE1hdHRlckZyb21NRFggfSBmcm9tIFwiLi9tYXR0ZXJcIjtcbmltcG9ydCB7IGJhc2VuYW1lLCBleHRuYW1lIH0gZnJvbSBcInBhdGhcIjtcbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIG1hcCgpIHtcbiAgY29uc3QgdmlydHVhbE1vZHVsZUlkID0gXCJtcGEtcm91dGVzXCI7XG4gIGNvbnN0IHJlc29sdmVkVmlydHVhbE1vZHVsZUlkID0gXCJcXDBcIiArIHZpcnR1YWxNb2R1bGVJZDtcblxuICBjb25zdCBwYXRocyA9IGdsb2JieVN5bmMoW1wic3JjLXRhdXJpL3Jlc291cmNlcy9kb2NzXCJdLCB7XG4gICAgY3dkOiBwcm9jZXNzLmN3ZCgpLFxuICB9KTtcblxuICBjb25zdCBtZW51cyA9IHBhdGhzLm1hcCgocGF0aCkgPT4ge1xuICAgIGNvbnN0IGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMocGF0aCwgeyBlbmNvZGluZzogXCJ1dGY4XCIgfSk7XG4gICAgY29uc3QgbWF0dGVyID0gZ2V0TWF0dGVyRnJvbU1EWChjb250ZW50KSBhcyBhbnk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGtleTogZW5jb2RlVVJJKHBhdGgucmVwbGFjZShgc3JjLXRhdXJpL2AsIFwiXCIpLnNwbGl0KFwiL1wiKS5qb2luKFwiX19fXCIpKSxcbiAgICAgIHRpdGxlOiBiYXNlbmFtZShwYXRoKS5yZXBsYWNlKGV4dG5hbWUocGF0aCksIFwiXCIpLFxuICAgICAgLi4ubWF0dGVyLFxuICAgIH07XG4gIH0pO1xuXG4gIGNvbnN0IG1lbnVNYXBwaW5nID0gbWVudXMucmVkdWNlKChwcmV2LCBjdXJyZW50KSA9PiB7XG4gICAgcHJldltjdXJyZW50LmtleV0gPSBjdXJyZW50O1xuICAgIHJldHVybiBwcmV2O1xuICB9LCB7fSk7XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBcIm1wYVwiLFxuICAgIGVuZm9yY2U6IFwicHJlXCIsXG4gICAgcmVzb2x2ZUlkKGlkOiBzdHJpbmcpIHtcbiAgICAgIGlmIChpZCA9PT0gdmlydHVhbE1vZHVsZUlkKSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlZFZpcnR1YWxNb2R1bGVJZDtcbiAgICAgIH1cbiAgICB9LFxuICAgIGxvYWQ6IGFzeW5jIChpZDogc3RyaW5nKSA9PiB7XG4gICAgICBpZiAoaWQgPT09IHJlc29sdmVkVmlydHVhbE1vZHVsZUlkKSB7XG4gICAgICAgIHJldHVybiBgZXhwb3J0IGNvbnN0IG1lbnVzID0gJHtKU09OLnN0cmluZ2lmeShtZW51cyl9O1xuXG4gICAgICAgIGNvbnN0IG1lbnVNYXBwaW5nID0gJHtKU09OLnN0cmluZ2lmeShtZW51TWFwcGluZyl9O1xuICAgICAgICBleHBvcnQgY29uc3QgZ2V0TWV0YSA9IChwYXRoS2V5KSA9PiB7XG4gICAgICAgICAgcGF0aEtleSA9IGVuY29kZVVSSShwYXRoS2V5KTtcbiAgICAgICAgICByZXR1cm4gbWVudU1hcHBpbmdbcGF0aEtleV0gfHwge31cbiAgICAgICAgfVxuICAgICAgICBgO1xuICAgICAgfVxuICAgIH0sXG4gICAgY29uZmlndXJlU2VydmVyKHsgbWlkZGxld2FyZXM6IGFwcCB9OiBhbnkpIHtcbiAgICAgIGFwcC51c2UoXG4gICAgICAgIGhpc3Rvcnkoe1xuICAgICAgICAgIHZlcmJvc2U6IEJvb2xlYW4ocHJvY2Vzcy5lbnYuREVCVUcpICYmIHByb2Nlc3MuZW52LkRFQlVHICE9PSBcImZhbHNlXCIsXG4gICAgICAgICAgZGlzYWJsZURvdFJ1bGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICBodG1sQWNjZXB0SGVhZGVyczogW1widGV4dC9odG1sXCIsIFwiYXBwbGljYXRpb24veGh0bWwreG1sXCJdLFxuICAgICAgICAgIHJld3JpdGVzOiBbeyBmcm9tOiAvXFwvZG9jLywgdG86IFwiL2RvYy5odG1sXCIgfV0sXG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH0sXG4gIH07XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy96aGFvd2VuY29uZy9Eb2N1bWVudHMvSmF2YVByb2plY3QvUG9jL3BvYy1yZXBvcnQvcGx1Z2lucy9tcGFcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy96aGFvd2VuY29uZy9Eb2N1bWVudHMvSmF2YVByb2plY3QvUG9jL3BvYy1yZXBvcnQvcGx1Z2lucy9tcGEvbWF0dGVyLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy96aGFvd2VuY29uZy9Eb2N1bWVudHMvSmF2YVByb2plY3QvUG9jL3BvYy1yZXBvcnQvcGx1Z2lucy9tcGEvbWF0dGVyLnRzXCI7aW1wb3J0IHsgbWF0dGVyIH0gZnJvbSBcInZmaWxlLW1hdHRlclwiO1xuaW1wb3J0IHsgVkZpbGUgfSBmcm9tIFwidmZpbGVcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdHRlckZyb21NRFgoc291cmNlOiBzdHJpbmcpIHtcbiAgY29uc3Qgc291cmNlQXNWaXJ0dWFsRmlsZSA9IG5ldyBWRmlsZShzb3VyY2UpO1xuICBtYXR0ZXIoc291cmNlQXNWaXJ0dWFsRmlsZSwgeyBzdHJpcDogdHJ1ZSB9KTtcbiAgcmV0dXJuIHNvdXJjZUFzVmlydHVhbEZpbGUuZGF0YS5tYXR0ZXI7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVWLFNBQVMsb0JBQTRCO0FBQzVYLE9BQU8sV0FBVztBQUNsQixTQUFTLHlCQUF5QjtBQUNsQyxPQUFPLFVBQVU7QUFDakIsU0FBUyxlQUFlOzs7QUNIeEIsT0FBTyxhQUFhO0FBQ3BCLFNBQVMsa0JBQWtCO0FBQzNCLE9BQU8sUUFBUTs7O0FDSGtXLFNBQVMsY0FBYztBQUN4WSxTQUFTLGFBQWE7QUFFZixTQUFTLGlCQUFpQixRQUFnQjtBQUMvQyxRQUFNLHNCQUFzQixJQUFJLE1BQU0sTUFBTTtBQUM1QyxTQUFPLHFCQUFxQixFQUFFLE9BQU8sS0FBSyxDQUFDO0FBQzNDLFNBQU8sb0JBQW9CLEtBQUs7QUFDbEM7OztBREZBLFNBQVMsVUFBVSxlQUFlO0FBQ2xD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
