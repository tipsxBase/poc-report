/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module "mpa-routes" {
  export const menus: Record<string, any>[];
  export const getMeta: (pathKey: string) => Record<string, any>;
}

declare module "react-syntax-highlighter/dist/esm/languages/prism/supported-languages";
