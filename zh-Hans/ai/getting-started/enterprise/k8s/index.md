---
title: Kubernetes 部署
sidebar_position: 2
---

## 环境准备

- 准备 k8s 环境
- 下载部署配置 `git clone https://github.com/meta-d/installer.git`

<Tip>
以下演示以 `dev` 命名空间为例，用户可以根据实际情况修改命名空间。
</Tip>

## 部署

转到 k8s 部署文件夹

```bash
cd installer/k8s
```

### 1. 创建密钥

首先需要单独创建一个 `Secret` 来存储敏感信息，如数据库密码、JWT 密钥等。

```bash
kubectl create -f secret.yaml -n dev
```

#### 密钥配置（可选）

用户可以自行修改这些密钥，步骤如下

- 对密码进行 base64 编码

`echo -n '<Password>' | base64`

<Tip>

解码 `echo '<EncodedPassword>' | base64 --decode`

</Tip>

- 然后写入到文件 *secret.yaml* 的 `Secret` 配置中

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: ocap-secrets
type: Opaque
data:
  DB_PASS: UG9zdGdyZXNQYXNzd29yZCExMjM=
```

必输的密码有以下

| 名称               | 说明         |
| ------------------ | ------------ |
| DB_PASS            | 数据库密码   |
| SESSION_SECRET     | Session 密钥 |
| JWT_SECRET         | JWT 密钥     |
| JWT_REFRESH_SECRET | JWT 刷新密钥 |
| REDIS_PASSWORD     | Redis 密码   |

更多密钥配置请参考 k8s 配置文件模版中的 Secret 部分。

### 2. 创建或更新配置

首次创建或更新配置，都可以执行此命令：

```bash
kubectl apply -f manifest.yaml -n dev
```

#### 域名配置

XpertAI默认配置了 `localhost` 作为域名，如果需要使用自定义域名或服务器 IP 地址访问，请修改 ConfigMap `config-data` 中如下配置：

```yaml
...
  API_BASE_URL: "//api.demo.com"
  CLIENT_BASE_URL: "//app.demo.com"
```

- `API_BASE_URL` 为 API 服务（ocap-api-lb）的地址
- `CLIENT_BASE_URL` 为前端服务（ocap-webapp-lb）的地址

<Tip>
**注意**

可以使用命令 `kubectl get services -n dev` 查询服务负载均衡的地址（或查询依赖于具体平台的配置）。
</Tip>

也可以使用同一域名不同端口号，如下配置：

```yaml
...
  API_BASE_URL: "//app.demo.com:3000"
  CLIENT_BASE_URL: "//app.demo.com"
```

<Tip>
**注意**

如果还没有设置域名，这里的域名可以使用相应的 IP 地址代替。
</Tip>

### 3. 访问网站

所有服务启动完成后便可以通过域名 (如：http://app.demo.com) 访问网站，然后进行[系统设置向导](../onboarding/)。

## 持久卷

对于不同的 k8s 平台可能需要配置不同的持久卷（Persistent Volume），请根据实际情况修改 `manifest.yaml` 文件中的 `PersistentVolume` 和 `PersistentVolumeClaim` 部分。

## Ingress

如果需要使用 Ingress 进行外部访问和负载均衡，需要将类型为 `LoadBalancer` 的服务类型该为 `ClusterIP`，并且配置 Ingress。

## k8s简易操作命令

* 首次执行yml文件 `kubectl create -f xxx.yml`
* 修改yml文件后执行 `kubectl apply -f xxx.yml`
* 删除yml定义的所有资源 `kubectl delete -f xxx.yml`
* 查看pod列表 `kubectl get pods`
* 进入容器 `kubectl exec -it xxx（podName） -- /bin/sh`
* 查看日志 `kubectl logs xxx(podName)`
* 查看ip和端口信息 `kubectl get ep`
* [更多k8s知识](https://kubernetes.io/)
