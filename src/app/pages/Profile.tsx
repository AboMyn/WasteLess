import { User, ShoppingBag, TrendingDown, Leaf, Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { DiscountBadge } from '../components/DiscountBadge';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '../lib/api';
import type { ApiOrder, UserPublic } from '../lib/api';

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserPublic | null>(null);
  const [orderHistory, setOrderHistory] = useState<ApiOrder[]>([]);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    Promise.all([api.users.me(), api.orders.getAll()])
      .then(([user, orders]) => {
        setUserData(user);
        setFormData({ name: user.name, email: user.email });
        setOrderHistory(orders);
      })
      .catch(() => {
        // Fallback to localStorage if API is unavailable
        const saved = JSON.parse(localStorage.getItem('user') || '{}') as Partial<UserPublic>;
        if (saved.name) {
          setUserData(saved as UserPublic);
          setFormData({ name: saved.name ?? '', email: saved.email ?? '' });
        }
        setOrderHistory(JSON.parse(localStorage.getItem('orders') || '[]'));
      })
      .finally(() => setLoadingProfile(false));
  }, []);

  const totalOrderAmount = orderHistory.reduce(
    (sum, order) => sum + order.product.discountedPrice,
    0,
  );
  const totalSavings = orderHistory.reduce(
    (sum, order) => sum + (order.product.originalPrice - order.product.discountedPrice),
    0,
  );
  const itemsSaved = orderHistory.length;
  const co2Reduced = itemsSaved * 0.2;

  let memberStatus = 'Bronze';
  if (totalSavings >= 5000) memberStatus = 'Gold';
  else if (totalSavings >= 2000) memberStatus = 'Silver';

  const handleDeleteOrder = async (id: string) => {
    try {
      await api.orders.cancel(id);
      setOrderHistory((prev) => prev.filter((o) => o.id !== id));
      toast.success('Order cancelled');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to cancel order');
    }
  };

  const handleSaveProfile = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    if (formData.name.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }
    if (!/^[A-Za-zА-Яа-яЁё\s]+$/.test(formData.name.trim())) {
      toast.error('Name can contain only letters');
      return;
    }
    if (!emailRegex.test(formData.email.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      const updated = await api.users.update({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
      });
      setUserData(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

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
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
              <User className="w-12 h-12 text-white" />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">{userData?.name ?? '—'}</h1>
              <p className="text-green-100 mb-4">{userData?.email ?? '—'}</p>
              <p className="text-sm text-green-100">
                Member since {userData?.memberSince ?? '—'}
              </p>
            </div>

            <Button
              variant="secondary"
              className="gap-2"
              onClick={() => {
                setFormData({ name: userData?.name ?? '', email: userData?.email ?? '' });
                setIsEditing(true);
              }}
            >
              <User className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </motion.div>

        {isEditing && (
          <div className="mt-6 bg-white p-6 rounded-xl border mb-8">
            <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full mb-3 p-2 border rounded"
              placeholder="Full name"
            />

            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full mb-3 p-2 border rounded"
              placeholder="Email"
            />

            <button
              onClick={handleSaveProfile}
              className="bg-green-600 text-white px-4 py-2 rounded mr-2"
            >
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="border px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        )}

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
                <p className="text-2xl font-bold text-gray-900">
                  {totalSavings.toLocaleString()} ₸
                </p>
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
                <p className="text-2xl font-bold text-gray-900">{itemsSaved}</p>
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
                <p className="text-2xl font-bold text-gray-900">{co2Reduced.toFixed(1)} kg</p>
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
                <p className="text-2xl font-bold text-gray-900">{memberStatus}</p>
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
            </TabsList>

            <TabsContent value="orders" className="mt-6">
              <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="text-xl font-semibold text-gray-900">Your Orders</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Track your past and active reservations
                  </p>
                  <p className="text-sm font-semibold text-green-700 mt-2">
                    Total order amount: {totalOrderAmount.toLocaleString()} ₸
                  </p>
                </div>

                <div className="divide-y divide-border">
                  {orderHistory.length === 0 && (
                    <p className="p-6 text-sm text-gray-500">No orders yet.</p>
                  )}
                  {orderHistory.map((order) => (
                    <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row gap-4">
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

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {order.product.name}
                              </h3>
                              <p className="text-sm text-gray-600">{order.product.store}</p>
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
                              Reserved:{' '}
                              {new Date(order.reservedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                            <span className="hidden sm:inline text-gray-300">•</span>
                            <span className="font-semibold text-gray-900">
                              {order.product.discountedPrice.toLocaleString()} ₸
                            </span>
                            <span className="text-gray-500 line-through">
                              {order.product.originalPrice.toLocaleString()} ₸
                            </span>
                          </div>
                        </div>

                        {order.status === 'active' && (
                          <div className="flex items-center gap-2">
                            <Link to={`/product/${order.product.id}`}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteOrder(order.id)}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
