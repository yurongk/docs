---
title: 部署 Docker 集群
sidebar_position: 1
---

## 背景说明

本篇将简述如何通过 docker run 或 docker-compose up 命令快速构建一套完整的XpertAI集群。

## 适用场景

建议在 SIT 或者 DEV 环境中使用XpertAI Docker 容器来简化部署的流程。

## 软件环境

| 软件           | 版本        |
| -------------- | ----------- |
| Docker         | 20.0 及以上 |
| docker-compose | 2.10 及以上 |

## 标准版部署

请下载我们提供的安装脚本

```bash
git clone https://github.com/meta-d/installer.git
```

然后在 docker 目录下，首先配置环境变量文件 `.env`

```bash
cd installer/docker
cp env.tmpl .env
```

- 将 **INSTALLATION_MODE** 值设置为 **standalone**
- 其他密码字段可重新设置

最后执行以下命令启动服务：
```bash
docker-compose -f docker-compose.yml up -d
```

服务启动完成后访问 [http://localhost/](http://localhost/) （或者 http://your.ip/ 或 http://your.domain/ ）即可看到XpertAI的 [系统初始化向导](../onboarding/) 页面。

<Tip>
**域名**


如果系统部署在服务器（非 localhost ）上时，请修改 `.env` 文件中环境变量 `API_BASE_URL` 中的 localhost 为服务器的域名或者 IP 地址。例如：

`http://localhost:3000` → `http://[your-domain-or-ip]:3000`

</Tip>

## 详细配置

### Docker Compose 网络模式说明

XpertAI部署 Docker 适用的网络模式有两种:

1. 适合跨多节点部署的 **HOST 模式**，这种模式适合将不同服务部署到多个节点服务器上。
2. 适合单节点部署多服务进程的 **子网网桥模式**，这种模式适合单节点部署多种服务的情况。

为便于展示，本章节仅演示子网网桥模式编写的脚本。

### Docker Compose 脚本

部署XpertAI需要 5 个基本的服务，在文件 `docker-compose.yml` 中定义了这些服务容器：
1. db: 数据库服务, 使用 postgres 数据库
2. redis: 服务端缓存服务, 使用 redis 数据库
3. olap: OLAP 引擎服务, 使用 metad-olap 镜像
4. api: 后端服务, 使用 ocap-api 镜像
5. webapp: 前端服务, 使用 ocap-webapp 镜像

### 环境变量说明
