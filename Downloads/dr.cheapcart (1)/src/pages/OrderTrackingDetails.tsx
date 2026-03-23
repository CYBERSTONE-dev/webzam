import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Copy, CheckCircle, Truck, Package, Clock } from 'lucide-react';

interface OrderData {
  id: string;
  userId: string;
  productId: string;
  productTitle: string;
  productImage: string;
  price: number;
  quantity: number;
  category: string[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: 'cod' | 'upi' | 'razorpay';
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: number;
}

export const OrderTrackingDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId]);

  const fetchOrder = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      const orderDoc = await getDoc(doc(db, 'orders', id));
      
      if (orderDoc.exists()) {
        setOrder({ id: orderDoc.id, ...orderDoc.data() } as OrderData);
      } else {
        setError('Order not found');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const copyOrderId = () => {
    if (order) {
      navigator.clipboard.writeText(order.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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

  const currentStep = order ? getStatusStep(order.status) : -1;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-500';
      case 'shipped': return 'bg-blue-500';
      case 'processing': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-200';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-500 font-bold">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[2rem] p-8 md:p-12 text-center max-w-md shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-10 w-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-500 mb-6">{error || 'The order you are looking for does not exist.'}</p>
          <Link to="/track-order" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/track-order" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              ←
            </Link>
            <div>
              <h1 className="text-xl font-black text-gray-900">Order Tracking</h1>
              <button 
                onClick={copyOrderId}
                className="text-sm text-gray-500 flex items-center gap-1 hover:text-blue-600 transition-colors group"
              >
                #{order.id.slice(-8).toUpperCase()}
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-bold capitalize ${
            order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' :
            order.status === 'shipped' ? 'bg-blue-50 text-blue-600' :
            order.status === 'cancelled' ? 'bg-red-50 text-red-600' :
            'bg-yellow-50 text-yellow-600'
          }`}>
            {order.status}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 mb-6">
          <div className={`bg-gradient-to-r ${getStatusBg(order.status)} p-8 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-1">Order Status</p>
                <h2 className="text-3xl font-black capitalize">{order.status}</h2>
                <p className="text-white/70 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-1">Total Amount</p>
                <p className="text-3xl font-black">₹{order.totalAmount}</p>
              </div>
            </div>
          </div>

          {order.status !== 'cancelled' && (
            <div className="p-8">
              <div className="relative mb-8">
                <div className="absolute top-6 left-0 right-0 h-2 bg-gray-100 rounded-full"></div>
                <div 
                  className={`absolute top-6 left-0 h-2 rounded-full transition-all duration-700 ${getStatusColor(order.status)}`}
                  style={{ width: `${Math.min(100, (currentStep / 3) * 100)}%` }}
                ></div>
                
                <div className="relative flex justify-between">
                  {[
                    { icon: Package, label: 'Ordered', step: 0 },
                    { icon: Clock, label: 'Processed', step: 1 },
                    { icon: Truck, label: 'Shipped', step: 2 },
                    { icon: CheckCircle, label: 'Delivered', step: 3 }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${
                        currentStep >= item.step 
                          ? 'bg-emerald-500 text-white shadow-lg' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <span className={`font-bold text-sm text-center ${
                        currentStep >= item.step ? 'text-gray-900' : 'text-gray-400'
                      }`}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`rounded-2xl p-4 flex items-center gap-4 ${
                order.status === 'delivered' ? 'bg-emerald-50' :
                order.status === 'shipped' ? 'bg-blue-50' :
                'bg-yellow-50'
              }`}>
                <div className={`p-3 rounded-xl ${
                  order.status === 'delivered' ? 'bg-emerald-100' :
                  order.status === 'shipped' ? 'bg-blue-100' :
                  'bg-yellow-100'
                }`}>
                  {order.status === 'delivered' ? <CheckCircle className="h-6 w-6 text-emerald-600" /> :
                   order.status === 'shipped' ? <Truck className="h-6 w-6 text-blue-600" /> :
                   <Package className="h-6 w-6 text-yellow-600" />}
                </div>
                <div>
                  <p className={`font-bold ${
                    order.status === 'delivered' ? 'text-emerald-800' :
                    order.status === 'shipped' ? 'text-blue-800' :
                    'text-yellow-800'
                  }`}>
                    {order.status === 'delivered' ? 'Your order has been delivered!' :
                     order.status === 'shipped' ? 'Your order is on the way!' :
                     order.status === 'processing' ? 'Your order is being prepared!' :
                     'Order received!'}
                  </p>
                  <p className={`text-sm ${
                    order.status === 'delivered' ? 'text-emerald-600' :
                    order.status === 'shipped' ? 'text-blue-600' :
                    'text-yellow-600'
                  }`}>
                    {order.status === 'shipped' ? 'Estimated delivery in 4-8 business days' :
                     order.status === 'delivered' ? `Delivered on ${new Date(order.createdAt + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}` :
                     'We will update you once shipped'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {order.status === 'cancelled' && (
            <div className="p-8">
              <div className="bg-red-50 rounded-2xl p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-red-100">
                  <Package className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="font-bold text-red-800">Order Cancelled</p>
                  <p className="text-sm text-red-600">This order has been cancelled.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Ordered
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <img 
                src={order.productImage} 
                alt={order.productTitle} 
                className="w-24 h-24 rounded-xl object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-lg">{order.productTitle}</h4>
                <p className="text-gray-500 text-sm">₹{order.price} × {order.quantity}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                  {Array.isArray(order.category) ? order.category.join(', ') : order.category}
                </p>
              </div>
              <div className="text-right">
                <p className="font-black text-2xl text-gray-900">₹{order.totalAmount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-black text-gray-900">Shipping Address</h3>
          </div>
          <div className="p-6">
            <div className="space-y-1">
              <p className="font-bold text-gray-900 text-lg">{order.shippingAddress.fullName}</p>
              <p className="text-gray-600">{order.shippingAddress.street}</p>
              <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}</p>
              <p className="text-gray-500 flex items-center gap-2 mt-3">
                {order.shippingAddress.phone}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-black text-gray-900">Payment Details</h3>
          </div>
          <div className="p-6 grid grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1">Method</p>
              <p className="font-bold text-gray-900 capitalize">{order.paymentMethod}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1">Status</p>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold ${
                order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
              }`}>
                {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-[2rem] p-6 md:p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">Contact our support team for any questions about your order.</p>
          <Link to="/contact" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all inline-flex items-center gap-2">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};
