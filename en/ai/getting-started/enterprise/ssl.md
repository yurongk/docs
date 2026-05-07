# SSL

## Enable HTTPS Service

If you need to enable HTTPS service for this system, you can do so with the following configuration:

- Obtain the certificate files and place them in the `volumes/webapp/ssl` directory, with the filenames `server.crt` and `server.key`.
- Place the custom Nginx configuration file in the `volumes/webapp/conf` directory, with the filename `nginx.conf`, configured as follows

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

- Specify the nginx configuration file: change `command: ['nginx', '-g', 'daemon off;']` to `command: ['nginx', '-g', 'daemon off;', '-c', '/webapp/conf/nginx.conf']`
- Modify the ports configuration to open port 443: `- "443:443"`
- Change `API_BASE_URL` in the `.env` file to `//your.domain`.
- Change `WEBAPP_PORT` in the `.env` file to `443`. If you want to enable both (80/443), you can remove this variable.

Restart the service to apply the changes.

For more technical details, please refer to [Enable HTTPS - [ocap wiki]](https://github.com/meta-d/ocap/wiki/Https)