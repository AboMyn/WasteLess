import type { Product } from '../data/products';
import { useEffect, useMemo, useState } from 'react';
import { calculateDistance } from '../utils/distance';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Search, Flame, Clock, Star, Heart, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { getStoredProducts } from '../utils/productStorage';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'motion/react';

export function Landing() {
  
  const storedProducts = getStoredProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [productsWithDistance, setProductsWithDistance] = useState<Product[]>(getStoredProducts());
    const nearbyStores = new Set(
    productsWithDistance
      .filter((product: any) => product.distance !== undefined && product.distance <= 10)
      .map((product: any) => product.store)
  ).size;
  const nearbyProducts = productsWithDistance.filter(
    (product: Product) =>
      product.distance !== undefined && product.distance <= 10
  );

  useEffect(() => {
  const storedProducts = getStoredProducts();

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      const updated = storedProducts.map((product: any) => ({
        ...product,
        distance: calculateDistance(userLat, userLng, product.lat, product.lng),
      }));

      setProductsWithDistance(updated);
    },
    () => {
      setProductsWithDistance(storedProducts);
    }
  );
}, []);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) return [];

    return productsWithDistance.filter((product: Product) =>
      product.name.toLowerCase().includes(query)
    );
  }, [searchQuery, productsWithDistance]);

  const trendingProducts = productsWithDistance.slice(0, 4);
  const endingSoonProducts = productsWithDistance.slice(4, 8);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full mb-5">
              <Flame className="w-4 h-4" />
              <span className="text-sm font-medium">Hot deals near you today</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
              Find discounted food before it sells out
            </h1>

            <p className="text-lg text-green-50 mb-7">
              Fresh products, lower prices, quick reservations — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/marketplace">
                <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100 gap-2">
                  Browse deals
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <Link to="/map">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 gap-2">
                  <MapPin className="w-4 h-4" />
                  View map
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border shadow-sm">
            <p className="text-sm text-gray-500">Today’s deals</p>
            <h3 className="text-2xl font-bold">{productsWithDistance.length}</h3>
          </div>

          <div className="bg-white rounded-2xl p-5 border shadow-sm">
            <p className="text-sm text-gray-500">Average discount</p>
            <h3 className="text-2xl font-bold">
              {Math.round(
                productsWithDistance.reduce((sum: number, p: any) => sum + p.discount, 0) /
                  productsWithDistance.length
              )}%
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-5 border shadow-sm">
            <p className="text-sm text-gray-500">Stores within 10 km</p>
            <h3 className="text-2xl font-bold">{nearbyStores}</h3>
          </div>

          <div className="bg-white rounded-2xl p-5 border shadow-sm">
            <p className="text-sm text-gray-500">Reserved today</p>
            <h3 className="text-2xl font-bold">126</h3>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl border shadow-sm p-4">
          <div className="w-full flex items-center gap-3 border rounded-xl px-4 py-3">
            <Search className="w-5 h-5 text-gray-400" />

            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search milk, bread, salad, juice..."
              className="w-full outline-none bg-transparent"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Search Results */}
      {searchQuery && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold">Search results</h2>
              <p className="text-gray-500">
                {filteredProducts.length} products found for “{searchQuery}”
              </p>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white border rounded-2xl p-10 text-center text-gray-500">
              No products found
            </div>
          )}
        </section>
      )}

      {!searchQuery && (
        <>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Flame className="w-6 h-6 text-orange-500" />
                  Trending deals
                </h2>
                <p className="text-gray-500">Popular products users are reserving now</p>
              </div>

              <Link to="/marketplace">
                <Button variant="outline" className="gap-2">
                  View all
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-3xl border shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Clock className="w-6 h-6 text-green-600" />
                      Ending soon
                    </h2>
                    <p className="text-gray-500">Reserve before these deals disappear</p>
                  </div>

                  <Link to="/marketplace">
                    <Button variant="ghost">See more</Button>
                  </Link>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {endingSoonProducts.map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-green-50 rounded-3xl border shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-3">Recommended for you</h2>
                <p className="text-gray-600 mb-5">
                  Based on your profile activity, these deals may be interesting.
                </p>

                <div className="space-y-4">
                  <Link to="/marketplace?discount=50">
                    <div className="flex items-start gap-3 bg-white rounded-2xl p-4 border hover:shadow-md hover:-translate-y-0.5 transition cursor-pointer">
                      <Star className="w-5 h-5 text-yellow-500 mt-1" />
                      <div>
                        <h3 className="font-semibold">Best discount today</h3>
                        <p className="text-sm text-gray-500">Products with 50–60% off</p>
                      </div>
                    </div>
                  </Link>

                  <Link to="/marketplace?sort=nearest&radius=10">
                    <div className="flex items-start gap-3 bg-white rounded-2xl p-4 border hover:shadow-md hover:-translate-y-0.5 transition cursor-pointer">
                      <MapPin className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <h3 className="font-semibold">Near your location</h3>
                        <p className="text-sm text-gray-500">Show closest products first</p>
                      </div>
                    </div>
                  </Link>

                  <Link to="/profile">
                    <div className="flex items-start gap-3 bg-white rounded-2xl p-4 border hover:shadow-md hover:-translate-y-0.5 transition cursor-pointer">
                      <Heart className="w-5 h-5 text-red-500 mt-1" />
                      <div>
                        <h3 className="font-semibold">Saved items</h3>
                        <p className="text-sm text-gray-500">Check products you liked before</p>
                      </div>
                    </div>
                  </Link>
                </div>

                <Link to="/map">
                  <Button className="w-full mt-6 bg-green-600 hover:bg-green-700">
                    Find nearby deals
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}