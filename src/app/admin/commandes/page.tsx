"use client";

import { useEffect, useState } from "react";
import { fetchAdminOrders, updateAdminOrderStatus } from "@/lib/admin-api";
import { useAuth } from "@/lib/auth-context";

type Order = {
  id: number;
  order_number: string;
  total: string;
  status: string;
  created_at: string;
  user?: { name: string; email: string };
};

const STATUSES = ["pending", "paid", "failed", "cancelled"];

export default function AdminCommandesPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    loadOrders();
  }, [token]);

  async function loadOrders() {
    if (!token) return;
    try {
      const data = await fetchAdminOrders(token);
      setOrders(data.data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleStatusChange(orderId: number, status: string) {
    if (!token) return;
    try {
      await updateAdminOrderStatus(token, orderId, status);
      loadOrders();
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900 mb-6">Commandes</h1>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-ink-200 rounded-xl divide-y divide-ink-100">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between px-5 py-4"
          >
            <div>
              <p className="font-semibold text-ink-900">
                {order.order_number}
              </p>
              <p className="text-ink-500 text-sm">
                {order.user?.name} — {order.total} FCFA
              </p>
              <p className="text-ink-400 text-xs">
                {new Date(order.created_at).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(order.id, e.target.value)}
              className="border border-ink-200 rounded-lg px-3 py-2 text-sm"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}