/* eslint-disable no-undef */
import fs from "fs-extra";
import path from "path";

export function getChangelogByVersion(version) {
  const changelog = fs.readFileSync(
    path.resolve(process.cwd(), "CHANGELOG.md"),
    { encoding: "utf8" }
  );

  // 创建正则表达式，匹配指定版本的标题和内容
  const regex = new RegExp(`## ${version}\\s+([\\s\\S]*?)(?=\\n## |\\Z)`, "s");

  // 执行匹配
  const match = changelog.match(regex);

  if (match) {
    // 提取标题和内容
    const title = match[0].split("\n")[0].trim();
    const content = match[1] ? match[1].trim() : "";

    return {
      title: title.replace("##", "").trim(),
      content: content,
    };
  }

  return null;
}
