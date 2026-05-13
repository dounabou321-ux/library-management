// src/api/endpoints.js
import api from "./axios";

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (d)      => api.post("/api/auth/register/", d),
  login:    (d)      => api.post("/api/auth/login/", d),
  logout:   (refresh)=> api.post("/api/auth/logout/", { refresh }),
  profile:  ()       => api.get("/api/auth/profile/"),
  updateProfile: (d) => api.patch("/api/auth/profile/", d),
  changePassword: (d) => api.post("/api/auth/change-password/", d),
  listUsers: ()      => api.get("/api/auth/users/"),
  refreshToken: (r)  => api.post("/api/auth/token/refresh/", { refresh: r }),
};

// ── Authors ───────────────────────────────────────────────────────────────────
export const authorsAPI = {
  list:   (p) => api.get("/api/authors/", { params: p }),
  get:    (id)=> api.get(`/api/authors/${id}/`),
  create: (d) => api.post("/api/authors/", d),
  update: (id, d) => api.patch(`/api/authors/${id}/`, d),
  delete: (id)=> api.delete(`/api/authors/${id}/`),
};

// ── Categories ────────────────────────────────────────────────────────────────
export const categoriesAPI = {
  list:   ()          => api.get("/api/categories/"),
  get:    (slug)      => api.get(`/api/categories/${slug}/`),
  create: (d)         => api.post("/api/categories/", d),
  update: (slug, d)   => api.patch(`/api/categories/${slug}/`, d),
  delete: (slug)      => api.delete(`/api/categories/${slug}/`),
};

// ── Books ─────────────────────────────────────────────────────────────────────
export const booksAPI = {
  list:      (p)  => api.get("/api/books/", { params: p }),
  available: ()   => api.get("/api/books/available/"),
  get:       (id) => api.get(`/api/books/${id}/`),
  create:    (d)  => api.post("/api/books/", d, { headers: { "Content-Type": "multipart/form-data" } }),
  update:    (id, d) => api.patch(`/api/books/${id}/`, d, { headers: { "Content-Type": "multipart/form-data" } }),
  delete:    (id) => api.delete(`/api/books/${id}/`),
};

// ── Borrowings ────────────────────────────────────────────────────────────────
export const borrowingsAPI = {
  list:     (p)  => api.get("/api/borrowings/", { params: p }),
  mine:     ()   => api.get("/api/borrowings/mine/"),
  get:      (id) => api.get(`/api/borrowings/${id}/`),
  borrow:   (bookId) => api.post("/api/borrowings/", { book: bookId }),
  return_:  (id) => api.post(`/api/borrowings/${id}/return/`),
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
export const dashboardAPI = {
  stats: () => api.get("/api/dashboard/stats/"),
};
