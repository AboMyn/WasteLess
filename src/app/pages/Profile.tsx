import { User, ShoppingBag, Heart, TrendingDown, Leaf, Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { products } from '../data/products';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { DiscountBadge } from '../components/DiscountBadge';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';


export function Profile() {

  const [isEditing,setIsEditing] = useState(false)
  const savedUser = JSON.parse(localStorage.getItem('user') || '{}');

    const [userData, setUserData] = useState({
      name: savedUser.name || 'User',
      email: savedUser.email || 'user@email.com',
      memberSince: savedUser.memberSince || 'January 2024'
    });
  const [orderHistory, setOrderHistory] = useState(() => {
    return JSON.parse(localStorage.getItem('orders') || '[]');
  });
  const totalOrderAmount = orderHistory.reduce(
    (sum: number, order: any) => sum + order.product.discountedPrice,
    0
  );

  const totalSavings = orderHistory.reduce(
      (sum: any, order: any) =>
        sum + (order.product.originalPrice - order.product.discountedPrice),
      0
    );
    let memberStatus = 'Bronze';

      if (totalSavings >= 5000) {
        memberStatus = 'Gold';
      } else if (totalSavings >= 2000) {
        memberStatus = 'Silver';
      }

    const itemsSaved = orderHistory.length;

    const co2Reduced = itemsSaved * 0.2;

  const handleDeleteOrder = (id: string) => {
    const updatedOrders = orderHistory.filter((order: any) => order.id !== id);

    setOrderHistory(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const [formData, setFormData] = useState(userData);
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
            <Button 
              variant="secondary" 
              className="gap-2"
              onClick={() => {
                setFormData(userData);
                setIsEditing(true);
              }}
            >
              <User className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </motion.div>
        {isEditing && (
          <div className="mt-6 bg-white p-6 rounded-xl border">
            <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded"
            />

            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full mb-3 p-2 border rounded"
            />

            <button
              onClick={() => {
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

                const updatedUser = {
                  ...userData,
                  name: formData.name.trim(),
                  email: formData.email.trim().toLowerCase(),
                };

                setUserData(updatedUser);

                const savedUser = JSON.parse(localStorage.getItem('user') || '{}');

                localStorage.setItem(
                  'user',
                  JSON.stringify({
                    ...savedUser,
                    ...updatedUser,
                  })
                );

                toast.success('Profile updated successfully');
                setIsEditing(false);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded mr-2"
            >
              Save
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="border px-4 py-2 rounded"
            >
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
                <p className="text-2xl font-bold text-gray-900">{totalSavings.toLocaleString()} ₸</p>
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

            {/* Order History Tab */}
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
                  {orderHistory.map((order: any) => (
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
                              Reserved: {new Date(order.reservedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
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

                        {/* Action Buttons */}
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
