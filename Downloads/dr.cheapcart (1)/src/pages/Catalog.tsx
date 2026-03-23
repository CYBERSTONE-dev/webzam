import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { Filter, ChevronDown, ShoppingCart, Search, Star, SlidersHorizontal, Grid, List, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ExpandableText } from '../components/ExpandableText';
import { motion } from 'motion/react';

export const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { addToCart } = useCart();

  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';
  const trendingFilter = searchParams.get('trending') === 'true';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let q;
        
        if (categoryFilter) {
          q = query(collection(db, 'products'), where('category', 'array-contains', categoryFilter));
        } else if (trendingFilter) {
          q = query(collection(db, 'products'), where('trending', '==', true));
        } else {
          q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        }

        const snap = await getDocs(q);
        let results = snap.docs.map(doc => ({ id: doc.id, ...doc.data() as Object } as Product));

        if (searchQuery) {
          results = results.filter(p => 
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        if (sortBy === 'price-low') results.sort((a, b) => a.price - b.price);
        if (sortBy === 'price-high') results.sort((a, b) => b.price - a.price);
        if (sortBy === 'popular') results.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));

        setProducts(results);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, categoryFilter, trendingFilter, sortBy]);

  const categories = ['Electronics', 'Fashion', 'Home', 'Beauty', 'Health', 'Toys'];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Catalog Header */}
      <div className="bg-white border-b border-gray-100 pt-8 md:pt-12 pb-6 md:pb-8 mb-6 md:mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center space-x-2 text-blue-600 font-bold uppercase tracking-widest text-xs mb-3">
                <Link to="/" className="hover:underline">Home</Link>
                <span>/</span>
                <span>Shop</span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-2">
                {searchQuery ? `Results for "${searchQuery}"` : categoryFilter || (trendingFilter ? 'Trending Now' : 'All Products')}
              </h1>
              <p className="text-gray-500 font-medium text-sm md:text-base">Showing {products.length} prescriptions for your shopping needs</p>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
              <div className="relative flex-1 md:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 pr-10 md:pr-12 focus:ring-2 focus:ring-blue-500 font-black text-gray-900 text-sm md:text-base w-full shadow-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 space-y-8 flex-shrink-0">
            <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="font-black text-gray-900 text-lg md:text-xl">Filters</h3>
                <SlidersHorizontal className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-black text-gray-900 mb-4 uppercase tracking-widest text-xs">Categories</h4>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setSearchParams({})}
                      className={`block w-full text-left px-4 py-2 rounded-xl transition-all font-bold ${!categoryFilter && !trendingFilter ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button 
                        key={cat}
                        onClick={() => setSearchParams({ category: cat })}
                        className={`block w-full text-left px-4 py-2 rounded-xl transition-all font-bold ${categoryFilter === cat ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h4 className="font-black text-gray-900 mb-4 uppercase tracking-widest text-xs">Quick Links</h4>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setSearchParams({ trending: 'true' })}
                      className={`block w-full text-left px-4 py-2 rounded-xl transition-all font-bold ${trendingFilter ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      Trending Now
                    </button>

                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse space-y-4 md:space-y-6">
                    <div className="bg-gray-200 aspect-square rounded-2xl md:rounded-[2.5rem]"></div>
                    <div className="space-y-2 md:space-y-3">
                      <div className="h-5 md:h-6 bg-gray-200 rounded-xl w-3/4"></div>
                      <div className="h-3 md:h-4 bg-gray-200 rounded-xl w-1/2"></div>
                      <div className="flex justify-between items-center pt-2 md:pt-4">
                        <div className="h-6 md:h-8 bg-gray-200 rounded-xl w-1/3"></div>
                        <div className="h-10 md:h-12 bg-gray-200 rounded-xl w-12"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8" : "space-y-4 md:space-y-6"}>
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={() => addToCart(product)} 
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl md:rounded-[3rem] py-16 md:py-32 text-center border border-gray-100 shadow-sm">
                <div className="bg-gray-50 w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Search className="h-8 w-8 md:h-10 md:w-10 text-gray-300" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2">No prescriptions found</h3>
                <p className="text-gray-500 font-medium mb-6 md:mb-8 text-sm md:text-base">Try adjusting your search or filters to find what you need.</p>
                <button 
                  onClick={() => setSearchParams({})}
                  className="bg-blue-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-black text-sm md:text-base hover:bg-blue-700 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, onAddToCart, viewMode }: { product: Product; onAddToCart: () => void; viewMode: 'grid' | 'list' }) => {
  const navigate = useNavigate();
  const oldProduct = product as any;
  const displayPrice = product.price ?? oldProduct.sellingPrice ?? 0;
  const displayComparativePrice = product.comparativePrice ?? oldProduct.basePrice ?? 0;
  
  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/product/${product.id}`);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm group flex flex-col md:flex-row p-4 md:p-6 gap-4 md:gap-8 hover:shadow-xl transition-all duration-500"
      >
        <Link to={`/product/${product.id}`} className="w-full md:w-48 lg:w-64 aspect-square md:aspect-square rounded-2xl md:rounded-3xl overflow-hidden flex-shrink-0">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        </Link>
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-blue-600 font-black uppercase tracking-widest">{product.category}</span>
            <div className="flex items-center text-yellow-400">
              <Star className="h-3 w-3 fill-current" />
              <span className="text-gray-400 text-xs font-bold ml-1">4.8</span>
            </div>
          </div>
          <Link to={`/product/${product.id}`} className="block font-black text-gray-900 text-lg md:text-2xl mb-2 md:mb-4 group-hover:text-blue-600 transition-colors">
            {product.title}
          </Link>
          <ExpandableText text={product.description} className="text-gray-500 font-medium mb-4 md:mb-6 text-sm md:text-base" />
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col">
              <span className="text-xl md:text-3xl font-black text-gray-900">₹{displayPrice}</span>
              {displayComparativePrice && displayComparativePrice > displayPrice && (
                <span className="text-xs md:text-sm text-gray-400 line-through font-bold">₹{displayComparativePrice}</span>
              )}
            </div>
            <div className="flex gap-2 md:gap-3">
              <button 
                onClick={handleBuyNow}
                className="bg-blue-600 text-white px-4 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm hover:bg-blue-700 transition-all"
                aria-label={`Buy ${product.title}`}
              >
                Buy
              </button>
              <button
                onClick={(e) => { e.preventDefault(); onAddToCart(); }}
                className="bg-gray-900 text-white px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm hover:bg-blue-600 transition-all flex items-center gap-2"
                aria-label={`Add ${product.title} to cart`}
              >
                <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
                <span className="hidden md:inline">Cart</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm group transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 md:top-4 md:left-4 flex flex-col gap-2">
          {displayComparativePrice && displayComparativePrice > displayPrice && (
            <div className="bg-red-600 text-white text-[9px] md:text-[10px] font-black px-2 md:px-3 py-1 md:py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              {Math.round((displayComparativePrice - displayPrice) / displayComparativePrice * 100)}% OFF
            </div>
          )}
          <div className="bg-white/90 backdrop-blur-md text-gray-900 text-[9px] md:text-[10px] font-black px-2 md:px-3 py-1 md:py-1.5 rounded-full uppercase tracking-widest shadow-lg">
            {Array.isArray(product.category) ? product.category[0] : product.category}
          </div>
        </div>
      </Link>
      <div className="p-4 md:p-6 lg:p-8">
        <Link to={`/product/${product.id}`} className="block font-black text-gray-900 text-sm md:text-lg mb-2 md:mb-3 truncate group-hover:text-blue-600 transition-colors">
          {product.title}
        </Link>
        <div className="flex items-center space-x-1 text-yellow-400 mb-4 md:mb-6">
          {[...Array(5)].map((_, i) => <Star key={i} className="h-2 w-2 md:h-3 md:w-3 fill-current" />)}
          <span className="text-gray-400 text-[10px] md:text-xs font-bold ml-1">(4.8)</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg md:text-2xl font-black text-gray-900">₹{displayPrice}</span>
            {displayComparativePrice && displayComparativePrice > displayPrice && (
              <span className="text-[10px] md:text-xs text-gray-400 line-through font-bold">₹{displayComparativePrice}</span>
            )}
          </div>
          <div className="flex gap-1.5 md:gap-2">
            <button
              onClick={handleBuyNow}
              className="bg-blue-600 text-white px-2 py-2 md:px-3 md:py-3 rounded-lg md:rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg group-hover:scale-110"
              aria-label={`Buy ${product.title}`}
            >
              Buy
            </button>
            <button
              onClick={(e) => { e.preventDefault(); onAddToCart(); }}
              className="bg-gray-900 text-white p-2 md:p-3 rounded-lg md:rounded-xl hover:bg-blue-600 transition-all shadow-lg group-hover:scale-110"
              aria-label={`Add ${product.title} to cart`}
            >
              <ShoppingCart className="h-3.5 w-3.5 md:h-4 md:w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
