import { defineConfig } from "rspress/config";
import * as path from "path";

export default defineConfig({
  // 文档根目录
  root: path.join(__dirname, "docs"),
  ssg: true,
  base: "/docs",
  outDir: path.join(__dirname, "public/docs"),
  themeConfig: {
    darkMode: false,
    search: false,
  },
});
