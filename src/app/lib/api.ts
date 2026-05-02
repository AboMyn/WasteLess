const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

function jsonHeaders(auth = false): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) {
    const t = getToken();
    if (t) headers['Authorization'] = `Bearer ${t}`;
  }
  return headers;
}

async function request<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, opts);
  if (res.status === 204) return undefined as T;
  if (res.status === 401) {
    localStorage.removeItem('isAuth');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }
  const data = await res.json();
  if (!res.ok) throw new Error((data as { error?: string }).error ?? 'Request failed');
  return data as T;
}

export interface UserPublic {
  id: string;
  name: string;
  email: string;
  memberSince: string;
  createdAt: string;
}

export interface ApiProduct {
  id: string;
  name: string;
  store: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  expiresAt: string;
  category: string;
  image: string;
  description: string;
  quantity: number;
  lat: number;
  lng: number;
}

export interface ApiOrder {
  id: string;
  userId: string;
  product: ApiProduct;
  status: 'active' | 'completed';
  reservedAt: string;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: UserPublic }>('/auth/login', {
        method: 'POST',
        headers: jsonHeaders(),
        body: JSON.stringify({ email, password }),
      }),
    register: (name: string, email: string, password: string) =>
      request<{ token: string; user: UserPublic }>('/auth/register', {
        method: 'POST',
        headers: jsonHeaders(),
        body: JSON.stringify({ name, email, password }),
      }),
  },

  products: {
    getAll: () => request<ApiProduct[]>('/products'),
    getById: (id: string) => request<ApiProduct>(`/products/${id}`),
    reserve: (id: string) =>
      request<{ product: ApiProduct; order: ApiOrder }>(`/products/${id}/reserve`, {
        method: 'PATCH',
        headers: jsonHeaders(true),
      }),
  },

  orders: {
    getAll: () =>
      request<ApiOrder[]>('/orders', { headers: jsonHeaders(true) }),
    cancel: (id: string) =>
      request<void>(`/orders/${id}`, {
        method: 'DELETE',
        headers: jsonHeaders(true),
      }),
  },

  users: {
    me: () => request<UserPublic>('/users/me', { headers: jsonHeaders(true) }),
    update: (data: { name: string; email: string }) =>
      request<UserPublic>('/users/me', {
        method: 'PUT',
        headers: jsonHeaders(true),
        body: JSON.stringify(data),
      }),
  },
};
