---
title: 从本地源代码开始
sidebar_position: 3
---

## 先决条件

<Info>
在安装 Xpert 之前，请确保您的机器满足以下最低系统要求：

- CPU >= 2 核心
- RAM >= 4 GiB
</Info>

## 克隆 Xpert

```bash
git clone https://github.com/xpert-ai/xpert.git
cd xpert
```

### 启动基础设施

在启用业务服务之前，我们需要先部署 PostgreSQL / Redis（如果本地不可用）。我们可以使用以下命令启动它们：

```bash
cd docker
cp env.example .env
docker compose -f docker-compose.infra.yml up -d
```

### 启动 Milvus 服务

如果您需要使用 Milvus 进行知识库向量存储和检索，请
- 修改 `.env` 文件中的 `VECTOR_STORE` 配置项，将其设置为 `milvus`。
- 使用 `milvus` 配置文件启动 Docker 容器：

```bash
docker compose -f docker-compose.infra.yml --profile milvus up -d
```

## 启动服务器和Web应用

进入项目根目录：

- 安装 [NodeJs](https://nodejs.org/en/download) LTS 版本或更高版本，例如 20.x。
- 安装 [pnpm](https://pnpm.io/installation)（如果您还没有）使用命令 `npm i -g pnpm`。
- 使用命令 `pnpm bootstrap` 安装 NPM 包并引导解决方案。
- 将 [`env.local`](./env.local) 文件复制到 `.env` 并调整文件中的设置以用于本地运行。

- 分别使用 `pnpm start:api` 和 `pnpm start:cloud` 运行 API 和 UI 服务。
- 在浏览器中打开 XpertAI UI http://localhost:4200（API 运行在 http://localhost:3000/api）。
- [启动向导](../onboarding/)...
- 享受吧！

### 热重载

如果您希望在检测到目录中的文件更改时自动重启节点应用程序，请使用以下两个命令启动服务器：

- `pnpm start:api:dev`
- `pnpm start:cloud`

## 使用 OLAP 引擎

如果您想使用带有 OLAP 引擎的 Xpert 数据分析平台，请运行以下命令：

- 安装 Java 运行时和 Maven。
- `pnpm start:olap`
