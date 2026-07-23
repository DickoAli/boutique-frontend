"use client";

import { useEffect, useState } from "react";
import {
  fetchAdminCategories,
  createAdminCategory,
  deleteAdminCategory,
} from "@/lib/admin-api";
import { useAuth } from "@/lib/auth-context";

type Category = {
  id: number;
  name: string;
  slug: string;
  store_id: number;
};

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [storeId, setStoreId] = useState("1");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!token) return;
    loadCategories();
  }, [token]);

  async function loadCategories() {
    if (!token) return;
    try {
      const data = await fetchAdminCategories(token);
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    setError("");
    setIsSaving(true);

    try {
      await createAdminCategory(token, {
        name,
        slug,
        store_id: parseInt(storeId),
        is_active: true,
      });
      setName("");
      setSlug("");
      setShowForm(false);
      loadCategories();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!token) return;
    if (!confirm("Supprimer cette catégorie ?")) return;

    try {
      await deleteAdminCategory(token, id);
      loadCategories();
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ink-900">Catégories</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          {showForm ? "Annuler" : "Nouvelle catégorie"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 mb-4 text-sm">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white border border-ink-200 rounded-xl p-5 mb-6 space-y-3"
        >
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
          <button
            type="submit"
            disabled={isSaving}
            className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? "Création..." : "Créer"}
          </button>
        </form>
      )}

      <div className="bg-white border border-ink-200 rounded-xl divide-y divide-ink-100">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between px-5 py-4"
          >
            <p className="font-semibold text-ink-900">{category.name}</p>
            <button
              onClick={() => handleDelete(category.id)}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}