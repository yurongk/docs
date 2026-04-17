---
title: Environment Variable Explanation
sidebar_position: 9
---

System parameters can be controlled through environment variables. For the community Docker deployment, use `docker/.env.example` as the reference; if you are already inside the `docker/` directory, run `cp .env.example .env` and then adjust the values as needed.

Some parameter explanations are as follows:

| Environment Variable | Description |
| --------------------- | ----------- |
| API_BASE_URL         | API service address (needs modification) |
| CLIENT_BASE_URL      | Web client base URL (recommended to update together for server deployments) |
| WEB_PORT          | Port of website     |
| DB_NAME              | Database name |
| DB_USER              | Database username |
| DB_PASS              | Database password |
| DB_PORT              | Database port |
| DB_HOST              | Database address |
| REDIS_PASSWORD       | Cache service password |
| NODE_ENV             | Operating environment: `development` or `production` |
| LOG_LEVEL            | Log level |
| DEFAULT_LATITUDE     | Default latitude |
| DEFAULT_LONGITUDE    | Default longitude |
| DEFAULT_CURRENCY     | Default currency |
| DEMO                 | Demo system |

## Organization Bootstrap and Templates

The following variables are mainly used when a new organization is created. They control the default workspace bootstrap flow, analytics seed data, and external xpert templates:

| Environment Variable | Purpose | How to configure |
| ------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| ORG_DEFAULT_XPERT_TEMPLATE_KEYS | Automatically import specific templates into each new organization's default workspace | Provide template IDs separated by commas; leave empty to disable automatic import |
| ORG_ANALYTICS_BOOTSTRAP_MODE | Controls analytics bootstrap mode for new organizations | Supported values are `semantic-only` and `full-demo`; unset or invalid values fall back to `semantic-only` |
| XPERT_TEMPLATE_DIR | External xpert template directory | Point this to a persistent directory; on first startup the API seeds any missing baseline template files into it |

Example:

```ini
ORG_DEFAULT_XPERT_TEMPLATE_KEYS=af7133cb-32b3-47ff-90c1-b144c4d4887e,af7133cb-32b3-47ff-90c1-b144c4d48872
ORG_ANALYTICS_BOOTSTRAP_MODE=semantic-only
XPERT_TEMPLATE_DIR=/var/lib/xpert/data/xpert-template
```

Notes:

- `ORG_DEFAULT_XPERT_TEMPLATE_KEYS` uses template IDs, not display names. The two example IDs above correspond to `ChatBI with Sales Analysis Expert` and `Text2SQL-ChatDB`.
- `ORG_ANALYTICS_BOOTSTRAP_MODE=semantic-only` initializes only the semantic-model prerequisites; `full-demo` also imports demo indicators and demo stories.
- If `XPERT_TEMPLATE_DIR` is not set, the service falls back to the default data directory. In Docker this is typically `/var/lib/xpert/data/xpert-template`.
- These settings affect newly created organizations only. Existing organizations are not backfilled automatically.

## Permissions and Handoff Routing

| Environment Variable | Purpose | How to configure |
| --------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| ALLOW_SUPER_ADMIN_ROLE | Controls whether `SUPER_ADMIN` can bypass tenant-level and organization-level permission guards | Defaults to `true`; only set it to `false` if you want to disable this bypass |
| HANDOFF_ROUTING_CONFIG_PATH | Points to the handoff routing YAML file | You can use an absolute or relative path; relative paths are resolved from the API server root |

Example:

```ini
ALLOW_SUPER_ADMIN_ROLE=true
HANDOFF_ROUTING_CONFIG_PATH=/var/lib/xpert/data/config/handoff-routing.yaml
```

The routing file structure can follow the sample in `docker/handoff-routing.example.yaml` from the Xpert source repository. A minimal example looks like this:

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

Notes:

- `ALLOW_SUPER_ADMIN_ROLE` does not create or remove roles. It only controls whether `SUPER_ADMIN` automatically passes certain tenant and organization permission checks.
- If `HANDOFF_ROUTING_CONFIG_PATH` is not set, the service logs a warning and falls back to built-in defaults.
- The handoff routing file is loaded during module initialization, so API restart is required after editing the YAML file.

## Plugins and Default Skill Repositories

| Environment Variable | Purpose | How to configure |
| ----------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PLUGINS | Adds extra global plugin packages at deployment time | Separate plugin package names with commas or semicolons; the list is appended to the built-in global plugins rather than replacing them |
| AI_DEFAULT_SKILL_REPOSITORIES | Automatically registers default skill repositories when a new tenant is created | Pass a JSON string; the recommended shape is `{ "repositories": [...] }`; each entry must include at least `name` and `provider`, with optional `options` and `credentials` |

Example:

```ini
PLUGINS=@xpert-ai/plugin-openrouter,@xpert-ai/plugin-gemini
AI_DEFAULT_SKILL_REPOSITORIES={"repositories":[{"name":"anthropics/skills","provider":"github","options":{"url":"https://github.com/anthropics/skills","branch":"main"}},{"name":"acme/internal-skills","provider":"github","options":{"url":"https://github.com/acme/internal-skills","path":"skills","branch":"main"},"credentials":{"token":"<github-token>"}}]}
```

Notes:

- `PLUGINS` is read during service startup, so API restart is required after changes.
- `AI_DEFAULT_SKILL_REPOSITORIES` also accepts a raw JSON array, but the wrapped `repositories` format from `docker/.env.example` is recommended for future extensibility.
- The `provider` field in `AI_DEFAULT_SKILL_REPOSITORIES` must match a supported skill repository provider, such as `github` or `clawhub`.
- Invalid JSON is ignored and a warning is logged.
- These default repositories are only auto-registered for newly created tenants. Existing tenants need manual registration and sync through the skill repository APIs.

## Email related configuration
To customize the SMTP mail server configuration, you need to configure the following environment variables:

| Environment variable | Description |
| ----------------- | --------------- |
| MAIL_FROM_ADDRESS | Sender's email address |
| MAIL_HOST | Mail service host |
| MAIL_PORT | Mail service port number |
| MAIL_USERNAME | Mail account |
| MAIL_PASSWORD | Mail password |

## File Storage

Custom File Storage Providers

| Environment Variable      | Description                                  |
|---------------------------|----------------------------------------------|
| FILE_PROVIDER            | File storage provider (LOCAL \| S3 \| OSS)   |
| ALIYUN_ACCESS_KEY_ID     | Alibaba Cloud Access Key ID                  |
| ALIYUN_ACCESS_KEY_SECRET | Alibaba Cloud Access Key Secret              |
| ALIYUN_REGION            | Alibaba Cloud Region                         |
| ALIYUN_OSS_ENDPOINT      | Alibaba Cloud OSS Endpoint                   |
| ALIYUN_OSS_BUCKET        | Alibaba Cloud OSS Bucket                     |
| AWS_ACCESS_KEY_ID        | Amazon Cloud Access Key ID                   |
| AWS_SECRET_ACCESS_KEY    | Amazon Cloud Secret Access Key               |
| AWS_REGION               | Amazon Cloud Region                          |
| AWS_S3_BUCKET            | Amazon Cloud S3 Bucket                       |
