"use client";

import { useEffect, useState } from "react";
import { fetchAdminUsers, updateAdminUserRole } from "@/lib/admin-api";
import { useAuth } from "@/lib/auth-context";

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function AdminUtilisateursPage() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    loadUsers();
  }, [token]);

  async function loadUsers() {
    if (!token) return;
    try {
      const data = await fetchAdminUsers(token);
      setUsers(data.data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleRoleChange(userId: number, role: string) {
    if (!token) return;
    try {
      await updateAdminUserRole(token, userId, role);
      loadUsers();
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900 mb-6">Utilisateurs</h1>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-ink-200 rounded-xl divide-y divide-ink-100">
        {users.map((u) => (
          <div
            key={u.id}
            className="flex items-center justify-between px-5 py-4"
          >
            <div>
              <p className="font-semibold text-ink-900">{u.name}</p>
              <p className="text-ink-500 text-sm">{u.email}</p>
            </div>
            <select
              value={u.role}
              onChange={(e) => handleRoleChange(u.id, e.target.value)}
              disabled={u.id === currentUser?.id}
              className="border border-ink-200 rounded-lg px-3 py-2 text-sm disabled:opacity-50"
            >
              <option value="client">client</option>
              <option value="admin">admin</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}