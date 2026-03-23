import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Address, Order } from '../types';
import { Truck, ShieldCheck, CheckCircle2, ChevronRight, MapPin, Phone, User, Smartphone, CreditCard as CardIcon, Wallet, Plus, Minus, Trash2, ShoppingCart, Copy, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const Checkout = () => {
  const { cartItems, directBuyItem, clearCart, updateQuantity, removeFromCart, clearDirectBuy } = useCart();
  const { user, profile, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderIds, setCreatedOrderIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [authLoading, user, navigate]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const checkoutItems = directBuyItem ? [directBuyItem] : cartItems;
  const checkoutTotal = checkoutItems.reduce((acc, item) => {
    const itemPrice = item.price ?? (item as any).sellingPrice ?? 0;
    return acc + itemPrice * item.quantity;
  }, 0);

  const [address, setAddress] = useState<Address>({
    fullName: profile?.displayName || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    type: 'home'
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'razorpay'>('cod');

  const updateStockOnOrder = async () => {
    for (const item of checkoutItems) {
      const productRef = doc(db, 'products', item.id);
      const productSnap = await getDoc(productRef);
      
      if (productSnap.exists()) {
        const currentStock = productSnap.data().stock || 0;
        const newStock = Math.max(0, currentStock - item.quantity);
        
        await updateDoc(productRef, { 
          stock: newStock,
          soldCount: (productSnap.data().soldCount || 0) + item.quantity
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user?.uid) {
        throw new Error('You must be logged in to place an order');
      }

      console.log('Placing order with data:', {
        userId: user.uid,
        itemsCount: checkoutItems.length,
        total: checkoutTotal,
        paymentMethod,
        address
      });

      console.log('Checkout items:', JSON.stringify(checkoutItems, (key, value) => value === undefined ? null : value, 2));

      const cleanAddress = {
        fullName: address.fullName || '',
        phone: address.phone || '',
        street: address.street || '',
        city: address.city || '',
        state: address.state || '',
        zipCode: address.zipCode || '',
        country: address.country || 'India',
        type: address.type || 'home'
      };

      console.log('Creating separate orders for each product...');
      
      const newOrderIds: string[] = [];
      
      for (const item of checkoutItems) {
        const orderData = {
          userId: user.uid,
          productId: item.id || '',
          productTitle: item.title || 'Unknown Product',
          productImage: item.image || '',
          price: item.price ?? 0,
          quantity: item.quantity ?? 1,
          category: item.category || [],
          totalAmount: (item.price ?? 0) * (item.quantity ?? 1),
          status: 'pending',
          paymentStatus: 'pending',
          paymentMethod,
          shippingAddress: cleanAddress,
          createdAt: Date.now()
        };

        const orderRef = await addDoc(collection(db, 'orders'), orderData);
        newOrderIds.push(orderRef.id);
        console.log(`Order created with ID: ${orderRef.id} for product: ${item.title}`);
      }
      
      console.log('All orders created successfully');
      setCreatedOrderIds(newOrderIds);
      
      console.log('Updating stock...');
      await updateStockOnOrder();
      console.log('Stock updated');
      
      setOrderSuccess(true);
      clearCart();
      clearDirectBuy();
    } catch (error: any) {
      console.error('Order error:', error);
      const errorMessage = error?.message || error?.code || 'Unknown error';
      showToast(`Failed to place order: ${errorMessage}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (orderSuccess) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-16 rounded-[4rem] border border-gray-100 shadow-xl shadow-gray-200/50 max-w-2xl mx-auto"
        >
          <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4">Order Placed!</h2>
          <p className="text-gray-500 mb-6 font-medium text-lg">Thank you for shopping with dr.cheapcart. Your order has been received and is being processed by our pharmacy team.</p>
          
          {createdOrderIds.length > 0 && (
            <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-left">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Your Order IDs (click to copy)</p>
              <div className="space-y-2">
                {createdOrderIds.map((id, index) => (
                  <button
                    key={id}
                    onClick={() => copyOrderId(id)}
                    className="w-full flex items-center justify-between bg-white px-4 py-3 rounded-xl hover:bg-emerald-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400">#{index + 1}</span>
                      <span className="font-mono font-bold text-gray-900">{id.slice(-8).toUpperCase()}</span>
                    </div>
                    {copiedId === id ? (
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">Use these IDs to track each product order status</p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-xl shadow-gray-200"
            >
              View My Orders
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-50 text-gray-600 px-10 py-5 rounded-2xl font-black text-lg hover:bg-gray-100 transition-all"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-16 rounded-[4rem] border border-gray-100 shadow-xl shadow-gray-200/50 max-w-2xl mx-auto"
        >
          <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingCart className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-10 font-medium text-lg">Add some products to your cart or buy directly from product page.</p>
          <Link
            to="/catalog"
            className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all inline-flex items-center shadow-xl shadow-blue-200"
          >
            Start Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100 py-4 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            {!directBuyItem && <Link to="/cart" className="hover:text-blue-600 transition-colors">Cart</Link>}
            {!directBuyItem && <ChevronRight className="h-3 w-3" />}
            <span className="text-gray-900">Checkout</span>
          </div>
        </div>
      </div>

      {directBuyItem && (
        <div className="bg-blue-50 border-b border-blue-100 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-blue-700 text-sm font-bold flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Direct Purchase - {directBuyItem.quantity} item{directBuyItem.quantity > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-6 sm:mb-12">Checkout</h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Info */}
            <section className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-gray-100 shadow-sm space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-black text-gray-900 flex items-center">
                  <div className="bg-blue-50 p-2 sm:p-3 rounded-xl sm:rounded-2xl mr-3 sm:mr-4 text-blue-600">
                    <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  Shipping
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center">
                    <User className="h-3 w-3 mr-2" /> Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-gray-50 border-none rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 text-sm sm:text-base"
                    value={address.fullName || ''}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center">
                    <Phone className="h-3 w-3 mr-2" /> Phone
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="w-full bg-gray-50 border-none rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 text-sm sm:text-base"
                    value={address.phone || ''}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center">
                    <MapPin className="h-3 w-3 mr-2" /> Address
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="House No, Street, Area"
                    className="w-full bg-gray-50 border-none rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 text-sm sm:text-base"
                    value={address.street || ''}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center">
                    City
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Mumbai"
                    className="w-full bg-gray-50 border-none rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 text-sm sm:text-base"
                    value={address.city || ''}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center">
                    ZIP
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="400001"
                    className="w-full bg-gray-50 border-none rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 text-sm sm:text-base"
                    value={address.zipCode || ''}
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar with Order Summary & Payment */}
          <div className="lg:col-span-1 space-y-4">
            {/* Order Summary */}
            <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50">
              <h2 className="text-lg font-black text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {checkoutItems.map((item) => {
                  const itemPrice = item.price ?? (item as any).sellingPrice ?? 0;
                  return (
                  <div key={item.id} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-[10px] truncate">{item.title}</p>
                      <p className="text-[9px] text-gray-400">₹{itemPrice} × {item.quantity}</p>
                    </div>
                    <span className="font-black text-gray-900 text-[10px]">₹{itemPrice * item.quantity}</span>
                  </div>
                  );
                })}
              </div>
              
              <div className="space-y-2 border-t border-gray-100 pt-3">
                <div className="flex justify-between text-gray-500 font-bold text-xs">
                  <span>Subtotal</span>
                  <span className="text-gray-900">₹{checkoutTotal}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-bold text-xs">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-black uppercase text-[9px]">Free</span>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <span className="text-gray-400 font-bold uppercase text-[8px]">Total</span>
                  <span className="text-xl font-black text-gray-900">₹{checkoutTotal}</span>
                </div>
              </div>
            </div>

            {/* Payment Method - Small Boxes */}
            <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-sm font-black text-gray-900 mb-3">Payment Method</h2>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cod', label: 'COD', icon: Wallet },
                  { id: 'upi', label: 'UPI', icon: Smartphone },
                  { id: 'razorpay', label: 'Card', icon: CardIcon }
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      paymentMethod === method.id 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                    }`}
                  >
                    <method.icon className={`h-4 w-4 mx-auto mb-1 ${paymentMethod === method.id ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className={`text-[10px] font-black ${paymentMethod === method.id ? 'text-blue-600' : 'text-gray-600'}`}>{method.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading || checkoutItems.length === 0}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 active:scale-95"
            >
              {loading ? 'Processing...' : 'Place Order Now'}
            </button>
            
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="text-[9px] font-bold uppercase tracking-widest">Secure</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
