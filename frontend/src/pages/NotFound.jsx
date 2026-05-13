import { Link } from "react-router-dom";
import { BookX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <BookX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-6xl font-bold text-gray-200 dark:text-gray-700 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Page introuvable</h2>
        <p className="text-gray-500 mb-6">La page que vous cherchez n'existe pas.</p>
        <Link to="/" className="btn-primary">Retour à l'accueil</Link>
      </div>
    </div>
  );
}
