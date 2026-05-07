---
title: 使用 Docker Compose 部署
sidebar_position: 1
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

## 启动 Xpert

1. 进入 Xpert 源代码中的 Docker 目录

```bash
cd docker
```

2. 复制环境配置文件

```bash
cp env.example .env
```

3. 启动 Docker 容器

```bash
docker compose up -d
```

执行命令后，您应该会看到类似以下的输出，显示所有容器的状态和端口映射：

```bash
 ✔ Network xpert-ai_default         Created                  0.0s 
 ✔ Container xpert-ai-db-1          Started                  0.0s 
 ✔ Container xpert-ai-redis-1       Started                  0.0s 
 ✔ Container xpert-ai-api-1         Started                  0.0s 
 ✔ Container xpert-ai-webapp-1      Started                  0.0s
```

最后，检查所有容器是否成功运行：

```bash
docker compose ps
```

这包括两个核心服务：api / webapp，以及两个依赖组件：db / redis。

```bash
NAME                IMAGE                                       COMMAND                  SERVICE   CREATED         STATUS                   PORTS
xpert-ai-api-1      ghcr.io/xpert-ai/xpert-api:latest           "docker-entrypoint.s…"   api       4 minutes ago   Up 4 minutes             0.0.0.0:3000->3000/tcp
xpert-ai-db-1       pgvector/pgvector:pg12                      "docker-entrypoint.s…"   db        4 minutes ago   Up 4 minutes (healthy)   5432/tcp
xpert-ai-redis-1    redis/redis-stack:latest                    "sh -c 'redis-server…"   redis     4 minutes ago   Up 4 minutes             6379/tcp, 8001/tcp
xpert-ai-webapp-1   ghcr.io/xpert-ai/xpert-webapp:latest        "./entrypoint.compos…"   webapp    4 minutes ago   Up 4 minutes             0.0.0.0:80->80/tcp, 443/tcp
```

### 启用 BI 服务

如果您需要启用多维建模功能进行数据分析，请使用 `bi` 配置文件启动 Docker 容器

```bash
docker compose --profile bi up -d
```

### 启动 Milvus 服务

如果您需要使用 Milvus 进行知识库向量存储和检索，请
- 修改 `.env` 文件中的 `VECTOR_STORE` 配置项，将其设置为 `milvus`。并配置 Milvus 账号 `MILVUS_USER` 和 `MILVUS_PASSWORD`。
- 使用 `milvus` 配置文件启动 Docker 容器：

```bash
docker compose --profile milvus up -d
```

### 启动 Crawl4AI 服务

如果您需要使用 [Crawl4AI](/docs/ai/tool/mcp/crawl4ai) 进行网页数据抓取，请在执行 docker compose 命令时添加 `crawl4ai` 配置：

```bash
docker compose --profile crawl4ai up -d
```

## 访问 Xpert AI

访问 [初始化页面](../onboarding/) 以设置管理员账户和租户：

```bash
# Local environment
http://localhost/

# Server environment
http://your_server_ip/
```

将 `.env` 文件中的基础 URL 更改为服务器地址，当您在服务器环境中部署 Xpert AI 时。

```ini
API_BASE_URL=//your_server_ip:3000
CLIENT_BASE_URL=//your_server_ip
```

## 自定义配置

直接编辑 `.env` 文件中的环境变量值。然后，重启 Xpert：

```bash
docker compose down
docker compose up -d
```

## 升级

进入 xpert 源代码的 docker 目录并执行以下命令：

```bash
cd xpert/docker
docker compose down
git pull origin main
docker compose pull
docker compose up -d
```

### 同步环境变量配置（重要）

- 如果 `env.example` 文件已更新，请务必相应地修改您的本地 `.env` 文件。
- 检查并根据需要修改 `.env` 文件中的配置项，以确保它们与您的实际环境匹配。您可能需要将 `env.example` 中的任何新变量添加到您的 `.env` 文件中，并更新任何已更改的值。

## 阅读更多

如果您有任何问题，请参阅[常见问题](./faqs/)。
