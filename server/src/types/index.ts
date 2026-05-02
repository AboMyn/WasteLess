export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  memberSince: string;
  createdAt: string;
}

export type UserPublic = Omit<User, 'passwordHash'>;

export interface Product {
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

export interface Order {
  id: string;
  userId: string;
  product: Product;
  status: 'active' | 'completed';
  reservedAt: string;
}
