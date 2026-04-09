import { User, ShoppingBag, Heart, TrendingDown, Leaf, Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { products } from '../data/products';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { DiscountBadge } from '../components/DiscountBadge';
import { Link } from 'react-router';

// Mock user data
const userData = {
  name: 'Sarah Johnson',
  email: 'sarah.johnson@email.com',
  memberSince: 'January 2024',
  totalSavings: 342.50,
  itemsSaved: 47,
  co2Reduced: 23.5,
};

// Mock order history
const orderHistory = [
  {
    id: '1',
    product: products[0],
    reservedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'completed',
  },
  {
    id: '2',
    product: products[4],
    reservedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'completed',
  },
  {
    id: '3',
    product: products[2],
    reservedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    status: 'active',
  },
];

// Mock saved items
const savedItems = [products[1], products[5], products[7]];

export function Profile() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-8 mb-8 text-white"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
              <User className="w-12 h-12 text-white" />
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">{userData.name}</h1>
              <p className="text-green-100 mb-4">{userData.email}</p>
              <p className="text-sm text-green-100">Member since {userData.memberSince}</p>
            </div>

            {/* Edit Button */}
            <Button variant="secondary" className="gap-2">
              <User className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Savings</p>
                <p className="text-2xl font-bold text-gray-900">${userData.totalSavings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Items Saved</p>
                <p className="text-2xl font-bold text-gray-900">{userData.itemsSaved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">CO₂ Reduced</p>
                <p className="text-2xl font-bold text-gray-900">{userData.co2Reduced} kg</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Member Status</p>
                <p className="text-2xl font-bold text-gray-900">Gold</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="bg-white border border-border p-1 rounded-xl shadow-sm">
              <TabsTrigger value="orders" className="gap-2">
                <ShoppingBag className="w-4 h-4" />
                Order History
              </TabsTrigger>
              <TabsTrigger value="saved" className="gap-2">
                <Heart className="w-4 h-4" />
                Saved Items
              </TabsTrigger>
            </TabsList>

            {/* Order History Tab */}
            <TabsContent value="orders" className="mt-6">
              <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="text-xl font-semibold text-gray-900">Your Orders</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Track your past and active reservations
                  </p>
                </div>

                <div className="divide-y divide-border">
                  {orderHistory.map((order) => (
                    <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="relative w-full sm:w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <ImageWithFallback
                            src={order.product.image}
                            alt={order.product.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <DiscountBadge discount={order.product.discount} size="sm" />
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {order.product.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {order.product.store}
                              </p>
                            </div>
                            <div
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                order.status === 'completed'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-orange-100 text-orange-700'
                              }`}
                            >
                              {order.status === 'completed' ? 'Completed' : 'Active'}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                            <span>
                              Reserved: {order.reservedAt.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                            <span className="hidden sm:inline text-gray-300">•</span>
                            <span className="font-semibold text-gray-900">
                              ${order.product.discountedPrice.toFixed(2)}
                            </span>
                            <span className="text-gray-500 line-through">
                              ${order.product.originalPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Action Button */}
                        {order.status === 'active' && (
                          <Link to={`/product/${order.product.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Saved Items Tab */}
            <TabsContent value="saved" className="mt-6">
              <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="text-xl font-semibold text-gray-900">Saved Items</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Items you've bookmarked for later
                  </p>
                </div>

                <div className="p-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedItems.map((product) => (
                      <Link key={product.id} to={`/product/${product.id}`}>
                        <div className="bg-white rounded-xl overflow-hidden border border-border hover:shadow-md transition-all duration-300 group">
                          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                            <ImageWithFallback
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 right-2">
                              <DiscountBadge discount={product.discount} />
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">{product.store}</p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-semibold text-gray-900">
                                ${product.discountedPrice.toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                ${product.originalPrice.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
