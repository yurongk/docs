---
title: 环境变量说明
sidebar_position: 9
---

可以通过环境变量对系统各项参数进行控制。社区版 Docker 部署以 `docker/.env.example` 为参考；如果已经进入 `docker/` 目录，执行 `cp .env.example .env` 并按需修改即可。

部分参数说明如下：

| 环境变量          | 说明                                                                                                        |
| ----------------- | ----------------------------------------------------------------------------------------------------------- |
| API_BASE_URL      | API 服务地址（需修改）                                                                                      |
| CLIENT_BASE_URL   | Web 客户端基础地址（服务端部署时建议一并修改）                                                              |
| WEB_PORT          | 网站端口号                                                                                                  |
| DB_NAME           | 数据库名称                                                                                                  |
| DB_USER           | 数据库用户名                                                                                                |
| DB_PASS           | 数据库密码                                                                                                  |
| DB_PORT           | 数据库端口                                                                                                  |
| DB_HOST           | 数据库地址                                                                                                  |
| REDIS_PASSWORD    | 缓存服务密码                                                                                                |
| NODE_ENV          | 运行环境: `development` or `production`                                                                     |
| LOG_LEVEL         | 日志级别                                                                                                    |
| DEFAULT_LATITUDE  | 默认纬度                                                                                                    |
| DEFAULT_LONGITUDE | 默认经度                                                                                                    |
| DEFAULT_CURRENCY  | 默认货币                                                                                                    |
| DEMO              | 演示系统                                                                                                    |

## 组织初始化与模板

以下变量主要在“创建新组织”时生效，用于初始化组织默认工作区、分析模型和模板 xpert：

| 环境变量 | 作用 | 如何配置 |
| ------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| ORG_DEFAULT_XPERT_TEMPLATE_KEYS | 在新组织创建后，自动把指定模板导入该组织的默认工作区 | 填写模板 ID，多个值使用英文逗号分隔；留空表示不自动导入 |
| ORG_ANALYTICS_BOOTSTRAP_MODE | 控制新组织的 analytics 初始化模式 | 支持 `semantic-only` 或 `full-demo`；未设置或填写其他值时会回退到 `semantic-only` |
| XPERT_TEMPLATE_DIR | 指定外部 xpert 模板目录 | 建议配置为持久化目录；首次启动时系统会把缺失的基线模板文件补齐到该目录 |

示例配置：

```ini
ORG_DEFAULT_XPERT_TEMPLATE_KEYS=af7133cb-32b3-47ff-90c1-b144c4d4887e,af7133cb-32b3-47ff-90c1-b144c4d48872
ORG_ANALYTICS_BOOTSTRAP_MODE=semantic-only
XPERT_TEMPLATE_DIR=/var/lib/xpert/data/xpert-template
```

补充说明：

- `ORG_DEFAULT_XPERT_TEMPLATE_KEYS` 使用模板 ID，而不是模板名称。上面的两个示例模板分别对应 `ChatBI with Sales Analysis Expert` 和 `Text2SQL-ChatDB`。
- `ORG_ANALYTICS_BOOTSTRAP_MODE=semantic-only` 只初始化语义模型运行所需数据；`full-demo` 会额外导入 demo indicators 和 demo story。
- `XPERT_TEMPLATE_DIR` 未设置时会回退到默认数据目录；在 Docker 环境下通常对应 `/var/lib/xpert/data/xpert-template`。
- 这组配置不会回溯修改已有组织，只影响后续新创建的组织。

## 权限与 Handoff 路由

| 环境变量 | 作用 | 如何配置 |
| --------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| ALLOW_SUPER_ADMIN_ROLE | 是否允许 `SUPER_ADMIN` 直接通过租户级和组织级权限守卫 | 默认 `true`；仅当显式设置为 `false` 时，才会关闭该权限旁路 |
| HANDOFF_ROUTING_CONFIG_PATH | 指向 handoff 路由 YAML 配置文件 | 可填写绝对路径或相对路径；相对路径会按 API 服务根目录解析 |

示例配置：

