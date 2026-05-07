---
title: SSL
sidebar_position: 11
---

## 开启 HTTPS 服务

> 以下所指目录的相对目录为 `docker`

如果需要为本系统开启 HTTPS 服务，可以通过以下配置做到：

- 获取证书文件，将证书文件放到 `volumes/webapp/ssl` 目录下，文件名分别为 `server.crt` 和 `server.key`。
- 将自定义 Nginx 配置文件放到 `volumes/webapp/conf` 目录下，文件名为 `nginx.conf`，配置如下
  ```
  user  nginx;
  error_log  /var/log/nginx/error.log warn;
  pid        /var/run/nginx.pid;

  events {
    worker_connections 1024;
  }

  http {
    include /etc/nginx/mime.types;
    
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                        '$status $body_bytes_sent "$http_referer" '
                        '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    #gzip  on;

    upstream api {
      server api:3000;
    }

    server {
      listen              80;
      listen              443 ssl;
      ssl_certificate     /webapp/ssl/server.crt;
      ssl_certificate_key /webapp/ssl/server.key;

      location / {
        root /srv/pangolin;
        try_files $uri $uri/ /index.html;
      }

      location /socket.io/ {
        proxy_pass http://api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
      }
      location /api/ {
        proxy_pass http://api;
        proxy_set_header Host $http_host;
        proxy_connect_timeout       5s;
        proxy_read_timeout          600s;
      }
      location /public/ {
        proxy_pass http://api;
        proxy_set_header Host $http_host;
        proxy_connect_timeout       5s;
        proxy_read_timeout          30s;
      }
    }
  }
  ```
- 指定 nginx 配置文件：修改 `command: ['nginx', '-g', 'daemon off;']` 改为 `command: ['nginx', '-g', 'daemon off;', '-c', '/webapp/conf/nginx.conf']`
- 修改 ports 配置开启 443 端口：`- "443:443"`
- 修改 `.env` 文件中的 `API_BASE_URL` 为 `//your.domain`。
- 修改 `.env` 文件中的 `WEBAPP_PORT` 为 `443`，如果想要两个（80/443）都启用则去掉此变量即可。

重新启动服务即可。

更多技术详情请参考 [Enable HTTPS - [Xpert wiki]](https://github.com/xpert-ai/xpert/wiki/Https)