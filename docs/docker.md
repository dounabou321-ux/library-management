# Docker Operations

Use Docker Compose for local integration:

```bash
docker compose up --build
```

Services:

- `db`: PostgreSQL 16 with a health check.
- `backend`: Django, migrations, collectstatic, and Gunicorn.
- `frontend`: Nginx serving the Vite build and proxying `/api` and `/media`.
