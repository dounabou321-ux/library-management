import { BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-white font-bold mb-2">
          <BookOpen className="w-5 h-5" />
          BiblioTech
        </div>
        <p className="text-sm">
          © {new Date().getFullYear()} BiblioTech — Système de Gestion de Bibliothèque
        </p>
      </div>
    </footer>
  );
}
