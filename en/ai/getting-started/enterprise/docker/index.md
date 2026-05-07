---
title: Deploying Docker Cluster
sidebar_position: 1
---

## Background

This article will briefly describe how to quickly build a complete Xpert analytics platform cluster using the `docker run` or `docker-compose up` command.

## Applicable Scenarios

It is recommended to use the Xpert analytics platform Docker containers to simplify the deployment process in SIT or DEV environments.

## Software Environment

| Software       | Version     |
| -------------- | ----------- |
| Docker         | 20.0 or above |
| docker-compose | 2.10 or above |

## Standard Deployment

Please download the installation script provided by us

```bash
git clone https://github.com/meta-d/installer.git
```

Then, in the docker directory, first configure the environment variable file `.env`

```bash
cd installer/docker
cp env.tmpl .env
```

- Set the value of **INSTALLATION_MODE** to **standalone**
- Other password fields can be reset

Finally, execute the following command to start the service:
```bash
docker-compose -f docker-compose.yml up -d
```

Once the service is started, visit [http://localhost/](http://localhost/) to see the login page of the Xpert analytics platform.

<Tip>
**Domain**


When deploying on a server, please modify the `API_BASE_URL` environment variable in the `.env` file from localhost to the domain name or IP address of the server. For example:

`http://localhost:3000` → `http://my-domain.com:3000`

</Tip>

## Detailed Configuration

### Docker Compose Network Mode Explanation

There are two network modes suitable for deploying Xpert analytics platform Docker:

1. **HOST mode** suitable for deploying across multiple nodes. This mode is suitable for deploying different services on multiple node servers.
2. **Subnet Bridge mode** suitable for deploying multiple service processes on a single node. This mode is suitable for deploying multiple services on a single node.

For demonstration purposes, this chapter only demonstrates the script written in Subnet Bridge mode.

### Docker Compose Script

Deploying the Xpert analytics platform requires 5 basic services, which are defined in the `docker-compose.yml` file:
1. db: Database service, using the postgres database
2. redis: Server cache service, using the redis database
3. olap: OLAP engine service, using the Xpert-olap image
4. api: Backend service, using the ocap-api image
5. webapp: Frontend service, using the ocap-webapp image
