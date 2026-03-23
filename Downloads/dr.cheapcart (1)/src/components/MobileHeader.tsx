import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, LogOut, Info, PhoneCall, Home as HomeIcon, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: <HomeIcon className="h-4 w-4" /> },
    { name: 'Shop', path: '/catalog', icon: <ShoppingBag className="h-4 w-4" /> },
    { name: 'FAQ', path: '/faq', icon: <Info className="h-4 w-4" /> },
    { name: 'About Us', path: '/about', icon: <Info className="h-4 w-4" /> },
    { name: 'Contact Us', path: '/contact', icon: <PhoneCall className="h-4 w-4" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalog?search=${encodeURIComponent(searchQuery)}`;
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setIsMenuOpen(true)} 
              className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <ShoppingCart className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-black tracking-tighter text-gray-900">
                dr.<span className="text-blue-600">cheapcart</span>
              </span>
            </Link>

            <div className="flex items-center space-x-1">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)} 
                className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="Toggle search"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
              </button>
              
              <Link to="/cart" className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors relative" aria-label={`Shopping cart with ${cartCount} items`}>
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center" aria-hidden="true">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {isSearchOpen && (
            <div className="mt-3 pb-1">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all"
                  aria-label="Search"
                >
                  Go
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}>
          <div 
            className="absolute top-0 left-0 w-80 h-full bg-white shadow-2xl animate-in slide-in-from-left duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-black tracking-tighter">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200" aria-label="Close menu">
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center space-x-3 p-3 rounded-xl text-base font-semibold transition-all ${
                      isActive(link.path) 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className={isActive(link.path) ? 'text-blue-600' : 'text-gray-400'}>
                      {link.icon}
                    </span>
                    <span>{link.name}</span>
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-gray-100 mt-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">My Account</p>
                  <Link to="/dashboard" className="flex items-center space-x-3 p-3 rounded-xl text-gray-600 font-semibold hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
                    <User className="h-4 w-4 text-gray-400" />
                    <span>Profile</span>
                  </Link>
                  <Link to="/track-order" className="flex items-center space-x-3 p-3 rounded-xl text-gray-600 font-semibold hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
                    <ShoppingCart className="h-4 w-4 text-gray-400" />
                    <span>Track Order</span>
                  </Link>
                </div>
              </div>

              <div className="pt-4 mt-auto space-y-3">
                {user ? (
                  <button 
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 p-3 rounded-xl font-semibold hover:bg-red-100 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <Link 
                    to="/login" 
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white p-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Login / Register</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
