"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchGuestOrder, requestGuestDownloadLink } from "@/lib/api";

type OrderItem = {
  id: number;
  product_id: number;
  product_name: string;
  price: string;
};

type Order = {
  id: number;
  order_number: string;
  guest_name: string;
  total: string;
  status: string;
  items: OrderItem[];
};

const WAVE_NUMBER = process.env.NEXT_PUBLIC_WAVE_NUMBER;
const MOOV_NUMBER = process.env.NEXT_PUBLIC_MOOV_NUMBER;
const WHATSAPP_LINK = process.env.NEXT_PUBLIC_WHATSAPP_LINK;

export default function GuestOrderPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  useEffect(() => {
    fetchGuestOrder(orderNumber)
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [orderNumber]);

  async function handleDownload(productId: number) {
    setDownloadingId(productId);
    try {
      const data = await requestGuestDownloadLink(orderNumber, productId);
      window.open(data.download_url, "_blank");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDownloadingId(null);
    }
  }

  if (isLoading) {
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

  const whatsappMessage = encodeURIComponent(
    "Bonjour, je viens d'effectuer le paiement pour la commande " +
      order.order_number +
      " (" +
      order.total +
      " FCFA). Voici ma preuve de paiement :"
  );
  const whatsappUrl = WHATSAPP_LINK + "?text=" + whatsappMessage;

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white border border-ink-200 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-ink-900 mb-2">
          {order.status === "paid" ? "Commande payee" : "Commande enregistree"}
        </h1>
        <p className="text-ink-500 mb-6">
          Numero de commande :{" "}
          <strong className="text-ink-900">{order.order_number}</strong>
          <br />
          Conservez precieusement ce numero, il vous permettra de retrouver
          votre commande.
        </p>

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
                    ? "Generation..."
                    : "Telecharger"}
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="text-xl font-bold text-ink-900 mb-6">
          Total : {order.total} FCFA
        </p>

        {order.status === "pending" && (
          <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 space-y-4">
            <h2 className="font-semibold text-ink-900">
              Comment finaliser votre paiement
            </h2>
            <ol className="list-decimal list-inside text-sm text-ink-700 space-y-2">
              <li>
                Effectuez un depot de <strong>{order.total} FCFA</strong> via :
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>
                    Wave : <strong className="text-ink-900">{WAVE_NUMBER}</strong>
                  </li>
                  <li>
                    Moov Money :{" "}
                    <strong className="text-ink-900">{MOOV_NUMBER}</strong>
                  </li>
                </ul>
              </li>
              <li>Prenez une capture d'ecran de la confirmation.</li>
              <li>
                Envoyez-la nous sur WhatsApp en precisant votre numero de
                commande.
              </li>
              <li>
                Une fois le paiement verifie, vous pourrez telecharger votre
                fichier sur cette page.
              </li>
            </ol>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block text-center bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
              Envoyer ma preuve sur WhatsApp
            </a>
          </div>
        )}
      </div>
    </main>
  );
}