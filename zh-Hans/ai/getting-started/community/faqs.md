---
title: 常见问题
sidebar_position: 10
---

## 1.域名配置

如需自定义系统访问域名请修改环境变量（.env文件）的：`API_BASE_URL` 和 `CLIENT_BASE_URL`。
同时如果需要修改端口号请修改 `API_PORT` 或者 `WEB_PORT`。
并且 API_BASE_URL 和 CLIENT_BASE_URL 中的端口号要与 API_PORT 和 WEB_PORT 一致。

例如你的域名是 `example.com` 前后端口号分别使用 `90` 和 `3001`，那么

`API_BASE_URL` = `//example.com:3001`

`CLIENT_BASE_URL` = `//example.com:90`

## 2.如何发送邮件？

要使用系统发送邮件功能，您需要配置邮件服务器。 

- 查看 [环境变量 - 邮件相关配置](/docs/getting-started/community/environments)。
- 或者在系统中配置租户或组织的邮件服务配置。[自定义 SMTP](/docs/server/tenant/smtp)

## 3.自定义文件存储位置

在使用系统时用户上传的文件默认存储在服务器本地文件存储中，管理员可以通过 
- [环境变量](/docs/getting-started/community/environments) 
- 或者[租户配置](/docs/server/tenant/manage)

更改为网络提供商的文件存储服务。
可以在 **阿里云存储** 和 **亚马逊云存储** 中选择。
配置存储服务类型后设置相应的认证信息。
