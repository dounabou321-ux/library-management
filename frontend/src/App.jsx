import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

import { ProtectedRoute, AdminRoute, GuestRoute } from "./routes/ProtectedRoute";

// Layouts
import Layout        from "./components/layout/Layout";
import Sidebar       from "./components/layout/Sidebar";

// Pages
import Home          from "./pages/Home";
import Books         from "./pages/Books";
import Authors       from "./pages/Authors";
import Categories    from "./pages/Categories";
import Borrowings    from "./pages/Borrowings";
import Dashboard     from "./pages/Dashboard";
import Login         from "./pages/Login";
import Register      from "./pages/Register";
import Profile       from "./pages/Profile";
import NotFound      from "./pages/NotFound";

function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="books"      element={<Books admin />} />
          <Route path="authors"    element={<Authors admin />} />
          <Route path="categories" element={<Categories admin />} />
          <Route path="borrowings" element={<Borrowings admin />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  // Persist dark mode
  useEffect(() => {
    const dark = localStorage.getItem("dark") === "true";
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Routes>
        {/* ── Auth ── */}
        <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

        {/* ── Public / Member ── */}
        <Route element={<Layout />}>
          <Route path="/"         element={<Home />} />
          <Route path="/books"    element={<ProtectedRoute><Books /></ProtectedRoute>} />
          <Route path="/borrowings" element={<ProtectedRoute><Borrowings /></ProtectedRoute>} />
          <Route path="/profile"  element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Route>

        {/* ── Admin ── */}
        <Route path="/admin/*" element={<AdminRoute><AdminLayout /></AdminRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
