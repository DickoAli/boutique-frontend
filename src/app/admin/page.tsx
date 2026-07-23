"use client";

import { useEffect, useState } from "react";
import { fetchDashboard } from "@/lib/admin-api";
import { useAuth } from "@/lib/auth-context";

type DashboardData = {
  total_revenue: number;
  total_orders: number;
  paid_orders: number;
  pending_orders: number;
  total_customers: number;
  total_products: number;
  top_products: {
    product_name: string;
    total_sold: number;
    total_revenue: number;
  }[];
};

export default function AdminDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    fetchDashboard(token)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [token]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!data)
    return <p className="text-ink-500">Chargement...</p>;

  const stats = [
    { label: "Revenu total", value: `${data.total_revenue} FCFA` },
    { label: "Commandes totales", value: data.total_orders },
    { label: "Commandes payées", value: data.paid_orders },
    { label: "En attente", value: data.pending_orders },
    { label: "Clients", value: data.total_customers },
    { label: "Produits", value: data.total_products },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-ink-200 rounded-xl p-5"
          >
            <p className="text-ink-500 text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-ink-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-ink-900 mb-4">
        Meilleures ventes
      </h2>
      <div className="bg-white border border-ink-200 rounded-xl divide-y divide-ink-100">
        {data.top_products.map((p, i) => (
          <div key={i} className="flex justify-between px-5 py-3">
            <span className="text-ink-900 font-medium">
              {p.product_name}
            </span>
            <span className="text-ink-500 text-sm">
              {p.total_sold} vendus — {p.total_revenue} FCFA
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}