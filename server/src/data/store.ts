import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { User, Product, Order } from '../types/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function read<T>(file: string): T[] {
  ensureDir();
  const fp = path.join(DATA_DIR, file);
  if (!fs.existsSync(fp)) return [];
  try {
    return JSON.parse(fs.readFileSync(fp, 'utf-8')) as T[];
  } catch {
    return [];
  }
}

function write<T>(file: string, data: T[]): void {
  ensureDir();
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), 'utf-8');
}

function hours(n: number) {
  return new Date(Date.now() + n * 3_600_000).toISOString();
}

function seedProducts(): Product[] {
  return [
    { id: '1',  name: 'Lactel Milk 1.5%',            store: 'Magnum',         originalPrice: 850,  discountedPrice: 450,  discount: 47, expiresAt: hours(5),  category: 'Dairy',   image: '/images/lactel.jpg',    description: 'Fresh ultra-pasteurized Lactel milk. Near expiration date.',          quantity: 3,  lat: 43.23436, lng: 76.77789 },
    { id: '2',  name: 'Borodinsky Bread',             store: 'Magnum Express', originalPrice: 250,  discountedPrice: 120,  discount: 52, expiresAt: hours(8),  category: 'Bakery',  image: '/images/hleb.webp',     description: 'Freshly baked rye bread from Magnum bakery.',                          quantity: 5,  lat: 43.21854, lng: 76.84276 },
    { id: '3',  name: 'Caesar Salad',                 store: 'Magnum Express', originalPrice: 1200, discountedPrice: 600,  discount: 50, expiresAt: hours(12), category: 'Salads',  image: '/images/cezar.webp',    description: 'Ready-to-eat salad with chicken, parmesan, and dressing.',             quantity: 4,  lat: 43.23745, lng: 76.82450 },
    { id: '4',  name: 'Fruit Basket (Apples & Pears)',store: 'Magnum Express', originalPrice: 2500, discountedPrice: 1100, discount: 56, expiresAt: hours(6),  category: 'Produce', image: '/images/korzina.webp',  description: 'Seasonal fruit mix: local apples and ripe pears.',                     quantity: 2,  lat: 43.20372, lng: 76.61965 },
    { id: '5',  name: 'Cream Cheese 200g',            store: 'Magnum Express', originalPrice: 1100, discountedPrice: 550,  discount: 50, expiresAt: hours(4),  category: 'Dairy',   image: '/images/cheese.webp',   description: 'Soft creamy cheese, perfect for breakfast.',                           quantity: 6,  lat: 43.23918, lng: 76.84172 },
    { id: '6',  name: 'Danone Strawberry Yogurt',     store: 'Magnum Super',   originalPrice: 450,  discountedPrice: 220,  discount: 51, expiresAt: hours(3),  category: 'Dairy',   image: '/images/yogurt.jpg',    description: 'Smooth yogurt with strawberry flavor.',                                quantity: 8,  lat: 43.22277, lng: 76.78372 },
    { id: '7',  name: 'Butter Croissant',             store: 'Magnum Express', originalPrice: 350,  discountedPrice: 150,  discount: 57, expiresAt: hours(2),  category: 'Bakery',  image: '/images/croissant.png', description: 'Fresh French croissant with butter.',                                  quantity: 10, lat: 43.23918, lng: 76.84172 },
    { id: '8',  name: 'Coca-Cola',                    store: 'Magnum Super',   originalPrice: 900,  discountedPrice: 450,  discount: 50, expiresAt: hours(4),  category: 'Drinks',  image: '/images/cocacola.jpg',  description: 'Refreshing carbonated drink.',                                          quantity: 5,  lat: 43.22591, lng: 76.86747 },
    { id: '9',  name: 'Mixed Nuts',                   store: 'Magnum Super',   originalPrice: 1500, discountedPrice: 750,  discount: 50, expiresAt: hours(24), category: 'Snacks',  image: '/images/nuts.jpeg',     description: 'Mix of almonds, cashews, and hazelnuts.',                              quantity: 7,  lat: 43.20558, lng: 76.81620 },
    { id: '10', name: 'DaDa Orange Juice',            store: 'Magnum Super',   originalPrice: 1200, discountedPrice: 600,  discount: 50, expiresAt: hours(5),  category: 'Drinks',  image: '/images/dada.jpg',      description: 'Natural orange juice with no additives.',                              quantity: 6,  lat: 43.22591, lng: 76.86747 },
  ];
}

// Always seeds products.json if empty — used by all product methods
function readProducts(): Product[] {
  let products = read<Product>('products.json');
  if (products.length === 0) {
    products = seedProducts();
    write('products.json', products);
  }
  return products;
}

export const db = {
  users: {
    findAll: (): User[] => read<User>('users.json'),
    findById: (id: string): User | null =>
      read<User>('users.json').find(u => u.id === id) ?? null,
    findByEmail: (email: string): User | null =>
      read<User>('users.json').find(u => u.email === email) ?? null,
    create: (user: User): User => {
      const users = read<User>('users.json');
      users.push(user);
      write('users.json', users);
      return user;
    },
    update: (id: string, patch: Partial<User>): User | null => {
      const users = read<User>('users.json');
      const idx = users.findIndex(u => u.id === id);
      if (idx === -1) return null;
      users[idx] = { ...users[idx], ...patch };
      write('users.json', users);
      return users[idx];
    },
  },

  products: {
    findAll: (): Product[] => readProducts(),
    findById: (id: string): Product | null =>
      readProducts().find(p => p.id === id) ?? null,
    update: (id: string, patch: Partial<Product>): Product | null => {
      const products = readProducts();
      const idx = products.findIndex(p => p.id === id);
      if (idx === -1) return null;
      products[idx] = { ...products[idx], ...patch };
      write('products.json', products);
      return products[idx];
    },
  },

  orders: {
    findByUserId: (userId: string): Order[] =>
      read<Order>('orders.json').filter(o => o.userId === userId),
    findById: (id: string): Order | null =>
      read<Order>('orders.json').find(o => o.id === id) ?? null,
    create: (order: Order): Order => {
      const orders = read<Order>('orders.json');
      orders.unshift(order);
      write('orders.json', orders);
      return order;
    },
    delete: (id: string): void => {
      const orders = read<Order>('orders.json');
      write('orders.json', orders.filter(o => o.id !== id));
    },
    update: (id: string, patch: Partial<Order>): Order | null => {
      const orders = read<Order>('orders.json');
      const idx = orders.findIndex(o => o.id === id);
      if (idx === -1) return null;
      orders[idx] = { ...orders[idx], ...patch };
      write('orders.json', orders);
      return orders[idx];
    },
  },
};
