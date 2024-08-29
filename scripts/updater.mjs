/* eslint-disable no-undef */
import { getOctokit, context } from "@actions/github";
import fs from "fs";
import { getChangelogByVersion } from "./changelog.mjs";

const token = process.env.GITHUB_TOKEN;
const versionFilename = "latest.json";
async function updater() {
  if (!token) {
    console.log("GITHUB_TOKEN is required");
    process.exit(1);
  }

  const options = { owner: context.repo.owner, repo: context.repo.repo };

  // 用户名，仓库名
  const github = getOctokit(token);

  const { data: tags } = await github.rest.repos.listTags({
    ...options,
    per_page: 10,
    page: 1,
  });

  const tag = tags.find((t) => t.name.startsWith("v"));

  if (!tag) return;

  const { data: latestRelease } = await github.rest.repos.getReleaseByTag({
    ...options,
    tag: tag.name,
  });
  console.log(latestRelease);
  const asset = latestRelease.assets.find((e) => e.name === versionFilename);

  if (!asset) {
    return;
  }

  const assetData = (
    await github.request(
      "GET /repos/{owner}/{repo}/releases/assets/{asset_id}",
      {
        ...options,
        asset_id: asset.id,
        headers: {
          accept: "application/octet-stream",
        },
      }
    )
  ).data;

  const versionContent = JSON.parse(Buffer.from(assetData).toString());

  versionContent.nodes = getChangelogByVersion(tag.name).content;

  if (!fs.existsSync("updater")) {
    fs.mkdirSync("updater");
  }

  console.log("versionContent", versionContent);
  // 将数据写入文件
  fs.writeFileSync(
    "./updater/latest.json",
    JSON.stringify(versionContent, null, 2)
  );
  console.log("Generate updater/latest.json");
}

updater().catch(console.error);
