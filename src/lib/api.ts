const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchProducts(params?: {
  search?: string;
  category_id?: string;
  min_price?: string;
  max_price?: string;
  sort_by?: string;
  sort_direction?: string;
}) {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.category_id) query.set("category_id", params.category_id);
  if (params?.min_price) query.set("min_price", params.min_price);
  if (params?.max_price) query.set("max_price", params.max_price);
  if (params?.sort_by) query.set("sort_by", params.sort_by);
  if (params?.sort_direction) query.set("sort_direction", params.sort_direction);

  const res = await fetch(`${API_URL}/products?${query.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des produits");
  }

  return res.json();
}

export async function fetchProduct(id: string) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Produit introuvable");
  }

  return res.json();
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string
) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Erreur lors de l'inscription");
  }

  return data;
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Erreur lors de la connexion");
  }

  return data;
}

export async function fetchCart(token: string) {
  const res = await fetch(`${API_URL}/cart`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erreur lors du chargement du panier");
  }

  return res.json();
}

export async function addToCart(
  token: string,
  productId: number,
  quantity: number = 1
) {
  const res = await fetch(`${API_URL}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ product_id: productId, quantity }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Erreur lors de l'ajout au panier");
  }

  return data;
}

export async function updateCartItem(
  token: string,
  cartItemId: number,
  quantity: number
) {
  const res = await fetch(`${API_URL}/cart/${cartItemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Erreur lors de la mise a jour");
  }

  return data;
}

export async function removeCartItem(token: string, cartItemId: number) {
  const res = await fetch(`${API_URL}/cart/${cartItemId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erreur lors de la suppression");
  }

  return res.json();
}

export async function createOrder(token: string, promoCode?: string) {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(promoCode ? { promo_code: promoCode } : {}),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Erreur lors de la creation de la commande");
  }

  return data;
}

export async function payOrder(token: string, orderId: number) {
  const res = await fetch(`${API_URL}/orders/${orderId}/pay`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Erreur lors de l'initiation du paiement");
  }

  return data;
}

export async function confirmPayment(token: string, orderId: number) {
  const res = await fetch(`${API_URL}/orders/${orderId}/confirm`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Erreur lors de la confirmation du paiement");
  }

  return data;
}

export async function fetchOrder(token: string, orderId: string) {
  const res = await fetch(`${API_URL}/orders/${orderId}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Commande introuvable");
  }

  return res.json();
}

export async function requestDownloadLink(
  token: string,
  orderId: number,
  productId: number
) {
  const res = await fetch(
    `${API_URL}/orders/${orderId}/download/${productId}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Erreur lors de la generation du lien");
  }

  return data;
}

export async function fetchOrders(token: string) {
  const res = await fetch(`${API_URL}/orders`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des commandes");
  }

  return res.json();
}

export async function fetchProfile(token: string) {
  const res = await fetch(`${API_URL}/profile`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erreur lors du chargement du profil");
  }

  return res.json();
}

export async function updateProfile(
  token: string,
  updates: { name?: string; email?: string }
) {
  const res = await fetch(`${API_URL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Erreur lors de la mise a jour du profil");
  }

  return data;
}

export async function updatePassword(
  token: string,
  currentPassword: string,
  newPassword: string,
  newPasswordConfirmation: string
) {
  const res = await fetch(`${API_URL}/profile/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: newPasswordConfirmation,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Erreur lors du changement de mot de passe");
  }

  return data;
  
}
export async function fetchCategories() {
  const res = await fetch(`${API_URL}/categories`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des categories");
  }

  return res.json();
}