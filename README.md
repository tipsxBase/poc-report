# POC 工具

## 功能

包括统计图表跟测试用例配置

## 开发

技术栈：Tauri + Vite + React

### 开发服务启动

```bash
cargo tauri dev
```

### 打包

```bash
cargo tauri build
```

### 代码仓库

本代码有两个仓库

1. codeup 公司内部代码提交
2. github 方便使用 github action 进行构建

### 使用 github action 构建

1. 将代码提交至 github

```
git push github main
```

2. 添加 tag

```
git tag v0.1
git push github v0.1
```
