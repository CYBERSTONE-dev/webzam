import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, LogOut, Info, PhoneCall, Home as HomeIcon, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartItems } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <HomeIcon className="h-4 w-4" /> },
    { name: 'Shop', path: '/catalog', icon: <ShoppingBag className="h-4 w-4" /> },
    { name: 'FAQ', path: '/faq', icon: <Info className="h-4 w-4" /> },
    { name: 'About Us', path: '/about', icon: <Info className="h-4 w-4" /> },
    { name: 'Contact Us', path: '/contact', icon: <PhoneCall className="h-4 w-4" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`hidden lg:block sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-2' : 'bg-white py-3'} border-b border-gray-100`}>
      <div className="max-w-7xl mx-auto px-4 xl:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900">
              dr.<span className="text-blue-600">cheapcart</span>
            </span>
          </Link>

          {/* Search Bar - Always Visible */}
          <div className="flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                className="w-full bg-gray-50 border-2 border-gray-100 focus:border-blue-500 rounded-2xl py-3 pl-12 pr-12 text-sm outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all"
                aria-label="Search products"
              >
                Search
              </button>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Cart */}
            <Link to="/cart" className="p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors relative" aria-label={`Shopping cart with ${cartItems.reduce((acc, item) => acc + item.quantity, 0)} items`}>
              <ShoppingCart className="h-6 w-6" aria-hidden="true" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-white" aria-hidden="true">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </Link>

            {/* User / Login */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/dashboard" className="p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors" aria-label="User dashboard">
                  <User className="h-6 w-6" aria-hidden="true" />
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all">
                    Admin
                  </Link>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-100 transition-all">
                <User className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}

            {/* Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Bottom Navigation Links */}
        <div className="flex items-center space-x-1 mt-3 pb-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center space-x-2 ${
                isActive(link.path) 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span>{link.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}>
          <div 
            className="absolute top-0 right-0 w-96 h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-black tracking-tighter">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200" aria-label="Close menu">
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center space-x-4 p-4 rounded-2xl text-lg font-bold transition-all ${
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
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4 mb-2">My Account</p>
                  <Link to="/dashboard" className="flex items-center space-x-4 p-4 rounded-2xl text-gray-600 font-bold hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
                    <User className="h-5 w-5 text-gray-400" />
                    <span>Profile</span>
                  </Link>
                  <Link to="/track-order" className="flex items-center space-x-4 p-4 rounded-2xl text-gray-600 font-bold hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
                    <ShoppingCart className="h-5 w-5 text-gray-400" />
                    <span>Track Order</span>
                  </Link>
                </div>
              </div>

              <div className="pt-6 mt-auto space-y-3">
                {user ? (
                  <button 
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 p-4 rounded-2xl font-bold hover:bg-red-100 transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <Link 
                    to="/login" 
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white p-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>Login / Register</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
