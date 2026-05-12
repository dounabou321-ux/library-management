// src/store/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI } from "../api/endpoints";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      access: null,
      refresh: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const { data } = await authAPI.login({ email, password });
        localStorage.setItem("access_token",  data.access);
        localStorage.setItem("refresh_token", data.refresh);
        set({ user: data.user, access: data.access, refresh: data.refresh, isAuthenticated: true });
        return data;
      },

      register: async (formData) => {
        const { data } = await authAPI.register(formData);
        localStorage.setItem("access_token",  data.access);
        localStorage.setItem("refresh_token", data.refresh);
        set({ user: data.user, access: data.access, refresh: data.refresh, isAuthenticated: true });
        return data;
      },

      logout: async () => {
        try { if (get().refresh) await authAPI.logout(get().refresh); } catch {}
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        set({ user: null, access: null, refresh: null, isAuthenticated: false });
      },

      updateUser: (user) => set({ user }),
      isAdmin: () => get().user?.role === "ADMIN",
    }),
    {
      name: "auth-store",
      partialize: (s) => ({
        user: s.user, access: s.access, refresh: s.refresh, isAuthenticated: s.isAuthenticated
      }),
    }
  )
);


// src/store/bookStore.js
import { create as createBook } from "zustand";
import { booksAPI } from "../api/endpoints";

export const useBookStore = createBook((set) => ({
  books: [],
  total: 0,
  loading: false,
  error: null,

  fetchBooks: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { data } = await booksAPI.list(params);
      set({ books: data.results, total: data.count, loading: false });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  deleteBook: async (id) => {
    await booksAPI.delete(id);
    set((s) => ({ books: s.books.filter((b) => b.id !== id) }));
  },
}));


// src/store/borrowingStore.js
import { create as createBorrow } from "zustand";
import { borrowingsAPI } from "../api/endpoints";

export const useBorrowingStore = createBorrow((set, get) => ({
  borrowings: [],
  myBorrowings: [],
  loading: false,

  fetchBorrowings: async (params = {}) => {
    set({ loading: true });
    try {
      const { data } = await borrowingsAPI.list(params);
      set({ borrowings: data.results || data, loading: false });
    } catch { set({ loading: false }); }
  },

  fetchMyBorrowings: async () => {
    set({ loading: true });
    try {
      const { data } = await borrowingsAPI.mine();
      set({ myBorrowings: data.results || data, loading: false });
    } catch { set({ loading: false }); }
  },

  borrowBook: async (bookId) => {
    const { data } = await borrowingsAPI.borrow(bookId);
    set((s) => ({ myBorrowings: [data, ...s.myBorrowings] }));
    return data;
  },

  returnBook: async (id) => {
    const { data } = await borrowingsAPI.return_(id);
    set((s) => ({
      myBorrowings: s.myBorrowings.map((b) => (b.id === id ? data : b)),
      borrowings: s.borrowings.map((b) => (b.id === id ? data : b)),
    }));
    return data;
  },

  activeCount: () => get().myBorrowings.filter((b) => b.status === "ACTIVE").length,
}));
