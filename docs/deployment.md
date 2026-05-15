# Deployment Guide

1. Build and push backend and frontend images through CI.
2. Replace `DOCKER_USERNAME` in `k8s/deployment.yaml` with the image namespace.
3. Review `library-secret` values before applying manifests.
4. Apply Kubernetes resources:

```bash
kubectl apply -f k8s/deployment.yaml
```

Check rollout status:

```bash
kubectl get pods -n library-system
kubectl get services -n library-system
```
