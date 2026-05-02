import type { Product } from '../data/products';
import { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { categories } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { calculateDistance } from '../utils/distance';
import { useSearchParams } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { getStoredProducts } from '../utils/productStorage';


export function Marketplace() {
  const [searchParams] = useSearchParams();
  const radiusParam = searchParams.get('radius');
const discountParam = searchParams.get('discount');
const sortParam = searchParams.get('sort');
  const storedProducts = getStoredProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [maxDistance, setMaxDistance] = useState(30);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [showFilters, setShowFilters] = useState(false);
  const [productsWithDistance, setProductsWithDistance] = useState<Product[]>(getStoredProducts());
  const [locationAllowed, setLocationAllowed] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const updatedProducts = storedProducts.map((product: Product) => ({
          ...product,
          distance: calculateDistance(
            userLat,
            userLng,
            product.lat,
            product.lng
          ),
        }));

        setProductsWithDistance(updatedProducts);
        setLocationAllowed(true);
      },
      () => {
        // если пользователь запретил геолокацию
        setProductsWithDistance(storedProducts);
        setLocationAllowed(false);
      }
    );
  }, []);

  const filteredProducts = useMemo(() => {
    return productsWithDistance.filter((product: Product) => {
      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !product.store.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All Categories' && product.category !== selectedCategory) {
        return false;
      }

      if (
        locationAllowed &&
        product.distance !== undefined &&
        product.distance > maxDistance
      ) {
        return false;
      }
      // Price filter
      if (product.discountedPrice > maxPrice) {
        return false;
      }
      if (discountParam && product.discount < Number(discountParam)) {
        return false;
      }
      if (
        radiusParam &&
        product.distance !== undefined &&
        product.distance > Number(radiusParam)
      ) {
        return false;
      }

      return true;
    });
  }, [productsWithDistance, searchQuery, selectedCategory, maxDistance, maxPrice, locationAllowed]);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortParam === 'nearest') {
      return (a.distance ?? 9999) - (b.distance ?? 9999);
    }

    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Food Marketplace
          </h1>
          <p className="text-lg text-gray-600">
            Discover amazing deals on quality food near you
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-6 mb-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for food or stores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base bg-gray-50 border-0"
              />
            </div>

            {/* Filter Toggle Button (Mobile) */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} found
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2 lg:hidden"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
            </div>

            {/* Filters */}
            <div className={`grid lg:grid-cols-3 gap-4 ${showFilters ? 'grid' : 'hidden lg:grid'}`}>
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-gray-50 border-0 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Distance Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Max Distance: {maxDistance} km
                </label>
                <div className="pt-2">
                  <Slider
                    value={[maxDistance]}
                    onValueChange={(values) => setMaxDistance(values[0])}
                    min={0.5}
                    max={30}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Max Price: {maxPrice} ₸
                </label>
                <div className="pt-2">
                  <Slider
                    value={[maxPrice]}
                    onValueChange={(values) => setMaxPrice(values[0])}
                    min={1}
                    max={10000}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-border p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">No items found</h3>
              <p className="text-gray-600">
                Try adjusting your filters or search terms to find what you're looking for.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All Categories');
                  setMaxDistance(5);
                  setMaxPrice(3000);
                }}
                variant="outline"
              >
                Clear filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
