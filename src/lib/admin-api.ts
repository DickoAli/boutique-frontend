const API_URL = process.env.NEXT_PUBLIC_API_URL;

function authHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchDashboard(token: string) {
  const res = await fetch(`${API_URL}/admin/dashboard`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Erreur lors du chargement du dashboard");
  return res.json();
}

// Produits
export async function fetchAdminProducts(token: string) {
  const res = await fetch(`${API_URL}/admin/products`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Erreur lors du chargement des produits");
  return res.json();
}

export async function createAdminProduct(token: string, data: any) {
  const res = await fetch(`${API_URL}/admin/products`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Erreur lors de la creation du produit");
  return result;
}

export async function updateAdminProduct(token: string, id: number, data: any) {
  const res = await fetch(`${API_URL}/admin/products/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Erreur lors de la mise a jour");
  return result;
}

export async function deleteAdminProduct(token: string, id: number) {
  const res = await fetch(`${API_URL}/admin/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression");
  return res.json();
}

// Categories
export async function fetchAdminCategories(token: string) {
  const res = await fetch(`${API_URL}/admin/categories`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Erreur lors du chargement des categories");
  return res.json();
}

export async function createAdminCategory(token: string, data: any) {
  const res = await fetch(`${API_URL}/admin/categories`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Erreur lors de la creation");
  return result;
}

export async function deleteAdminCategory(token: string, id: number) {
  const res = await fetch(`${API_URL}/admin/categories/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression");
  return res.json();
}

// Commandes
export async function fetchAdminOrders(token: string) {
  const res = await fetch(`${API_URL}/admin/orders`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Erreur lors du chargement des commandes");
  return res.json();
}

export async function updateAdminOrderStatus(token: string, id: number, status: string) {
  const res = await fetch(`${API_URL}/admin/orders/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Erreur lors de la mise a jour");
  return result;
}

// Utilisateurs
export async function fetchAdminUsers(token: string) {
  const res = await fetch(`${API_URL}/admin/users`, {
    headers: authHeaders(token),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Erreur lors du chargement des utilisateurs");
  return res.json();
}

export async function updateAdminUserRole(token: string, id: number, role: string) {
  const res = await fetch(`${API_URL}/admin/users/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ role }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Erreur lors de la mise a jour");
  return result;
}