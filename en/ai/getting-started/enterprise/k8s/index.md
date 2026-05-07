---
title: Kubernetes Deployment
sidebar_position: 2
---

## Environment Preparation

- Prepare Kubernetes environment
- Download deployment configuration `git clone https://github.com/meta-d/installer.git`

<Tip>
The following demonstration uses the `dev` namespace as an example. Users can modify the namespace according to their actual situations.
</Tip>

## Deployment

Navigate to the Kubernetes deployment folder

```bash
cd installer/k8s
```

### 1. Create Secrets

First, you need to create a separate `Secret` to store sensitive information such as database passwords, JWT keys, etc.

```bash
kubectl create -f secret.yaml -n dev
```

#### Secret Configuration (Optional)

Users can modify these secrets themselves, as follows:

- Encode passwords in base64

`echo -n '<Password>' | base64`

<Tip>

Decode: `echo '<EncodedPassword>' | base64 --decode`

</Tip>

- Then write it into the `Secret` configuration in the file *secret.yaml*

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: ocap-secrets
type: Opaque
data:
  DB_PASS: UG9zdGdyZXNQYXNzd29yZCExMjM=
```

The mandatory passwords are as follows:

| Name               | Description   |
| ------------------ | ------------- |
| DB_PASS            | Database password |
| SESSION_SECRET     | Session key   |
| JWT_SECRET         | JWT key       |
| JWT_REFRESH_SECRET | JWT refresh key |
| REDIS_PASSWORD     | Redis password |

For more secret configurations, please refer to the Secret section in the Kubernetes configuration file template.

### 2. Create or Update Configuration

Execute this command for the first-time creation or updating of the configuration:

```bash
kubectl apply -f manifest.yaml -n dev
```

#### Domain Configuration

The Xpert Analytics Platform defaults to using `localhost` as the domain. If you need to use a custom domain or server IP address for access, modify the following configuration in the ConfigMap `config-data`:

```yaml
...
  API_BASE_URL: "//api.demo.com"
  CLIENT_BASE_URL: "//app.demo.com"
```

- `API_BASE_URL` is the address of the API service (ocap-api-lb)
- `CLIENT_BASE_URL` is the address of the frontend service (ocap-webapp-lb)

<Tip>
**Note**

You can use the command `kubectl get services -n dev` to query the address of the service load balancer (or query according to the specific platform's configuration).
</Tip>

You can also use the same domain with different port numbers, as shown below:

```yaml
...
  API_BASE_URL: "//app.demo.com:3000"
  CLIENT_BASE_URL: "//app.demo.com"
```

<Tip>
**Note**

If a domain hasn't been set up yet, you can use the corresponding IP address here instead.
</Tip>

### 3. Access the Website

After all services have started, you can access the website via the domain (e.g., http://app.demo.com), and then proceed with the [system setup wizard](../onboarding/).

## Persistent Volume

For different k8s platforms, you may need to configure different Persistent Volumes. Please modify the `PersistentVolume` and `PersistentVolumeClaim` sections in the `manifest.yaml` file according to your actual situation.

## Ingress

If you need to use Ingress for external access and load balancing, you need to change the service type from `LoadBalancer` to `ClusterIP` and configure Ingress.

## Basic Kubernetes Operation Commands

* Execute yml file for the first time `kubectl create -f xxx.yml`
* Execute after modifying yml file `kubectl apply -f xxx.yml`
* Delete all resources defined in yml `kubectl delete -f xxx.yml`
* View pod list `kubectl get pods`
* Enter container `kubectl exec -it xxx(podName) -- /bin/sh`
* View logs `kubectl logs xxx(podName)`
* View IP and port information `kubectl get ep`
* [More Kubernetes knowledge](https://kubernetes.io/)