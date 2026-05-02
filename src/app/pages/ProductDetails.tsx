import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Store, Package, Clock } from 'lucide-react';
import { getStoredProducts, saveStoredProducts } from '../utils/productStorage';
import { Button } from '../components/ui/button';
import { CountdownTimer } from '../components/CountdownTimer';
import { DiscountBadge } from '../components/DiscountBadge';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { calculateDistance } from '../utils/distance';
import { api } from '../lib/api';

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const storedProducts = getStoredProducts();
  const product = storedProducts.find((p: { id: string }) => p.id === id);
  const [distance, setDistance] = useState<number | null>(null);
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    if (!product) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDistance(
          calculateDistance(
            position.coords.latitude,
            position.coords.longitude,
            product.lat,
            product.lng,
          ),
        );
      },
      () => setDistance(null),
    );
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
          <Link to="/marketplace">
            <Button variant="outline">Back to marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleReserve = async () => {
    if (product.quantity <= 0) {
      toast.error('This product is out of stock');
      return;
    }

    setReserving(true);
    try {
      const { product: updated } = await api.products.reserve(product.id);

      // Sync quantity in localStorage
      const current = getStoredProducts();
      saveStoredProducts(
        current.map((p: { id: string }) =>
          p.id === product.id ? { ...p, quantity: updated.quantity } : p,
        ),
      );

      toast.success('Reserved successfully', {
        description: `${product.name} added to your orders`,
      });
      setTimeout(() => navigate('/profile'), 1000);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to reserve');
    } finally {
      setReserving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/marketplace">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to marketplace
          </Button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-lg aspect-[4/3]">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <DiscountBadge discount={product.discount} size="lg" />
              </div>
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl font-medium text-gray-700">
                {product.quantity} left in stock
              </div>
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
              {product.category}
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600">{product.description}</p>
            </div>

            {/* Price */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  {product.discountedPrice.toLocaleString()} ₸
                </span>
                <span className="text-xl text-gray-500 line-through">
                  {product.originalPrice.toLocaleString()} ₸
                </span>
              </div>
              <p className="text-sm text-green-600 font-medium">
                Save {(product.originalPrice - product.discountedPrice).toLocaleString()} ₸ (
                {product.discount}% off)
              </p>
            </div>

            {/* Countdown */}
            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Time remaining</h3>
                  <p className="text-sm text-gray-600">Hurry before it expires!</p>
                </div>
              </div>
              <div className="mt-3">
                <CountdownTimer expiresAt={product.expiresAt} size="lg" />
              </div>
            </div>

            {/* Store Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Store className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{product.store}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {distance !== null ? `${distance.toFixed(1)} km away` : 'Loading...'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Pickup only</h4>
                  <p className="text-sm text-gray-600">
                    Reserve now and pick up at the store before expiration
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleReserve}
              disabled={reserving || product.quantity <= 0}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60"
            >
              {reserving ? 'Reserving…' : product.quantity <= 0 ? 'Out of stock' : 'Reserve now'}
            </Button>
            <p className="text-sm text-gray-600 text-center">
              By reserving, you agree to pick up the item before expiration
            </p>
          </motion.div>
        </div>

        {/* Suggestions */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar deals nearby</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {storedProducts
              .filter((p: { id: string; category: string }) => p.id !== product.id && p.category === product.category)
              .slice(0, 4)
              .map((similarProduct: { id: string; name: string; image: string; discount: number; discountedPrice: number; originalPrice: number }) => (
                <Link key={similarProduct.id} to={`/product/${similarProduct.id}`}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border group">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <ImageWithFallback
                        src={similarProduct.image}
                        alt={similarProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        <DiscountBadge discount={similarProduct.discount} size="sm" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                        {similarProduct.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-semibold text-gray-900">
                          {similarProduct.discountedPrice.toLocaleString()} ₸
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {similarProduct.originalPrice.toLocaleString()} ₸
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