```ini
ALLOW_SUPER_ADMIN_ROLE=true
HANDOFF_ROUTING_CONFIG_PATH=/var/lib/xpert/data/config/handoff-routing.yaml
```

对应的路由文件可参考 Xpert 源码中的 `docker/handoff-routing.example.yaml`，最小示例如下：

```yaml
version: 1
defaultQueue: handoff
defaultLane: main
routes:
  - match:
      typePrefix: channel.lark.
    target:
      queue: integration
      lane: normal
```

补充说明：

- `ALLOW_SUPER_ADMIN_ROLE` 不会删除或创建角色，它控制的是 `SUPER_ADMIN` 是否自动跳过部分租户/组织权限检查。
- `HANDOFF_ROUTING_CONFIG_PATH` 未设置时，系统会记录告警并回退到内置默认路由。
- handoff 路由配置在模块初始化时加载一次，修改 YAML 文件后需要重启 API 服务。

## 插件与默认技能仓库

| 环境变量 | 作用 | 如何配置 |
| ----------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PLUGINS | 在部署时向系统追加全局插件包 | 多个插件包名使用英文逗号或分号分隔；该变量会追加到系统内置的全局插件列表，而不是替换内置列表 |
| AI_DEFAULT_SKILL_REPOSITORIES | 在新租户创建时自动注册默认技能仓库 | 传入 JSON 字符串；推荐使用 `{ "repositories": [...] }` 结构；每项至少包含 `name` 和 `provider`，可选 `options`、`credentials` |

示例配置：

```ini
PLUGINS=@xpert-ai/plugin-openrouter,@xpert-ai/plugin-gemini
AI_DEFAULT_SKILL_REPOSITORIES={"repositories":[{"name":"anthropics/skills","provider":"github","options":{"url":"https://github.com/anthropics/skills","branch":"main"}},{"name":"acme/internal-skills","provider":"github","options":{"url":"https://github.com/acme/internal-skills","path":"skills","branch":"main"},"credentials":{"token":"<github-token>"}}]}
```

补充说明：

- `PLUGINS` 在服务启动阶段读取，修改后需要重启 API 服务。
- `AI_DEFAULT_SKILL_REPOSITORIES` 也支持直接传 JSON 数组，但推荐与 `docker/.env.example` 一样使用 `repositories` 包装结构，便于扩展。
- `AI_DEFAULT_SKILL_REPOSITORIES` 中的 `provider` 需要填写系统支持的技能仓库提供方，例如 `github` 或 `clawhub`。
- 如果 JSON 格式不合法，系统会记录告警并忽略该配置。
- 这组默认技能仓库仅在“新租户创建”时自动注册；已有租户如需补充，请通过技能仓库接口手动注册并同步。


## 邮件相关配置
自定义 smtp 邮件服务器配置， 需要配置以下环境变量：

| 环境变量          | 说明           |
| ----------------- | -------------- |
| MAIL_FROM_ADDRESS | 发件人邮件地址 |
| MAIL_HOST         | 邮箱服务主机   |
| MAIL_PORT         | 邮箱服务端口号 |
| MAIL_USERNAME     | 邮箱账号       |
| MAIL_PASSWORD     | 邮箱密码       |

## 文件存储

自定义文件存储提供商

| 环境变量                 | 说明                                 |
| ------------------------ | ------------------------------------ |
| FILE_PROVIDER            | 文件存储提供商（LOCAL \| S3 \| OSS） |
| ALIYUN_ACCESS_KEY_ID     | 阿里云 Access Key ID                 |
| ALIYUN_ACCESS_KEY_SECRET | 阿里云 Access Key Secret             |
| ALIYUN_REGION            | 阿里云地区                           |
| ALIYUN_OSS_ENDPOINT      | 阿里云 OSS Endpoint                  |
| ALIYUN_OSS_BUCKET        | 阿里云 OSS Bucket                    |
| AWS_ACCESS_KEY_ID        | 亚马逊云 Access Key ID               |
| AWS_SECRET_ACCESS_KEY    | 亚马逊云 Secret Access Key           |
| AWS_REGION               | 亚马逊云地区                         |
| AWS_S3_BUCKET            | 亚马逊云 S3 Bucket                   |
