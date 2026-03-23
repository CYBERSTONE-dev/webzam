import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck, RefreshCw, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart, clearDirectBuy } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    clearDirectBuy();
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-16 rounded-[4rem] border border-gray-100 shadow-xl shadow-gray-200/50 max-w-2xl mx-auto"
        >
          <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-10 font-medium text-lg">Looks like you haven't added any prescriptions to your shopping cart yet. Let's find some deals!</p>
          <Link
            to="/catalog"
            className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all inline-flex items-center shadow-xl shadow-blue-200"
          >
            Start Shopping <ArrowRight className="ml-2 h-6 w-6" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-2 sm:pb-20">
      <div className="bg-white border-b border-gray-100 py-3 sm:py-4">
        <div className="max-w-2xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-gray-900">Cart</span>
            </div>
            <button 
              onClick={() => { if(confirm('Clear all items from cart?')) clearCart(); }}
              className="text-red-500 text-xs font-bold hover:underline"
              aria-label="Clear all items from cart"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-4xl font-black text-gray-900">Your Cart</h1>
          <span className="bg-white px-3 py-1.5 sm:px-6 sm:py-2 rounded-full border border-gray-200 font-black text-gray-600 text-xs sm:text-sm">
            {cartItems.length} Items
          </span>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div 
                key={item.id} 
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-2xl sm:rounded-[2rem] border border-gray-100 shadow-sm group"
              >
                <Link to={`/product/${item.id}`} className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[8px] sm:text-[10px] text-blue-600 font-black uppercase tracking-widest bg-blue-50 px-1.5 sm:px-2 py-0.5 rounded-md truncate">{Array.isArray(item.category) ? item.category[0] : item.category}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 sm:p-2 rounded-xl bg-gray-50 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
                      aria-label={`Remove ${item.title} from cart`}
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                    </button>
                  </div>
                  <Link to={`/product/${item.id}`} className="block font-black text-gray-900 text-sm sm:text-base lg:text-xl mb-1 sm:mb-2 hover:text-blue-600 transition-colors truncate">
                    {item.title}
                  </Link>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-sm sm:text-lg lg:text-2xl font-black text-gray-900">₹{(item.price ?? (item as any).sellingPrice ?? 0)}</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 bg-gray-50 rounded-xl sm:rounded-2xl p-1.5 sm:p-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 sm:p-1.5 hover:bg-white rounded-lg sm:rounded-xl transition-all text-gray-400 hover:text-gray-900"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                      </button>
                      <span className="font-black w-5 sm:w-6 text-center text-sm sm:text-base">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 sm:p-1.5 hover:bg-white rounded-lg sm:rounded-xl transition-all text-gray-400 hover:text-gray-900"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-4 sm:mt-6">
          <div className="bg-white p-4 sm:p-6 lg:p-10 rounded-2xl sm:rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50">
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <div className="flex justify-between text-sm sm:text-base text-gray-500 font-bold">
                <span>Subtotal</span>
                <span className="text-gray-900">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base text-gray-500 font-bold">
                <span>Shipping</span>
                <span className="text-emerald-600 font-black uppercase text-xs">Free</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base text-gray-500 font-bold">
                <span>Tax (GST)</span>
                <span className="text-gray-900">Included</span>
              </div>
              <div className="border-t border-gray-100 pt-3 sm:pt-4 lg:pt-6 flex justify-between items-end">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-[8px] sm:text-[10px]">Total</span>
                <div className="text-xl sm:text-2xl lg:text-4xl font-black text-gray-900">₹{cartTotal}</div>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-6 lg:mt-10 space-y-3 sm:space-y-4">
              <button
                onClick={handleCheckout}
                className="block w-full bg-blue-600 text-white text-center py-3 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base lg:text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95"
                aria-label="Proceed to checkout"
              >
                Checkout
              </button>
              <Link
                to="/catalog"
                className="block w-full bg-gray-50 text-gray-600 text-center py-3 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base lg:text-lg hover:bg-gray-100 transition-all"
              >
                Continue Shopping
              </Link>
            </div>
            
            <div className="mt-4 sm:mt-6 lg:mt-10 pt-4 sm:pt-6 lg:pt-10 border-t border-gray-100">
              <div className="flex items-center justify-center space-x-3 sm:space-x-4 opacity-30 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-3 sm:h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-4 sm:h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" alt="UPI" className="h-3 sm:h-4" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 mt-3 sm:mt-4 rounded-2xl sm:rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="font-black text-gray-900 text-sm sm:text-base mb-3 sm:mb-4">Have a Coupon?</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Code" 
                className="flex-1 bg-gray-50 border-none rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-sm sm:text-base"
              />
              <button className="bg-gray-900 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-black text-sm hover:bg-blue-600 transition-all" aria-label="Apply coupon code">Apply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
