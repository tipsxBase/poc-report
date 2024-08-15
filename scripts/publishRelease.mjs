/* eslint-disable no-undef */

import { simpleGit } from "simple-git";
import fs from "fs-extra";
import path from "path";
import * as semver from "semver";

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

const tags = await git.tags();

let currentVersion = tauriJSON.package.version;
if (tags && tags.latest) {
  currentVersion = tags.latest;
}

const nextVersion = `v${semver.inc(currentVersion, "patch")}`;
console.log(nextVersion);

packageJSON.version = nextVersion;
tauriJSON.package.version = nextVersion;

fs.writeJSONSync(packageJSONPath, packageJSON, { spaces: 2 });
fs.writeJSONSync(tauriJSONPath, tauriJSON, { spaces: 2 });

// 提交到 develop
await git.add(".").commit(`feat: ${nextVersion}`).push("origin", "develop");

await git.checkout("main").merge(["develop"]).push("origin", "main");

await git.push("github", "main");
