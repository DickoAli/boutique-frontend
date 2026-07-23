"use client";

import { useEffect, useState } from "react";
import {
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  fetchAdminCategories,
} from "@/lib/admin-api";
import { useAuth } from "@/lib/auth-context";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: string;
  is_active: boolean;
  category_id: number;
  category?: { name: string };
};

type Category = {
  id: number;
  name: string;
};

export default function AdminProduitsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!token) return;
    loadData();
  }, [token]);

  async function loadData() {
    if (!token) return;
    try {
      const productsData = await fetchAdminProducts(token);
      setProducts(productsData.data);

      const categoriesData = await fetchAdminCategories(token);
      setCategories(categoriesData);
    } catch (err: any) {
      setError(err.message);
    }
  }

  function resetForm() {
    setName("");
    setSlug("");
    setPrice("");
    setCategoryId("");
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setName(product.name);
    setSlug(product.slug);
    setPrice(product.price);
    setCategoryId(String(product.category_id));
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    setError("");
    setIsSaving(true);

    try {
      const payload = {
        name,
        slug,
        price: parseFloat(price),
        category_id: parseInt(categoryId),
        is_active: true,
      };

      if (editingId) {
        await updateAdminProduct(token, editingId, payload);
      } else {
        await createAdminProduct(token, payload);
      }

      resetForm();
      loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!token) return;
    if (!confirm("Supprimer ce produit ?")) return;

    try {
      await deleteAdminProduct(token, id);
      loadData();
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ink-900">Produits</h1>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          {showForm ? "Annuler" : "Nouveau produit"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 mb-4 text-sm">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-ink-200 rounded-xl p-5 mb-6 space-y-3"
        >
          <h2 className="font-semibold text-ink-900">
            {editingId ? "Modifier le produit" : "Nouveau produit"}
          </h2>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">
              Nom
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">
              Prix (FCFA)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">
              Catégorie
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full border border-ink-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Sélectionner...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
          >
            {isSaving
              ? "Enregistrement..."
              : editingId
              ? "Enregistrer les modifications"
              : "Créer"}
          </button>
        </form>
      )}

      <div className="bg-white border border-ink-200 rounded-xl divide-y divide-ink-100">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between px-5 py-4"
          >
            <div>
              <p className="font-semibold text-ink-900">{product.name}</p>
              <p className="text-ink-500 text-sm">
                {product.category?.name} — {product.price} FCFA
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => startEdit(product)}
                className="text-brand-600 hover:text-brand-700 text-sm font-medium"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}