---
title: Start with Local Source Code
sidebar_position: 3
---

## Prerequisites

<Info>
Before installing Xpert, ensure your machine meets the following minimum system requirements:

- CPU >= 2 cores
- RAM >= 4 GiB
</Info>

## Cloning Xpert

```bash
git clone https://github.com/xpert-ai/xpert.git
cd xpert
```

### Starting the Infrastructure

Before enabling business services, we need to deploy PostgreSQL/Redis (if not available locally). You can start them with the following commands:

```bash
cd docker
cp env.example .env
docker compose -f docker-compose.infra.yml up -d
```

### Starting the Milvus Service

If you need to use Milvus for knowledge base vector storage and retrieval, please:
- Modify the `VECTOR_STORE` configuration item in the `.env` file, setting it to `milvus`.
- Start the Docker container with the `milvus` configuration file:

```bash
docker compose -f docker-compose.infra.yml --profile milvus up -d
```

## Starting the Server and Web Application

Navigate to the project root directory:

- Install the [NodeJs](https://nodejs.org/en/download) LTS version or higher, e.g., 20.x.
- Install [pnpm](https://pnpm.io/installation) (if not already installed) using the command `npm i -g pnpm`.
- Use the command `pnpm bootstrap` to install NPM packages and bootstrap the solution.
- Copy the [`env.local`](./env.local) file to `.env` and adjust the settings in the file for local execution.

- Run the API and UI services using `pnpm start:api` and `pnpm start:cloud`, respectively.
- Open the XpertAI UI in a browser at http://localhost:4200 (the API runs at http://localhost:3000/api).
- [Start the onboarding wizard](../onboarding/)...
- Enjoy!

### Hot Reloading

If you want the Node application to automatically restart when file changes are detected in the directory, start the server with the following two commands:

- `pnpm start:api:dev`
- `pnpm start:cloud`

## Using the OLAP Engine

If you want to use the Xpert data analysis platform with the OLAP engine, run the following commands:

- Install the Java runtime and Maven.
- `pnpm start:olap`
