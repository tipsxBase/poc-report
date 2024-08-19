/* eslint-disable no-undef */

import { simpleGit } from "simple-git";
import fs from "fs-extra";
import path from "path";
import * as semver from "semver";
import { getChangelogByVersion } from "./changelog.mjs";
import minimist from "minimist";

const git = simpleGit({
  baseDir: process.cwd(),
  binary: "git",
});

let localBranch = await git.branchLocal();

if (localBranch.current !== "develop") {
  console.error("需要 develop 分支上执行此命令，将自动切换到 develop 分支");
  await git.checkout(["develop"]);
}

const packageJSONPath = path.resolve(process.cwd(), "package.json");

const packageJSON = fs.readJSONSync(packageJSONPath);

const tauriJSONPath = path.resolve(process.cwd(), "src-tauri/tauri.conf.json");

const tauriJSON = fs.readJSONSync(tauriJSONPath);

const argv = minimist(process.argv.slice(2));

let currentVersion = tauriJSON.package.version;
let nextVersion = `${semver.inc(currentVersion, "patch")}`;
if (argv && argv.tag) {
  nextVersion = semver.parse(argv.tag);
} else {
  const tags = await git.tags();

  if (tags && tags.latest) {
    currentVersion = tags.latest;
    nextVersion = `${semver.inc(currentVersion, "patch")}`;
  }
}

console.log("VERSION", nextVersion);

const nextTag = `v${nextVersion}`;

const changelog = getChangelogByVersion(nextTag);

if (!changelog) {
  throw new Error("请先完善 changelog");
}

packageJSON.version = nextVersion;
tauriJSON.package.version = nextVersion;

fs.writeJSONSync(packageJSONPath, packageJSON, { spaces: 2 });
fs.writeJSONSync(tauriJSONPath, tauriJSON, { spaces: 2 });

const commit = `feat: ${nextTag}
${changelog.content}`;

// 提交到 develop
await git.add(".").commit(commit).push("origin", "develop");

await git.checkout("main").merge(["develop"]).push("origin", "main");

await git.push("github", "main");

await git.tag([nextTag]);
await git.pushTags("github", [nextTag]);
