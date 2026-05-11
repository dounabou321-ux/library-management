# Backend

Django REST API for the library management system.

## Local setup

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The backend uses JWT authentication, a custom email user model, and modular apps under `apps/`.
