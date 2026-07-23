"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  createOrder,
  payOrder,
  confirmPayment,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type CartItem = {
  id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: string;
  };
};

export default function PanierPage() {
  const { token, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user || !token) {
      router.push("/connexion");
      return;
    }

    loadCart();
  }, [authLoading, user, token]);

  async function loadCart() {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await fetchCart(token);
      setItems(data.cart.items);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleQuantityChange(cartItemId: number, quantity: number) {
    if (!token || quantity < 1) return;
    try {
      await updateCartItem(token, cartItemId, quantity);
      loadCart();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleRemove(cartItemId: number) {
    if (!token) return;
    try {
      await removeCartItem(token, cartItemId);
      loadCart();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleCheckout() {
    if (!token) return;
    setError("");
    setIsCheckingOut(true);

    try {
      const order = await createOrder(token, promoCode || undefined);
      await payOrder(token, order.id);
      await confirmPayment(token, order.id);
      router.push(`/commande/${order.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsCheckingOut(false);
    }
  }

  if (authLoading || isLoading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-ink-500">Chargement...</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-ink-900 mb-8">
        Mon panier
      </h1>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4 mb-6 text-sm">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="bg-white border border-ink-200 rounded-xl p-8 text-center">
          <p className="text-ink-500 mb-3">Votre panier est vide.</p>
          <Link href="/" className="text-brand-600 font-medium hover:underline">
            Voir le catalogue
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white border border-ink-200 rounded-xl p-5"
              >
                <div>
                  <h2 className="font-semibold text-ink-900">
                    {item.product.name}
                  </h2>
                  <p className="text-ink-500 text-sm">
                    {item.product.price} FCFA
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, parseInt(e.target.value))
                    }
                    className="w-16 border border-ink-200 rounded-lg px-2 py-1.5 text-center text-sm"
                  />
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-ink-200 rounded-xl p-5 mb-6">
            <label className="block text-sm font-medium text-ink-700 mb-2">
              Code promo (optionnel)
            </label>
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="PROMO10"
              className="border border-ink-200 rounded-lg px-3 py-2 w-full sm:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="bg-white border border-ink-200 rounded-xl p-5 flex items-center justify-between">
            <p className="text-xl font-bold text-ink-900">
              Total : {total} FCFA
            </p>
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {isCheckingOut ? "Traitement..." : "Passer commande"}
            </button>
          </div>
        </>
      )}
    </main>
  );
}