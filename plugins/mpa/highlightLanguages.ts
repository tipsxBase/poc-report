/* eslint-disable @typescript-eslint/no-var-requires */

export const DEFAULT_HIGHLIGHT_LANGUAGES = [
  ["js", "javascript"],
  ["ts", "typescript"],
  ["jsx", "tsx"],
  ["xml", "xml-doc"],
  ["md", "markdown"],
  ["mdx", "tsx"],
];

let supportedLanguages: Set<string>;

export function handleHighlightLanguages(
  highlightLanguages: Set<string>
): Record<string, string[]> {
  // Automatically import prism languages
  const aliases: Record<string, string[]> = {};
  if (highlightLanguages.size) {
    if (!supportedLanguages) {
      const langs =
        require("react-syntax-highlighter/dist/cjs/languages/prism/supported-languages").default;
      supportedLanguages = new Set(langs);
    }

    const names: Record<string, string> = {};
    [...DEFAULT_HIGHLIGHT_LANGUAGES].forEach((lang) => {
      if (Array.isArray(lang)) {
        const [alias, name] = lang;
        names[alias] = name;
      }
    });

    [...highlightLanguages.values()].forEach((lang) => {
      const name = names[lang];
      if (name && supportedLanguages.has(name)) {
        const temp = aliases[name] || (aliases[name] = []);
        if (!temp.includes(lang)) {
          temp.push(lang);
        }

        highlightLanguages.add(name);
        highlightLanguages.delete(lang);
        return;
      }

      if (!supportedLanguages.has(lang)) {
        highlightLanguages.delete(lang);
      }
    });
  }

  return aliases;
}
