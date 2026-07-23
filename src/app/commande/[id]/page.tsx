"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchOrder, requestDownloadLink } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type OrderItem = {
  id: number;
  product_id: number;
  product_name: string;
  price: string;
  quantity: number;
};

type Order = {
  id: number;
  order_number: string;
  total: string;
  status: string;
  items: OrderItem[];
};

export default function CommandePage() {
  const params = useParams();
  const { token, isLoading: authLoading } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  useEffect(() => {
    if (authLoading || !token) return;

    fetchOrder(token, params.id as string)
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [authLoading, token, params.id]);

  async function handleDownload(productId: number) {
    if (!token || !order) return;
    setDownloadingId(productId);

    try {
      const data = await requestDownloadLink(token, order.id, productId);
      window.open(data.download_url, "_blank");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDownloadingId(null);
    }
  }

  if (authLoading || isLoading) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-10">
        <p className="text-ink-500">Chargement...</p>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-10">
        <p className="text-red-600">{error || "Commande introuvable"}</p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white border border-ink-200 rounded-2xl p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink-900 mb-2">
            Commande confirmée
          </h1>
          <p className="text-ink-500">
            Numéro de commande :{" "}
            <strong className="text-ink-900">{order.order_number}</strong>
          </p>
          <p className="text-ink-500">
            Statut :{" "}
            <span className="text-green-600 font-medium">{order.status}</span>
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border border-ink-200 rounded-xl p-4"
            >
              <div>
                <p className="font-semibold text-ink-900">
                  {item.product_name}
                </p>
                <p className="text-ink-500 text-sm">{item.price} FCFA</p>
              </div>
              {order.status === "paid" && (
                <button
                  onClick={() => handleDownload(item.product_id)}
                  disabled={downloadingId === item.product_id}
                  className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
                >
                  {downloadingId === item.product_id
                    ? "Génération..."
                    : "Télécharger"}
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="text-xl font-bold text-ink-900">
          Total : {order.total} FCFA
        </p>
      </div>
    </main>
  );
}