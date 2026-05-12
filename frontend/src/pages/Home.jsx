import { Link } from "react-router-dom";
import { BookOpen, Search, Users, BookMarked } from "lucide-react";
import { useAuthStore } from "../store";

const FEATURES = [
  { icon: BookOpen,   title: "Catalogue complet",  desc: "Accédez à des milliers de livres organisés par catégories et auteurs." },
  { icon: Search,     title: "Recherche avancée",  desc: "Trouvez rapidement un livre par titre, auteur, ISBN ou catégorie." },
  { icon: BookMarked, title: "Gestion d'emprunts", desc: "Empruntez et retournez des livres facilement depuis votre espace." },
  { icon: Users,      title: "Espace membre",      desc: "Suivez vos emprunts en cours et votre historique de lecture." },
];

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-900 dark:to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-3xl mb-6">
            <BookOpen className="w-10 h-10" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Bienvenue sur <span className="text-primary-200">BiblioTech</span>
          </h1>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-8">
            Gérez vos emprunts, découvrez de nouveaux livres et accédez à votre bibliothèque en ligne.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/books" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 rounded-xl font-semibold hover:bg-primary-50 transition">
                <BookOpen className="w-5 h-5" /> Parcourir les livres
              </Link>
            ) : (
              <>
                <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 rounded-xl font-semibold hover:bg-primary-50 transition">
                  Commencer maintenant
                </Link>
                <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 border border-white/40 rounded-xl font-semibold hover:bg-white/10 transition">
                  Se connecter
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">
          Tout ce dont vous avez besoin
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6 text-center hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl mb-4">
                <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="bg-gray-100 dark:bg-gray-900">
          <div className="max-w-3xl mx-auto px-4 py-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Prêt à découvrir votre bibliothèque ?
            </h2>
            <Link to="/register" className="btn-primary text-base px-8 py-3 inline-flex">
              Créer un compte gratuit
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
