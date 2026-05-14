# Testing Guide

Backend tests run with pytest:

```bash
cd backend
pytest --cov=apps -v
```

Frontend validation runs with Vite and ESLint:

```bash
cd frontend
npm run lint
npm run build
```

The CI pipeline runs backend tests against PostgreSQL and builds the React app before image publishing on `main`.
