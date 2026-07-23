"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function Header() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-ink-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight text-ink-900">
          Ma Boutique <span className="text-brand-600">Digitale</span>
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          {!isLoading && user && (
            <>
              <span className="text-ink-500 hidden sm:inline">
                Bonjour, {user.name}
              </span>
              <Link
                href="/panier"
                className="text-ink-700 hover:text-brand-600 transition-colors"
              >
                Panier
              </Link>
              <Link
                href="/compte"
                className="text-ink-700 hover:text-brand-600 transition-colors"
              >
                Mon compte
              </Link>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-ink-700 hover:text-brand-600 transition-colors"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 transition-colors"
              >
                Déconnexion
              </button>
            </>
          )}

          {!isLoading && !user && (
            <>
              <Link
                href="/connexion"
                className="text-ink-700 hover:text-brand-600 transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/inscription"
                className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors font-medium"
              >
                Créer un compte
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}