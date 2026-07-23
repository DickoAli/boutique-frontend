"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchProfile, updateProfile, fetchOrders } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type Order = {
  id: number;
  order_number: string;
  total: string;
  status: string;
  created_at: string;
};

export default function ComptePage() {
  const { token, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user || !token) {
      router.push("/connexion");
      return;
    }

    loadData();
  }, [authLoading, user, token]);

  async function loadData() {
    if (!token) return;
    setIsLoading(true);
    try {
      const profile = await fetchProfile(token);
      setName(profile.name);
      setEmail(profile.email);

      const ordersData = await fetchOrders(token);
      setOrders(ordersData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    setError("");
    setMessage("");
    setIsSaving(true);

    try {
      await updateProfile(token, { name, email });
      setMessage("Profil mis à jour avec succès.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  if (authLoading || isLoading) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-10">
        <p className="text-ink-500">Chargement...</p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-10">
      <div className="bg-white border border-ink-200 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-ink-900 mb-6">Mon profil</h1>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg p-3 mb-4 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">
              Nom
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-ink-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-ink-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="bg-brand-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-ink-900 mb-6">
          Historique des commandes
        </h2>

        {orders.length === 0 ? (
          <div className="bg-white border border-ink-200 rounded-xl p-8 text-center">
            <p className="text-ink-500">Aucune commande pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/commande/${order.id}`}
                className="block bg-white border border-ink-200 rounded-xl p-5 hover:border-brand-500 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-ink-900">
                      {order.order_number}
                    </p>
                    <p className="text-ink-500 text-sm">
                      {new Date(order.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-ink-900">
                      {order.total} FCFA
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        order.status === "paid"
                          ? "text-green-600"
                          : "text-orange-600"
                      }`}
                    >
                      {order.status}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}