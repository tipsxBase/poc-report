/* eslint-disable @typescript-eslint/no-var-requires */
import history from "connect-history-api-fallback";
import { globbySync } from "globby";
import fs from "fs-extra";
import { getMatterFromMDX } from "./matter";
import { basename, extname } from "path";
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
      key: encodeURI(path.replace(`src-tauri/`, "").split("/").join("___")),
      title: basename(path).replace(extname(path), ""),
      ...matter,
    };
  });

  const menuMapping = menus.reduce((prev, current) => {
    prev[current.key] = current;
    return prev;
  }, {});

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

        const menuMapping = ${JSON.stringify(menuMapping)};
        export const getMeta = (pathKey) => {
          pathKey = encodeURI(pathKey);
          return menuMapping[pathKey] || {}
        }
        `;
      }
    },
    configureServer({ middlewares: app }: any) {
      app.use(
        history({
          verbose: Boolean(process.env.NODE_ENV === "development"),
          disableDotRule: undefined,
          htmlAcceptHeaders: ["text/html", "application/xhtml+xml"],
          rewrites: [
            // { from: /\/docs\/(.*$)/, to: "/docs/$1" },
            // { from: /\/doc/, to: "/doc.html" },
          ],
        })
      );
    },
  };
}
