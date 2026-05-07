---
title: Deploy with Docker Compose
sidebar_position: 1
---

## Prerequisites

<Info>
Before installing Xpert, ensure your machine meets the following minimum system requirements:

- CPU >= 2 cores
- RAM >= 4 GiB
</Info>

## Clone Xpert

```bash
git clone https://github.com/xpert-ai/xpert.git
cd xpert
```

## Start Xpert

1. Navigate to the Docker directory in the Xpert source code

```bash
cd docker
```

2. Copy the environment configuration file

```bash
cp env.example .env
```

3. Start the Docker containers

```bash
docker compose up -d
```

After executing the command, you should see output similar to the following, showing the status and port mappings of all containers:

```bash
 ✔ Network xpert-ai_default         Created                  0.0s 
 ✔ Container xpert-ai-db-1          Started                  0.0s 
 ✔ Container xpert-ai-redis-1       Started                  0.0s 
 ✔ Container xpert-ai-api-1         Started                  0.0s 
 ✔ Container xpert-ai-webapp-1      Started                  0.0s
```

Finally, check if all containers are running successfully:

```bash
docker compose ps
```

This includes two core services: api / webapp, and two dependency components: db / redis.

```bash
NAME                IMAGE                                       COMMAND                  SERVICE   CREATED         STATUS                   PORTS
xpert-ai-api-1      ghcr.io/xpert-ai/xpert-api:latest           "docker-entrypoint.s…"   api       4 minutes ago   Up 4 minutes             0.0.0.0:3000->3000/tcp
xpert-ai-db-1       pgvector/pgvector:pg12                      "docker-entrypoint.s…"   db        4 minutes ago   Up 4 minutes (healthy)   5432/tcp
xpert-ai-redis-1    redis/redis-stack:latest                    "sh -c 'redis-server…"   redis     4 minutes ago   Up 4 minutes             6379/tcp, 8001/tcp
xpert-ai-webapp-1   ghcr.io/xpert-ai/xpert-webapp:latest        "./entrypoint.compos…"   webapp    4 minutes ago   Up 4 minutes             0.0.0.0:80->80/tcp, 443/tcp
```

### Enable BI Service

If you need to enable multidimensional modeling for data analysis, start the Docker containers with the `bi` profile:

```bash
docker compose --profile bi up -d
```

### Start Milvus Service

If you need to use Milvus for knowledge base vector storage and retrieval:
- Modify the `VECTOR_STORE` configuration item in the `.env` file, setting it to `milvus`. Also, configure the Milvus account with `MILVUS_USER` and `MILVUS_PASSWORD`.
- Start the Docker containers with the `milvus` profile:

```bash
docker compose --profile milvus up -d
```

### Start Crawl4AI service

If you need to use [Rawl4AI](/docs/ai/tool/mcp/crawl4ai) To crawl web data, please add the 'crawl4ai' configuration when executing the Docker compose command:

```bash
docker compose --profile crawl4ai up -d
```

## Access Xpert AI

Visit the [initialization page](../onboarding/) to set up the admin account and tenant:

```bash
# Local environment
http://localhost/

# Server environment
http://your_server_ip/
```

Change the base URL in the `.env` file to the server address when deploying Xpert AI in a server environment.

```ini
API_BASE_URL=//your_server_ip:3000
CLIENT_BASE_URL=//your_server_ip
```

## Custom Configuration

Directly edit the environment variable values in the `.env` file. Then, restart Xpert:

```bash
docker compose down
docker compose up -d
```

## Upgrade

Navigate to the docker directory in the Xpert source code and execute the following commands:

```bash
cd xpert/docker
docker compose down
git pull origin main
docker compose pull
docker compose up -d
```

### Sync Environment Variable Configuration (Important)

- If the `env.example` file has been updated, be sure to modify your local `.env` file accordingly.
- Check and adjust the configuration items in the `.env` file as needed to ensure they match your actual environment. You may need to add any new variables from `env.example` to your `.env` file and update any changed values.

## Read More

If you have any questions, refer to the [FAQ](./faqs/).
