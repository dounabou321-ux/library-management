#  Library Management System — DevOps Project

[![CI/CD](https://github.com/YOUR_USERNAME/library-management-devops/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/library-management-devops/actions/workflows/ci.yml)
[![Django](https://img.shields.io/badge/Django-4.2-green.svg)](https://djangoproject.com)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://docker.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://postgresql.org)

> Système complet de gestion de bibliothèque — Projet DevOps fullstack avec Django REST Framework, React + Vite, PostgreSQL, Docker, CI/CD GitHub Actions et Kubernetes.

---

##  Table des matières :

- [Fonctionnalités] (#-fonctionnalités)
- [Stack technique] (#-stack-technique)
- [Architecture]    (#-architecture)
- [Installation rapide]      (#-installation-rapide)
- [Variables d'environnement](#-variables-denvironnement)
- [Lancement avec Docker]    (#-lancement-avec-docker)
- [Développement local]      (#-développement-local)
- [API Documentation]        (#-api-documentation)
- [Tests]                    (#-tests)
- [CI/CD Pipeline]           (#-cicd-pipeline)
- [Kubernetes]               (#-kubernetes)
- [Git Workflow]             (#-git-workflow)
- [Contributeurs]            (#-contributeurs)

---

##  Fonctionnalités

###  Membres
- Inscription / Connexion avec JWT
- Parcourir le catalogue de livres
- Recherche et filtrage avancés (titre, auteur, catégorie, disponibilité)
- Emprunter un livre disponible
- Retourner un livre
- Consulter ses emprunts en cours et l'historique
- Gestion du profil

###  Administrateurs
- Tableau de bord avec statistiques en temps réel
- Graphiques : emprunts par jour, par catégorie, top livres
- CRUD complet : Livres, Auteurs, Catégories
- Gestion de tous les emprunts (voir, retourner)
- Liste des membres et leurs statistiques

### 🔐 Sécurité
- Authentification JWT (access + refresh tokens)
- Rotation automatique des refresh tokens
- Blacklist des tokens révoqués
- Routes protégées (frontend + backend)
- Rôles : ADMIN / MEMBER

---

## 🛠 Stack technique

| Couche      | Technologie                              |
|-------------|------------------------------------------|
| Backend     | Django 4.2 + Django REST Framework       |
| Auth        | SimpleJWT (access + refresh + blacklist) |
| Base de données | PostgreSQL 16                        |
| Frontend    | React 18 + Vite + Tailwind CSS           |
| State       | Zustand                                  |
| HTTP client | Axios (avec intercepteurs JWT)           |
| Conteneurs  | Docker + Docker Compose                  |
| CI/CD       | GitHub Actions                           |
| Serveur web | Nginx (frontend) + Gunicorn (backend)    |
| Orchestration | Kubernetes (manifests fournis)         |
| Docs API    | drf-spectacular (Swagger + Redoc)        |

---

##  Architecture

```
library-management-devops/
├── backend/                    # Django REST API
│   ├── library_project/        # Configuration principale
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── pagination.py
│   │   └── wsgi.py
│   ├── apps/
│   │   ├── users/              # Auth, JWT, gestion membres
│   │   ├── authors/            # CRUD auteurs
│   │   ├── categories/         # CRUD catégories
│   │   ├── books/              # CRUD livres + filtres
│   │   ├── borrowings/         # Logique emprunts/retours
│   │   └── dashboard/          # Stats agrégées (admin)
│   ├── Dockerfile
│   ├── requirements.txt
│   └── pytest.ini
│
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── api/                # Axios + endpoints
│   │   ├── components/         # Composants réutilisables
│   │   │   ├── layout/         # Navbar, Sidebar, Footer
│   │   │   ├── ui/             # Table, Modal, Loader…
│   │   │   ├── books/          # BookCard, BookForm
│   │   │   └── dashboard/      # Charts
│   │   ├── pages/              # Login, Register, Books…
│   │   ├── routes/             # ProtectedRoute, AdminRoute
│   │   ├── store/              # Zustand stores
│   │   └── styles/             # Tailwind global
│   ├── Dockerfile
│   ├── nginx.conf
│   └── vite.config.js
│
├── k8s/                        # Manifests Kubernetes
│   └── deployment.yaml
│
├── .github/
│   └── workflows/
│       └── ci.yml              # Pipeline CI/CD
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

##  Installation rapide

### Prérequis

- [Docker](https://docs.docker.com/get-docker/) ≥ 24
- [Docker Compose](https://docs.docker.com/compose/) ≥ 2
- Git

### Lancement en 3 commandes

```bash
# 1. Cloner le dépôt
git clone https://github.com/aimad-oubella/library-management-devops.git
cd library-management-devops

# 2. Configurer les variables d'environnement
cp .env.example .env
# Éditez .env si nécessaire

# 3. Lancer tous les services
docker compose up --build
```

**L'application est disponible sur :**
-  Frontend : http://localhost
-  API :      http://localhost:8000/api/
-  Swagger :  http://localhost:8000/api/docs/
-   Admin Django : http://localhost:8000/admin/

---

## 🔑 Variables d'environnement

| Variable               | Description                      | Défaut          |
|------------------------|----------------------------------|-----------------|
| `SECRET_KEY`           | Clé secrète Django               | *(obligatoire)* |
| `DEBUG`                | Mode debug                       | `False`         |
| `DB_NAME`              | Nom de la base de données        | `library_db`    |
| `DB_USER`              | Utilisateur PostgreSQL           | `postgres`      |
| `DB_PASSWORD`          | Mot de passe PostgreSQL          | *(obligatoire)* |
| `DB_HOST`              | Hôte PostgreSQL                  | `db`            |
| `CORS_ALLOWED_ORIGINS` | Origines autorisées (CORS)       | `http://localhost` |
| `JWT_ACCESS_MINUTES`   | Durée du token d'accès (minutes) | `60`            |
| `JWT_REFRESH_DAYS`     | Durée du refresh token (jours)   | `7`             |
| `VITE_API_URL`         | URL de l'API (frontend)          | `http://localhost:8000` |

---

## 🐳 Lancement avec Docker

```bash
# Démarrer tous les services
docker compose up -d

# Voir les logs
docker compose logs -f

# Arrêter
docker compose down

# Tout réinitialiser (données comprises)
docker compose down -v
```

### Créer un super-utilisateur admin

```bash
docker compose exec backend python manage.py createsuperuser
```

### Charger des données de démonstration (optionnel)

```bash
docker compose exec backend python manage.py loaddata fixtures/demo.json
```

---

##  Développement local

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Copier les variables d'env
cp .env.example .env
# Modifier DB_HOST=localhost dans .env

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Modifier VITE_API_URL=http://localhost:8000

npm run dev
```

---

##  API Documentation

| Endpoint                      | Méthode | Auth    | Description                        |
|-------------------------------|---------|---------|-------------------------------------|
| `/api/auth/register/`         | POST    | Public  | Inscription                         |
| `/api/auth/login/`            | POST    | Public  | Connexion → JWT                     |
| `/api/auth/logout/`           | POST    | JWT     | Déconnexion (blacklist)             |
| `/api/auth/token/refresh/`    | POST    | Public  | Rafraîchir le token                 |
| `/api/auth/profile/`          | GET/PATCH | JWT  | Profil utilisateur                  |
| `/api/auth/users/`            | GET     | Admin   | Liste des membres                   |
| `/api/books/`                 | GET/POST | JWT   | Liste / Créer livres                |
| `/api/books/{id}/`            | GET/PATCH/DELETE | JWT | Détail livre              |
| `/api/books/available/`       | GET     | JWT     | Livres disponibles                  |
| `/api/authors/`               | GET/POST | JWT   | Liste / Créer auteurs               |
| `/api/authors/{id}/`          | GET/PATCH/DELETE | JWT | Détail auteur             |
| `/api/categories/`            | GET/POST | JWT   | Liste / Créer catégories            |
| `/api/borrowings/`            | GET/POST | JWT   | Liste / Emprunter un livre          |
| `/api/borrowings/mine/`       | GET     | JWT     | Mes emprunts                        |
| `/api/borrowings/{id}/return/`| POST    | JWT     | Retourner un livre                  |
| `/api/dashboard/stats/`       | GET     | Admin   | Statistiques globales               |
| `/api/docs/`                  | GET     | Public  | Swagger UI                          |
| `/api/redoc/`                 | GET     | Public  | Redoc                               |

---

##  Tests

```bash
# Dans le container
docker compose exec backend pytest -v

# Avec couverture
docker compose exec backend pytest --cov=apps --cov-report=term-missing

# En local
cd backend
pytest --cov=apps -v
```

**Couverture de tests :**
- ✅ Authentification (register, login, logout, refresh)
- ✅ Auteurs (CRUD, permissions admin)
- ✅ Livres (CRUD, recherche, filtres)
- ✅ Emprunts (emprunter, retourner, stock insuffisant)
- ✅ Dashboard (admin only)

---

##  CI/CD Pipeline

Le pipeline GitHub Actions se déclenche automatiquement sur chaque `push` et `pull_request`.

```
Push / PR
    │
    ├── Job 1: backend-ci
    │   ├── PostgreSQL service
    │   ├── pip install
    │   ├── flake8 lint
    │   └── pytest + coverage
    │
    ├── Job 2: frontend-ci
    │   ├── npm install
    │   ├── eslint lint
    │   └── npm run build
    │
    └── Job 3: docker-push (main branch uniquement)
        ├── docker login
        ├── Build & Push backend image
        └── Build & Push frontend image
```

### Secrets GitHub requis

| Secret           | Description                    |
|------------------|--------------------------------|
| `DOCKER_USERNAME`| Identifiant Docker Hub         |
| `DOCKER_PASSWORD`| Token Docker Hub               |
| `VITE_API_URL`   | URL de l'API en production     |

---

##  Kubernetes

```bash
# Appliquer tous les manifests
kubectl apply -f k8s/deployment.yaml

# Vérifier les pods
kubectl get pods -n library-system

# Voir les services
kubectl get services -n library-system

# Logs backend
kubectl logs -n library-system -l app=backend -f

# Scaler le backend
kubectl scale deployment backend -n library-system --replicas=3
```

**Avant de déployer :** remplacer `DOCKER_USERNAME` dans `k8s/deployment.yaml` par votre identifiant Docker Hub.

---

##  Git Workflow

```
main          ← Production stable, CI/CD complet
  │
develop       ← Intégration
  │
  ├── feature/auth
  ├── feature/books
  ├── feature/borrowings
  ├── feature/dashboard
  ├── feature/docker
  └── feature/cicd
```

### Conventional Commits

```bash
git commit -m "feat: ajout du système d'emprunt"
git commit -m "fix: correction du calcul de stock disponible"
git commit -m "docs: mise à jour du README"
git commit -m "refactor: extraction de la logique métier dans services.py"
git commit -m "test: ajout des tests d'emprunt"
git commit -m "ci: configuration du pipeline GitHub Actions"
```

### Exemples de commandes

```bash
# Créer et pousser une branche feature
git checkout -b feature/books develop
git add .
git commit -m "feat: CRUD livres avec filtres et pagination"
git push origin feature/books

# Merger dans develop
git checkout develop
git merge --no-ff feature/books
git push origin develop

# Release en production
git checkout main
git merge --no-ff develop
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin main --tags
```

---

##  Screenshots

|      Page        |               Description             |
|------------------|---------------------------------------|
| ![Login](#)      | Page de connexion                     |
| ![Dashboard](#)  | Tableau de bord admin avec graphiques |
| ![Books](#)      | Catalogue de livres avec filtres      |
| ![Borrowings](#) | Gestion des emprunts                  |

---

##  Contributeurs

| Nom             |        Rôle             |
|-----------------|-------------------------|
| Dounia Boubtane | Backend Django + DevOps |
| Aimad Oubellan  | Frontend React + CI/CD  |

---------------------------------------------

##  Licence

Ce projet est réalisé dans le cadre d'un examen DevOps supervisé par le Professeur Soufiane Hamida.

---------------------------------------------------------------------------------------------------

*Développé avec — Django + React + Docker + GitHub Actions*
