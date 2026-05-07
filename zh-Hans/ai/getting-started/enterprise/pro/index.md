---
title: 专业版
sidebar_position: 3
---

专业版功能：

## 如何访问专业版镜像

在开始之前您会从我们组织拿到相应的 `<YOUR_GITHUB_PAT>` 访问密钥。

1. 在运行 docker 的服务器上登录 GitHub cr 仓库：

`echo "<YOUR_GITHUB_PAT>" | docker login ghcr.io -u <YOUR_GITHUB_USERNAME> --password-stdin`

2. 拉取 pro 版镜像：

```bash
docker pull ghcr.io/xpert-ai/xpert-pro-sandbox:latest
docker pull ghcr.io/xpert-ai/xpert-pro-webapp:latest
docker pull ghcr.io/xpert-ai/xpert-pro-api:latest
docker pull ghcr.io/xpert-ai/xpert-pro-olap:latest
```

3. 可以正常启动服务容器

### 环境变量配置

```bash
SANDBOX_NETWORK=bridge
SANDBOX_IMAGE=ghcr.io/xpert-ai/xpert-pro-sandbox:latest
# SANDBOX_HOST=localhost
# SANDBOX_PORT=8000
SANDBOX_VOLUME=/mnt/sandbox
SANDBOX_EXPIRED=60
SANDBOX_MEMORY=2048
# SANDBOX_CPUSHARES=512
SANDBOX_SHMSIZE=1024
```

## 本地开发
