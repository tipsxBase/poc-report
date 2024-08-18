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

  // 用户名，仓库名
  const options = { owner: context.repo.owner, repo: context.repo.repo };
  const github = getOctokit(token);

  // 获取 tag
  const { data: tags } = await github.rest.repos.listTags({
    ...options,
    per_page: 10,
    page: 1,
  });

  github.request({
    method: "get",
  });

  // 过滤包含 `v` 版本信息的 tag
  // const tag = tags.find((t) => t.name.startsWith("v"));

  // if (!tag) return;

  const tag = {
    name: "v0.2.17",
  };

  // 获取此 tag 的详细信息
  const { data: latestRelease } = await github.rest.repos.getReleaseByTag({
    ...options,
    tag: tag.name,
  });

  // 需要生成的静态 json 文件数据，根据自己的需要进行调整
  const updateData = {
    version: tag.name,
    // 使用 UPDATE_LOG.md，如果不需要版本更新日志，则将此字段置空
    notes: getChangelogByVersion(tag.name).content,
    pub_date: new Date().toISOString(),
    platforms: {
      win64: { signature: "", url: "" }, // compatible with older formats
      darwin: { signature: "", url: "" }, // compatible with older formats
      "darwin-aarch64": { signature: "", url: "" },
      "darwin-x86_64": { signature: "", url: "" },
      "windows-x86_64": { signature: "", url: "" },
    },
  };

  // const setAsset = async (asset, reg, platforms) => {
  //   console.log("asset", asset.name, platforms);
  //   let sig = "";
  //   if (/.sig$/.test(asset.name)) {
  //     console.log("before getSignature");
  //     sig = await getSignature(asset.browser_download_url);
  //     console.log("after getSignature", sig);
  //     // getSignatureTest(asset.browser_download_url);
  //   }
  //   platforms.forEach((platform) => {
  //     console.log(asset.name, platform, reg.test(asset.name));

  //     if (reg.test(asset.name)) {
  //       // 设置平台签名，检测应用更新需要验证签名
  //       if (sig) {
  //         updateData.platforms[platform].signature = sig;
  //         return;
  //       }
  //       // 设置下载链接
  //       console.log(asset.browser_download_url, asset.name);
  //       updateData.platforms[platform].url = asset.browser_download_url;
  //     }
  //   });
  // };

  const signatureAsset = latestRelease.assets.find((e) => /.sig$/.test(e.name));

  console.log("signatureAsset", signatureAsset);

  const signatureAssetResponse = await github.request(
    "GET /repos/{owner}/{repo}/releases/assets/{asset_id}",
    {
      owner: context.repo.owner,
      repo: context.repo.repo,
      asset_id: signatureAsset.id,
      headers: {
        accept: "application/octet-stream",
      },
    }
  );

  console.log("signatureAssetResponse", signatureAssetResponse);
  if (signatureAssetResponse) {
    console.log(
      "signatureAssetData",
      Buffer.from(signatureAssetResponse.data).toString()
    );
  }

  const asset = latestRelease.assets.find((e) => e.name === versionFilename);

  console.log("asset", asset);
  const assetData = await github.request(
    "GET /repos/{owner}/{repo}/releases/assets/{asset_id}",
    {
      owner: context.repo.owner,
      repo: context.repo.repo,
      asset_id: asset.id,
      headers: {
        accept: "application/octet-stream",
      },
    }
  ).data;

  console.log(versionFilename, JSON.parse(Buffer.from(assetData).toString()));

  // if (!fs.existsSync("updater")) {
  //   fs.mkdirSync("updater");
  // }

  // // 将数据写入文件
  // fs.writeFileSync(
  //   "./updater/install.json",
  //   JSON.stringify(updateData, null, 2)
  // );
  // console.log("Generate updater/install.json");
}

updater().catch(console.error);

// 获取签名内容
// async function getSignature(url) {
//   try {
//     console.log("getSignature", url);
//     const response = await fetch(url, {
//       method: "GET",
//       headers: { "Content-Type": "application/octet-stream" },
//     });
//     return response.text();
//   } catch (err) {
//     console.log("err", err);
//     return "";
//   }
// }
