import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, CreditCard, ArrowRight, Package, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

interface BuyNowPopupProps {
  product: Product;
  onClose: () => void;
}

export const BuyNowPopup: React.FC<BuyNowPopupProps> = ({ product, onClose }) => {
  const navigate = useNavigate();
  const { setDirectBuy, addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleBuyNow = () => {
    setIsAnimating(true);
    const buyItem = { ...product };
    (buyItem as any).quantity = quantity;
    setDirectBuy(buyItem);
    setTimeout(() => {
      navigate('/checkout');
    }, 300);
  };

  const handleAddToCart = () => {
    setIsAnimating(true);
    const cartItem = { ...product };
    (cartItem as any).quantity = quantity;
    addToCart(cartItem);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const total = (product.price ?? 0) * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Ready to Order!</h2>
          </div>
          <p className="text-blue-100">Complete your purchase in just one click</p>
        </div>

        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
              {product.image ? (
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
              <p className="text-sm text-gray-500 mb-1">{product.category?.[0] || 'Product'}</p>
              <p className="text-xl font-bold text-blue-600">${product.price?.toFixed(2)}</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 font-bold text-xl flex items-center justify-center transition-colors"
              >
                -
              </button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 font-bold text-xl flex items-center justify-center transition-colors"
              >
                +
              </button>
              <span className="text-sm text-gray-500 ml-auto">{product.stock || 0} available</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount</span>
              <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleBuyNow}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg mb-3"
          >
            <CreditCard className="w-5 h-5" />
            Buy Now
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={handleAddToCart}
            className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all mb-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        <div className="px-6 pb-4 flex items-center justify-center gap-2 text-xs text-gray-400">
          <Package className="w-4 h-4" />
          <span>Free shipping on orders over $50</span>
        </div>
      </div>
    </div>
  );
};
