/* eslint-disable @typescript-eslint/no-var-requires */
import history from "connect-history-api-fallback";
import { globbySync } from "globby";
import fs from "fs-extra";
import { getMatterFromMDX } from "./matter";
export default async function map() {
  const virtualModuleId = "mpa-routes";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  const paths = globbySync(["src-tauri/resources/docs"], {
    cwd: process.cwd(),
  });
  const menus = paths.map((path) => {
    const content = fs.readFileSync(path, { encoding: "utf8" });
    const matter = getMatterFromMDX(content) as any;
    return {
      key: path.replace(`src-tauri/`, "").split("/").join("___"),
      ...matter,
    };
  });

  return {
    name: "mpa",
    enforce: "pre",
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load: async (id: string) => {
      if (id === resolvedVirtualModuleId) {
        return `export const menus = ${JSON.stringify(menus)};
        `;
      }
    },
    configureServer({ middlewares: app }: any) {
      app.use(
        history({
          verbose: Boolean(process.env.DEBUG) && process.env.DEBUG !== "false",
          disableDotRule: undefined,
          htmlAcceptHeaders: ["text/html", "application/xhtml+xml"],
          rewrites: [{ from: /\/doc/, to: "/doc.html" }],
        })
      );
    },
  };
}
