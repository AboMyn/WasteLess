export interface Product {
  id: string;
  name: string;
  store: string;
  distance: number;
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
    name: 'Artisan Sourdough Bread',
    store: 'Urban Bakery',
    distance: 0.5,
    originalPrice: 8.99,
    discountedPrice: 3.99,
    discount: 56,
    expiresAt: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1555932450-31a8aec2adf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGJyZWFkJTIwYmFrZXJ5fGVufDF8fHx8MTc3NTY2MTU3N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Freshly baked artisan sourdough bread made with organic flour. Perfect for sandwiches or toasting.',
    quantity: 3,
    lat: 40.7580,
    lng: -73.9855
  },
  {
    id: '2',
    name: 'Organic Mixed Vegetables',
    store: 'Green Market',
    distance: 1.2,
    originalPrice: 12.99,
    discountedPrice: 5.99,
    discount: 54,
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
    category: 'Produce',
    image: 'https://images.unsplash.com/photo-1634731201932-9bd92839bea2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBwcm9kdWNlfGVufDF8fHx8MTc3NTU4NDA3NHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Fresh organic mixed vegetables including carrots, peppers, and zucchini. Great for stir-fry or roasting.',
    quantity: 5,
    lat: 40.7489,
    lng: -73.9680
  },
  {
    id: '3',
    name: 'Fresh Fruit Basket',
    store: 'Fresh Foods Co.',
    distance: 0.8,
    originalPrice: 15.99,
    discountedPrice: 7.99,
    discount: 50,
    expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
    category: 'Produce',
    image: 'https://images.unsplash.com/photo-1650960129664-d7adcf7e3dcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0JTIwb3JnYW5pY3xlbnwxfHx8fDE3NzU2NzYzMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Assorted fresh fruits including apples, oranges, and berries. Perfect for healthy snacking.',
    quantity: 4,
    lat: 40.7614,
    lng: -73.9776
  },
  {
    id: '4',
    name: 'Artisan Cheese Selection',
    store: 'Dairy Delights',
    distance: 1.5,
    originalPrice: 18.99,
    discountedPrice: 8.99,
    discount: 53,
    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1741522226997-a34b5a45c648?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWlyeSUyMG1pbGslMjBjaGVlc2V8ZW58MXx8fHwxNzc1NjI1ODQxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Premium selection of artisan cheeses including brie, cheddar, and gouda.',
    quantity: 2,
    lat: 40.7505,
    lng: -73.9934
  },
  {
    id: '5',
    name: 'Gourmet Prepared Meal',
    store: 'City Kitchen',
    distance: 0.6,
    originalPrice: 14.99,
    discountedPrice: 6.99,
    discount: 53,
    expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
    category: 'Ready Meals',
    image: 'https://images.unsplash.com/photo-1763219805214-91fa634e6006?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVwYXJlZCUyMG1lYWwlMjByZXN0YXVyYW50fGVufDF8fHx8MTc3NTY3NjMwNXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Delicious prepared meal with grilled chicken, roasted vegetables, and quinoa.',
    quantity: 6,
    lat: 40.7589,
    lng: -73.9851
  },
  {
    id: '6',
    name: 'Deli Sandwich Platter',
    store: 'Corner Deli',
    distance: 0.3,
    originalPrice: 11.99,
    discountedPrice: 4.99,
    discount: 58,
    expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours
    category: 'Deli',
    image: 'https://images.unsplash.com/photo-1666819604716-7b60a604bb76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5kd2ljaCUyMGRlbGklMjBmb29kfGVufDF8fHx8MTc3NTY3NjMwNnww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Fresh deli sandwiches with premium meats, cheese, and vegetables.',
    quantity: 4,
    lat: 40.7628,
    lng: -73.9800
  },
  {
    id: '7',
    name: 'Fresh Garden Salad',
    store: 'Healthy Bowl',
    distance: 0.9,
    originalPrice: 9.99,
    discountedPrice: 4.49,
    discount: 55,
    expiresAt: new Date(Date.now() + 7 * 60 * 60 * 1000), // 7 hours
    category: 'Salads',
    image: 'https://images.unsplash.com/photo-1654458804670-2f4f26ab3154?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxhZCUyMGZyZXNoJTIwaGVhbHRoeXxlbnwxfHx8fDE3NzU1NzkyNzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Crisp garden salad with mixed greens, tomatoes, cucumbers, and house dressing.',
    quantity: 8,
    lat: 40.7557,
    lng: -73.9732
  },
  {
    id: '8',
    name: 'Pastry & Dessert Box',
    store: 'Sweet Treats Bakery',
    distance: 1.1,
    originalPrice: 16.99,
    discountedPrice: 7.99,
    discount: 53,
    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1737700088850-d0b53f9d39ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0cnklMjBkZXNzZXJ0JTIwYmFrZXJ5fGVufDF8fHx8MTc3NTY3NjMwN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Assorted pastries and desserts including croissants, Danish pastries, and cookies.',
    quantity: 5,
    lat: 40.7542,
    lng: -73.9866
  }
];

export const categories = [
  'All Categories',
  'Bakery',
  'Produce',
  'Dairy',
  'Ready Meals',
  'Deli',
  'Salads'
];
