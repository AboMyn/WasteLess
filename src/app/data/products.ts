export interface Product {
  id: string;
  name: string;
  store: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  expiresAt: Date;
  category: string;
  image: string;
  description: string;
  quantity: number;
  lat: number;
  lng: number;
  distance?: number;
}

export interface Store {
  id: string;
  name: string;
  lat: number;
  lng: number;
  products: Product[];
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Lactel Milk 1.5%',
    store: 'Magnum',
    originalPrice: 850,
    discountedPrice: 450,
    discount: 47,
    expiresAt: new Date(Date.now() + 5 * 60 * 60 * 1000),
    category: 'Dairy',
    image: '/images/lactel.jpg',
    description: 'Fresh ultra-pasteurized Lactel milk. Near expiration date.',
    quantity: 3,
    lat: 43.23436,
    lng: 76.77789
  },
  {
    id: '2',
    name: 'Borodinsky Bread',
    store: 'Magnum Express',
    originalPrice: 250,
    discountedPrice: 120,
    discount: 52,
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
    category: 'Bakery',
    image: '/images/hleb.webp',
    description: 'Freshly baked rye bread from Magnum bakery.',
    quantity: 5,
    lat: 43.21854,
    lng: 76.84276
  },
  {
    id: '3',
    name: 'Caesar Salad',
    store: 'Magnum Express',
    originalPrice: 1200,
    discountedPrice: 600,
    discount: 50,
    expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
    category: 'Salads',
    image: '/images/cezar.webp',
    description: 'Ready-to-eat salad with chicken, parmesan, and dressing.',
    quantity: 4,
    lat: 43.23745,
    lng: 76.82450
  },
  {
    id: '4',
    name: 'Fruit Basket (Apples & Pears)',
    store: 'Magnum Express',
    originalPrice: 2500,
    discountedPrice: 1100,
    discount: 56,
    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000),
    category: 'Produce',
    image: '/images/korzina.webp',
    description: 'Seasonal fruit mix: local apples and ripe pears.',
    quantity: 2,
    lat: 43.20372,
    lng: 76.61965
  },
  {
    id: '5',
    name: 'Cream Cheese 200g',
    store: 'Magnum Express',
    originalPrice: 1100,
    discountedPrice: 550,
    discount: 50,
    expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
    category: 'Dairy',
    image: '/images/cheese.webp',
    description: 'Soft creamy cheese, perfect for breakfast.',
    quantity: 6,
    lat: 43.23918,
    lng: 76.84172
  },
  {
    id: '6',
    name: 'Danone Strawberry Yogurt',
    store: 'Magnum Super',
    originalPrice: 450,
    discountedPrice: 220,
    discount: 51,
    expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000),
    category: 'Dairy',
    image: '/images/yogurt.jpg',
    description: 'Smooth yogurt with strawberry flavor.',
    quantity: 8,
    lat: 43.22277,
    lng: 76.78372
  },
  {
    id: '7',
    name: 'Butter Croissant',
    store: 'Magnum Express',
    originalPrice: 350,
    discountedPrice: 150,
    discount: 57,
    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    category: 'Bakery',
    image: '/images/croissant.png',
    description: 'Fresh French croissant with butter.',
    quantity: 10,
    lat: 43.23918,
    lng: 76.84172
  },
  {
    id: '8',
    name: 'Coca-Cola',
    store: 'Magnum Super',
    originalPrice: 900,
    discountedPrice: 450,
    discount: 50,
    expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
    category: 'Drinks',
    image: '/images/cocacola.jpg',
    description: 'Refreshing carbonated drink.',
    quantity: 5,
    lat: 43.22591,
    lng: 76.86747
  },
  {
    id: '9',
    name: 'Mixed Nuts',
    store: 'Magnum Super',
    originalPrice: 1500,
    discountedPrice: 750,
    discount: 50,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    category: 'Snacks',
    image: '/images/nuts.jpeg',
    description: 'Mix of almonds, cashews, and hazelnuts.',
    quantity: 7,
    lat: 43.20558,
    lng: 76.81620
  },
  {
    id: '10',
    name: 'DaDa Orange Juice',
    store: 'Magnum Super',
    originalPrice: 1200,
    discountedPrice: 600,
    discount: 50,
    expiresAt: new Date(Date.now() + 5 * 60 * 60 * 1000),
    category: 'Drinks',
    image: '/images/dada.jpg',
    description: 'Natural orange juice with no additives.',
    quantity: 6,
    lat: 43.22591,
    lng: 76.86747
  }
];

export const categories = [
  'All Categories',
  'Bakery',
  'Produce',
  'Dairy',
  'Ready Meals',
  'Salads',
  'Drinks',  
  'Snacks' 
];