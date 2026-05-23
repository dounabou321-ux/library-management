# API Notes

Base path: `/api/`

Authentication uses JWT bearer tokens from `/api/auth/login/` and refresh tokens from `/api/auth/token/refresh/`.

Main resources:

- `/api/auth/`: register, login, logout, profile, users.
- `/api/authors/`: author CRUD with admin-only writes.
- `/api/categories/`: category CRUD with slug lookup.
- `/api/books/`: book catalog, filters, search, and `/available/`.
- `/api/borrowings/`: borrow, return, and personal history.
- `/api/dashboard/stats/`: admin metrics.
