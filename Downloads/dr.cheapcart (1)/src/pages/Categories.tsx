import React from 'react';
import { Link } from 'react-router-dom';
import { Laptop, Shirt, Home, Sparkles, Watch, Baby, ChevronRight } from 'lucide-react';

const categories = [
  { name: 'Fashion', slug: 'Fashion', icon: Shirt, color: 'bg-pink-50 text-pink-600', count: 124 },
  { name: 'Electronics', slug: 'Electronics', icon: Laptop, color: 'bg-blue-50 text-blue-600', count: 85 },
  { name: 'Home & Kitchen', slug: 'Home', icon: Home, color: 'bg-orange-50 text-orange-600', count: 210 },
  { name: 'Beauty & Care', slug: 'Beauty', icon: Sparkles, color: 'bg-purple-50 text-purple-600', count: 45 },
  { name: 'Accessories', slug: 'Accessories', icon: Watch, color: 'bg-emerald-50 text-emerald-600', count: 67 },
  { name: 'Kids & Toys', slug: 'Kids', icon: Baby, color: 'bg-yellow-50 text-yellow-600', count: 92 },
];

export const Categories = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-gray-900 mb-4">Browse by Category</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Explore our wide range of products organized by category to help you find exactly what you're looking for at the best prices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <Link 
            key={cat.name}
            to={`/catalog?category=${cat.slug}`}
            className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className={`${cat.color} p-5 rounded-2xl group-hover:scale-110 transition-transform`}>
                  <cat.icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{cat.name}</h3>
                  <p className="text-gray-400 text-sm font-medium">{cat.count} Products</p>
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded-full text-gray-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Featured Categories Section */}
      <div className="mt-24 bg-blue-600 rounded-[3rem] p-12 text-white overflow-hidden relative">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <h2 className="text-4xl font-black mb-6">Can't find what you're looking for?</h2>
            <p className="text-blue-100 text-lg mb-8">
              Our "doctors" are constantly adding new products to our catalog. Check back often for the latest arrivals in all categories.
            </p>
            <Link to="/catalog" className="inline-flex bg-white text-blue-600 px-8 py-4 rounded-2xl font-black hover:bg-blue-50 transition-all">
              Explore All Products
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl text-center">
              <span className="block text-3xl font-black mb-1">500+</span>
              <span className="text-blue-100 text-sm font-bold uppercase tracking-widest">Daily Deals</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl text-center">
              <span className="block text-3xl font-black mb-1">10k+</span>
              <span className="text-blue-100 text-sm font-bold uppercase tracking-widest">Customers</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl text-center">
              <span className="block text-3xl font-black mb-1">24/7</span>
              <span className="text-blue-100 text-sm font-bold uppercase tracking-widest">Support</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl text-center">
              <span className="block text-3xl font-black mb-1">100%</span>
              <span className="text-blue-100 text-sm font-bold uppercase tracking-widest">Secure</span>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-blue-400/20 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
};
