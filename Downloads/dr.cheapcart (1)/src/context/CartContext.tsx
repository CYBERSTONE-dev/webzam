import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { useToast } from './ToastContext';

interface CartContextType {
  cartItems: CartItem[];
  directBuyItem: CartItem | null;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setDirectBuy: (product: Product) => void;
  clearDirectBuy: () => void;
  cartTotal: number;
  toast: { message: string; visible: boolean };
  showToast: (message: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cart');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.filter((item: any) => item && item.id) : [];
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const { showToast } = useToast();

  const showCartToast = (message: string) => {
    setToast({ message, visible: true });
    showToast(message, 'success');
    setTimeout(() => {
      setToast({ message: '', visible: false });
    }, 3000);
  };

  const [directBuyItem, setDirectBuyItem] = useState<CartItem | null>(() => {
    try {
      const saved = localStorage.getItem('directBuy');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (directBuyItem) {
      localStorage.setItem('directBuy', JSON.stringify(directBuyItem));
    } else {
      localStorage.removeItem('directBuy');
    }
  }, [directBuyItem]);

  const addToCart = (product: Product) => {
    if (!product.id) {
      console.error("Product has no ID:", product);
      return;
    }
    
    const availableStock = product.stock || 0;
    const productTitle = product.title || 'Product';
    
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        const newQuantity = existing.quantity + 1;
        if (newQuantity > availableStock) {
          showToast(`Only ${availableStock} items available in stock`, 'error');
          return prev;
        }
        showCartToast(`${productTitle} quantity updated in cart!`);
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      }
      if (availableStock < 1) {
        showToast('This item is out of stock', 'error');
        return prev;
      }
      showCartToast(`${productTitle} added to cart!`);
      // Create a clean cart item with all needed fields
      const cartItem: CartItem = {
        ...product,
        id: product.id,
        title: product.title || 'Unknown Product',
        image: product.image || '',
        price: product.price ?? (product as any).sellingPrice ?? 0,
        quantity: 1,
        category: product.category || [],
        stock: product.stock || 0,
        description: product.description || '',
        trending: product.trending || false,
        featured: product.featured || false,
        sku: product.sku || '',
        soldCount: product.soldCount || 0,
        viewCount: product.viewCount || 0,
        originalUrl: product.originalUrl,
        createdAt: product.createdAt || Date.now()
      };
      return [...prev, cartItem];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    const item = cartItems.find(i => i.id === productId);
    if (item) {
      const availableStock = item.stock || 0;
      if (quantity > availableStock) {
        showToast(`Only ${availableStock} items available in stock`, 'error');
        return;
      }
    }
    
    setCartItems(prev =>
      prev.map(item => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCartItems([]);

  const setDirectBuy = (product: Product) => {
    if (!product.id) {
      console.error("Product has no ID:", product);
      return;
    }
    
    const quantity = (product as any).quantity || 1;
    
    const cartItem: CartItem = {
      ...product,
      id: product.id,
      title: product.title || 'Unknown Product',
      image: product.image || '',
      price: product.price ?? (product as any).sellingPrice ?? 0,
      quantity: quantity,
      category: product.category || [],
      stock: product.stock || 0,
      description: product.description || '',
      trending: product.trending || false,
      featured: product.featured || false,
      sku: product.sku || '',
      soldCount: product.soldCount || 0,
      viewCount: product.viewCount || 0,
      originalUrl: product.originalUrl,
      createdAt: product.createdAt || Date.now()
    };
    setDirectBuyItem(cartItem);
  };

  const clearDirectBuy = () => {
    setDirectBuyItem(null);
    localStorage.removeItem('directBuy');
  };

  const cartTotal = cartItems.reduce((acc, item) => {
    const itemPrice = item.price ?? (item as any).sellingPrice ?? 0;
    return acc + itemPrice * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ cartItems, directBuyItem, addToCart, removeFromCart, updateQuantity, clearCart, setDirectBuy, clearDirectBuy, cartTotal, toast, showToast }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
