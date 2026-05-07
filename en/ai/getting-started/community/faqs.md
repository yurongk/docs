---
title: FAQs
sidebar_position: 10
---

## 1. Domain Configuration

If you need to customize the domain for system access, please modify the following environment variables (in the `.env` file): `API_BASE_URL` and `CLIENT_BASE_URL`.  
Additionally, if you need to change the port numbers, modify `API_PORT` or `WEB_PORT`.  
Ensure that the port numbers in `API_BASE_URL` and `CLIENT_BASE_URL` match those specified in `API_PORT` and `WEB_PORT`.

For example, if your domain is `example.com` and the ports for the backend and frontend are `90` and `3001` respectively, then:

`API_BASE_URL` = `//example.com:3001`  
`CLIENT_BASE_URL` = `//example.com:90`

## 2. How to Send Emails?

To use the system's email sending functionality, you need to configure an email server.

- Refer to [Environment Variables - Email-Related Configuration](/docs/getting-started/community/environments).  
- Alternatively, configure the email service settings for a tenant or organization within the system. [Custom SMTP](/docs/server/tenant/smtp)

## 3. Custom File Storage Location

When using the system, files uploaded by users are stored in the server’s local file storage by default. Administrators can change this to a network provider’s file storage service through:  
- [Environment Variables](/docs/getting-started/community/environments)  
- Or [Tenant Configuration](/docs/server/tenant/manage)

You can choose between **Alibaba Cloud Storage** and **Amazon Cloud Storage**.  
After selecting the storage service type, configure the corresponding authentication information.