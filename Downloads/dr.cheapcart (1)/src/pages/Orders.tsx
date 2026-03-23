import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Order } from '../types';
import { Package, ChevronRight, ShoppingBag, Clock, Eye, RotateCcw, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';

interface ReturnRequest {
  id: string;
  orderId: string;
  orderItemId: string;
  itemTitle: string;
  itemImage: string;
  itemPrice: number;
  reason: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  createdAt: number;
}

export const Orders = () => {
  const { user, profile } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [orderDetail, setOrderDetail] = useState<Order | null>(null);

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'pending': return 0;
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'delivered': return 'from-emerald-500 to-emerald-600';
      case 'shipped': return 'from-blue-500 to-blue-600';
      case 'processing': return 'from-yellow-400 to-yellow-500';
      case 'cancelled': return 'from-red-500 to-red-600';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-500';
      case 'shipped': return 'bg-blue-500';
      case 'processing': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-50 text-emerald-600';
      case 'shipped': return 'bg-blue-50 text-blue-600';
      case 'processing': return 'bg-yellow-50 text-yellow-600';
      case 'cancelled': return 'bg-red-50 text-red-600';
      case 'pending': return 'bg-amber-50 text-amber-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const getReturnStatusForItem = (orderId: string, itemId: string) => {
    return returnRequests.find(r => r.orderId === orderId && r.orderItemId === itemId);
  };

  const handleViewOrderDetail = (order: Order) => {
    setOrderDetail(order);
    setShowOrderDetail(true);
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchReturnRequests();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReturnRequests = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, 'returnRequests'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      setReturnRequests(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReturnRequest)));
    } catch (error) {
      console.error('Error fetching return requests:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-500 mb-6">Please login to view your orders</p>
          <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all inline-block">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-8">
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-black text-gray-900">My Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage your orders</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => <div key={i} className="h-32 bg-white rounded-3xl animate-pulse"></div>)}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer"
                onClick={() => handleViewOrderDetail(order)}
              >
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <ShoppingBag className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Order ID</p>
                      <p className="font-bold text-gray-900">#{order.id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:block">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Date</p>
                      <p className="font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Total</p>
                      <p className="font-bold text-blue-600">₹{order.totalAmount}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <img 
                    src={(order as any).productImage || order.items?.[0]?.image} 
                    alt={(order as any).productTitle || order.items?.[0]?.title} 
                    className="w-20 h-20 rounded-lg object-cover" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{(order as any).productTitle || order.items?.[0]?.title}</p>
                    <p className="text-gray-500 text-xs">₹{(order as any).price || order.items?.[0]?.price} × {(order as any).quantity || order.items?.[0]?.quantity}</p>
                    {order.items?.[0] && getReturnStatusForItem(order.id, order.items[0].id) && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${getStatusColor(getReturnStatusForItem(order.id, order.items[0].id)?.status || '')}`}>
                        Return: {getReturnStatusForItem(order.id, order.items[0].id)?.status}
                      </span>
                    )}
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-700 transition-all flex items-center gap-2">
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-16 rounded-3xl border border-gray-100 text-center">
            <Clock className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-400 text-sm mb-4">Start shopping to see your orders here.</p>
            <Link to="/catalog" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all inline-block">
              Start Shopping
            </Link>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showOrderDetail && orderDetail && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] max-w-2xl w-full overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className={`bg-gradient-to-r ${getStatusBg(orderDetail.status)} p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={() => setShowOrderDetail(false)}
                    className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-bold capitalize">
                    {orderDetail.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Order ID</p>
                    <p className="text-2xl font-black">#{orderDetail.id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="text-3xl font-black">₹{orderDetail.totalAmount}</p>
                  </div>
                </div>
              </div>

              {orderDetail.status !== 'cancelled' && (
                <div className="p-6 bg-gray-50">
                  <div className="relative mb-6">
                    <div className="absolute top-5 left-0 right-0 h-2 bg-gray-200 rounded-full"></div>
                    <div 
                      className={`absolute top-5 left-0 h-2 rounded-full transition-all duration-700 ${getProgressBarColor(orderDetail.status)}`}
                      style={{ width: `${Math.min(100, (getStatusStep(orderDetail.status) / 3) * 100)}%` }}
                    ></div>
                    <div className="relative flex justify-between">
                      {[
                        { icon: Clock, label: 'Ordered', step: 0 },
                        { icon: Package, label: 'Processed', step: 1 },
                        { icon: Package, label: 'Shipped', step: 2 },
                        { icon: Package, label: 'Delivered', step: 3 }
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                            getStatusStep(orderDetail.status) >= item.step 
                              ? 'bg-emerald-500 text-white shadow-lg' 
                              : 'bg-gray-200 text-gray-400'
                          }`}>
                            <item.icon className="h-5 w-5" />
                          </div>
                          <span className={`text-xs font-bold ${
                            getStatusStep(orderDetail.status) >= item.step ? 'text-gray-900' : 'text-gray-400'
                          }`}>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="p-6">
                <h3 className="text-lg font-black text-gray-900 mb-4">Product Ordered</h3>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  <img 
                    src={(orderDetail as any).productImage || orderDetail.items?.[0]?.image || ''} 
                    alt={(orderDetail as any).productTitle || orderDetail.items?.[0]?.title || ''} 
                    className="w-24 h-24 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-lg">{(orderDetail as any).productTitle || orderDetail.items?.[0]?.title || 'N/A'}</p>
                    <p className="text-gray-500">₹{(orderDetail as any).price || orderDetail.items?.[0]?.price || 0} × {(orderDetail as any).quantity || orderDetail.items?.[0]?.quantity || 1}</p>
                    <p className="font-black text-xl text-blue-600 mt-2">₹{orderDetail.totalAmount}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100">
                <h3 className="text-lg font-black text-gray-900 mb-4">Shipping Address</h3>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="font-bold text-gray-900">{(orderDetail as any).shippingAddress?.fullName || orderDetail.shippingAddress?.fullName}</p>
                  <p className="text-gray-600 text-sm mt-1">{(orderDetail as any).shippingAddress?.street || orderDetail.shippingAddress?.street}</p>
                  <p className="text-gray-600 text-sm">{(orderDetail as any).shippingAddress?.city || orderDetail.shippingAddress?.city}, {(orderDetail as any).shippingAddress?.state || orderDetail.shippingAddress?.state} - {(orderDetail as any).shippingAddress?.zipCode || orderDetail.shippingAddress?.zipCode}</p>
                  <p className="text-gray-500 text-sm mt-2">{(orderDetail as any).shippingAddress?.phone || orderDetail.shippingAddress?.phone}</p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100">
                <h3 className="text-lg font-black text-gray-900 mb-4">Payment Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-400 text-xs font-bold uppercase mb-1">Method</p>
                    <p className="font-bold text-gray-900 capitalize">{(orderDetail as any).paymentMethod || orderDetail.paymentMethod || 'COD'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-400 text-xs font-bold uppercase mb-1">Status</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                      (orderDetail as any).paymentStatus === 'paid' || orderDetail.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {(orderDetail as any).paymentStatus || orderDetail.paymentStatus || 'pending'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <p className="text-gray-400 text-xs font-bold uppercase">Order Date</p>
                <p className="font-bold text-gray-900">{new Date(orderDetail.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>

              <div className="p-6 border-t border-gray-100 flex gap-4">
                <button 
                  onClick={() => setShowOrderDetail(false)}
                  className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
