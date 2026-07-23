"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchProducts, fetchCategories } from "@/lib/api";

type Product = {
  id: number;
  name: string;
  price: string;
  category?: { name: string };
};

type Category = {
  id: number;
  name: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
    loadProducts();
  }, []);

  async function loadProducts(overrides?: {
    search?: string;
    categoryId?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    sortDirection?: string;
  }) {
    setIsLoading(true);
    try {
      const data = await fetchProducts({
        search: overrides?.search ?? search,
        category_id: overrides?.categoryId ?? categoryId,
        min_price: overrides?.minPrice ?? minPrice,
        max_price: overrides?.maxPrice ?? maxPrice,
        sort_by: overrides?.sortBy ?? sortBy,
        sort_direction: overrides?.sortDirection ?? sortDirection,
      });
      setProducts(data.data);
    } finally {
      setIsLoading(false);
    }
  }

  function handleFilterSubmit(e: React.FormEvent) {
    e.preventDefault();
    loadProducts();
  }

  function handleSortChange(value: string) {
    const [newSortBy, newSortDirection] = value.split("-");
    setSortBy(newSortBy);
    setSortDirection(newSortDirection);
    loadProducts({ sortBy: newSortBy, sortDirection: newSortDirection });
  }

  function handleCategoryChange(value: string) {
    setCategoryId(value);
    loadProducts({ categoryId: value });
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Catalogue</h1>

      <form
        onSubmit={handleFilterSubmit}
        className="flex flex-col sm:flex-row flex-wrap gap-3 mb-8 bg-white border border-zinc-200 rounded-xl p-4"
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher..."
          className="flex-1 min-w-[150px] border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />

        <select
          value={categoryId}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="border border-zinc-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Toutes catégories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Prix min"
          className="w-28 border border-zinc-200 rounded-lg px-3 py-2 text-sm"
        />

        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Prix max"
          className="w-28 border border-zinc-200 rounded-lg px-3 py-2 text-sm"
        />

        <select
          onChange={(e) => handleSortChange(e.target.value)}
          className="border border-zinc-200 rounded-lg px-3 py-2 text-sm"
          defaultValue="created_at-desc"
        >
          <option value="created_at-desc">Plus récents</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="name-asc">Nom (A-Z)</option>
        </select>

        <button
          type="submit"
          className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-zinc-800 transition-colors"
        >
          Filtrer
        </button>
      </form>

      {isLoading ? (
        <p className="text-zinc-500">Chargement...</p>
      ) : products.length === 0 ? (
        <p className="text-zinc-500">Aucun produit trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/produit/${product.id}`}
              className="group bg-white border border-zinc-200 rounded-xl p-5 hover:border-zinc-900 hover:shadow-lg transition-all"
            >
              <p className="text-xs uppercase tracking-wide text-zinc-400 mb-2">
                {product.category?.name}
              </p>
              <h2 className="text-lg font-semibold mb-3 group-hover:underline">
                {product.name}
              </h2>
              <p className="text-xl font-bold">{product.price} FCFA</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}