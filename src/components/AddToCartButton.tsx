"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function AddToCartButton({ productId }: { productId: number }) {
  const { token, user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAddToCart() {
    if (!user || !token) {
      router.push("/connexion");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await addToCart(token, productId, 1);
      setMessage("Produit ajouté au panier !");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleAddToCart}
        disabled={isLoading}
        className="bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
      >
        {isLoading ? "Ajout..." : "Ajouter au panier"}
      </button>
      {message && <p className="text-sm mt-3 text-ink-500">{message}</p>}
    </div>
  );
}