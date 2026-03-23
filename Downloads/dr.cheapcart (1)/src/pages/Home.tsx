import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { ShoppingCart, ArrowRight, Zap, Star, LayoutGrid, Percent, TrendingUp, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { TrustBanner } from '../components/TrustBanner';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);
  const [featuredBannerImages, setFeaturedBannerImages] = useState<string[]>(['', '', '']);
  const [bestSellerBannerImages, setBestSellerBannerImages] = useState<string[]>(['', '', '']);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [currentBestSellerIndex, setCurrentBestSellerIndex] = useState(0);
  const { addToCart } = useCart();

  const categoryRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const bestRef = useRef<HTMLDivElement>(null);
  const trendingRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === 'left' ? -280 : 280,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const qFeatured = query(collection(db, 'products'), where('featured', '==', true), limit(8));
      const qTrending = query(collection(db, 'products'), where('trending', '==', true), limit(12));
      const qBestSelling = query(collection(db, 'products'), limit(8));
      
      const [featuredSnap, trendingSnap, bestSellingSnap] = await Promise.all([
        getDocs(qFeatured),
        getDocs(qTrending),
        getDocs(qBestSelling)
      ]);

      setFeaturedProducts(featuredSnap.docs.map(doc => ({ id: doc.id, ...doc.data() as Object } as Product)));
      setTrendingProducts(trendingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() as Object } as Product)));
      setBestSellingProducts(bestSellingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() as Object } as Product)));

      const homePageDoc = await getDoc(doc(db, 'settings', 'homePage'));
      if (homePageDoc.exists()) {
        const data = homePageDoc.data();
        setFeaturedBannerImages(data.featuredImages || ['', '', '']);
        setBestSellerBannerImages(data.bestSellerImages || ['', '', '']);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const validFeaturedImages = featuredBannerImages.filter(img => img !== '');
    
    if (validFeaturedImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentFeaturedIndex((prev) => (prev + 1) % validFeaturedImages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [featuredBannerImages]);

  useEffect(() => {
    const validBestSellerImages = bestSellerBannerImages.filter(img => img !== '');
    
    if (validBestSellerImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentBestSellerIndex((prev) => (prev + 1) % validBestSellerImages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [bestSellerBannerImages]);

  return (
    <div className="space-y-12 md:space-y-16 lg:space-y-24 pb-12 md:pb-16 lg:pb-20">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] lg:h-[700px] flex items-center overflow-hidden bg-gray-950">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1920"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl text-white"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-600/20 backdrop-blur-md text-blue-400 px-4 py-2 md:px-5 md:py-2.5 rounded-2xl text-xs md:text-sm font-black mb-6 md:mb-8 border border-blue-500/30 uppercase tracking-widest">
              <Percent className="h-3 w-3 md:h-4 md:w-4" />
              <span>Prescribing the Best Deals Since 2024</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-black tracking-tighter mb-6 md:mb-8 leading-[0.9]">
              Your Shopping <span className="text-blue-500 italic font-serif">Specialist</span>.
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-400 mb-8 md:mb-10 max-w-xl leading-relaxed font-medium">
              dr.cheapcart diagnoses the market to find the highest quality products at the most affordable prices. Your satisfaction is our primary prescription.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              <Link
                to="/catalog"
                className="bg-blue-600 text-white px-8 py-4 md:px-10 md:py-5 rounded-2xl font-black text-base md:text-lg hover:bg-blue-700 transition-all flex items-center justify-center text-center shadow-2xl shadow-blue-900/40"
              >
                Start Shopping <ArrowRight className="ml-2 md:ml-3 h-5 w-5 md:h-6 md:w-6" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <TrustBanner />

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center space-x-2 text-blue-600 font-bold uppercase tracking-widest text-xs md:text-sm mb-1">
            <LayoutGrid className="h-3 w-3 md:h-4 md:w-4" />
            <span>Browse</span>
          </div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-gray-900">Shop by Category</h2>
        </div>
        <div className="relative group/cat">
          <button 
            onClick={() => scroll(categoryRef, 'left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover/cat:opacity-100 transition-opacity hover:bg-blue-600 hover:text-white -translate-x-2"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <div 
            ref={categoryRef}
            className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide"
          >
            {[
              { name: 'Health', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=200&h=200&fit=crop', alt: 'Health products and medicines' },
              { name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop', alt: 'Beauty and skincare products' },
              { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop', alt: 'Fashion and clothing items' },
              { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop', alt: 'Electronic devices and gadgets' },
              { name: 'Home', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop', alt: 'Home and kitchen essentials' },
              { name: 'Fitness', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop', alt: 'Fitness and sports equipment' },
            ].map((category, index) => (
              <Link 
                key={`${category.name}-${index}`}
                to={`/catalog?category=${category.name}`}
                className="group flex flex-col items-center text-center flex-shrink-0"
                aria-label={`Browse ${category.name} products`}
              >
                <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg group-hover:border-blue-500 group-hover:shadow-xl group-hover:shadow-blue-200 transition-all duration-300">
                  <img 
                    src={category.image} 
                    alt={category.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="mt-2 md:mt-3 font-bold text-gray-900 text-xs md:text-sm group-hover:text-blue-600 transition-colors">{category.name}</span>
              </Link>
            ))}
          </div>
          <button 
            onClick={() => scroll(categoryRef, 'right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 opacity-0 group/cat:opacity-100 transition-opacity hover:bg-blue-600 hover:text-white translate-x-2"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8 md:mb-12 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-600 font-bold uppercase tracking-widest text-xs mb-2">
              <Star className="h-3 w-3 md:h-4 md:w-4 fill-current" />
              <span>Handpicked</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900">Featured Products</h2>
          </div>
          <Link to="/catalog" className="hidden md:flex items-center space-x-2 bg-gray-50 px-5 py-3 rounded-2xl font-bold text-gray-600 hover:bg-blue-600 hover:text-white transition-all">
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="relative group/feat">
          <button 
            onClick={() => scroll(featuredRef, 'left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover/feat:opacity-100 -translate-x-3"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div 
            ref={featuredRef}
            className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide px-2"
          >
            {featuredProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[220px] lg:w-[260px]">
                <ProductCard product={product} onAddToCart={() => addToCart(product)} />
              </div>
            ))}
          </div>
          <button 
            onClick={() => scroll(featuredRef, 'right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover/feat:opacity-100 translate-x-3"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
        {featuredBannerImages.some(img => img !== '') && (
          <div className="mt-8 relative overflow-hidden rounded-2xl">
            <div className="relative h-48 md:h-64 overflow-hidden bg-gray-100 rounded-2xl">
              <AnimatePresence mode="wait">
                {featuredBannerImages.filter(img => img !== '').length > 0 && (
                  <motion.img
                    key={currentFeaturedIndex}
                    src={featuredBannerImages.filter(img => img !== '')[currentFeaturedIndex]}
                    alt="Featured Banner"
                    className="w-full h-full object-cover"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </AnimatePresence>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {featuredBannerImages.filter(img => img !== '').map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeaturedIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${currentFeaturedIndex === index ? 'bg-blue-600 w-6' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center md:text-left mb-8 md:mb-12">
          <div className="flex items-center justify-center md:justify-start space-x-2 text-emerald-600 font-bold uppercase tracking-widest text-xs md:text-sm mb-2">
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
            <span>Top Rated</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-2 md:mb-3">Best Selling Products</h2>
          <p className="text-gray-500 font-medium text-sm md:text-base">The most popular prescriptions from our lead doctors.</p>
        </div>
        <div className="relative group/best">
          <button 
            onClick={() => scroll(bestRef, 'left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover/best:opacity-100 -translate-x-3"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div 
            ref={bestRef}
            className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide px-2"
          >
            {bestSellingProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[220px] lg:w-[260px]">
                <ProductCard product={product} onAddToCart={() => addToCart(product)} />
              </div>
            ))}
          </div>
          <button 
            onClick={() => scroll(bestRef, 'right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover/best:opacity-100 translate-x-3"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
        {bestSellerBannerImages.some(img => img !== '') && (
          <div className="mt-8 relative overflow-hidden rounded-2xl">
            <div className="relative h-48 md:h-64 overflow-hidden bg-gray-100 rounded-2xl">
              <AnimatePresence mode="wait">
                {bestSellerBannerImages.filter(img => img !== '').length > 0 && (
                  <motion.img
                    key={currentBestSellerIndex}
                    src={bestSellerBannerImages.filter(img => img !== '')[currentBestSellerIndex]}
                    alt="Best Seller Banner"
                    className="w-full h-full object-cover"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </AnimatePresence>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {bestSellerBannerImages.filter(img => img !== '').map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBestSellerIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${currentBestSellerIndex === index ? 'bg-emerald-600 w-6' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Trending Section */}
      <section className="bg-gray-50 py-10 md:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 md:mb-12 gap-4">
            <div className="text-center md:text-left w-full md:w-auto">
              <div className="flex items-center justify-center md:justify-start space-x-2 text-red-600 font-bold uppercase tracking-widest text-xs md:text-sm mb-2">
                <Zap className="h-3 w-3 md:h-4 md:w-4 fill-current" />
                <span>Hot Right Now</span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900">Trending Products</h2>
            </div>
            <Link to="/catalog?trending=true" className="w-full md:w-auto text-center bg-white border border-gray-200 px-5 py-3 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-bold text-sm text-gray-900 hover:bg-gray-900 hover:text-white transition-all shadow-sm">
              Explore
            </Link>
          </div>
          <div className="relative group/trend">
            <button 
              onClick={() => scroll(trendingRef, 'left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover/trend:opacity-100 -translate-x-3"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div 
              ref={trendingRef}
              className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide px-2"
            >
              {trendingProducts.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[220px] lg:w-[260px]">
                  <ProductCard product={product} onAddToCart={() => addToCart(product)} />
                </div>
              ))}
            </div>
            <button 
              onClick={() => scroll(trendingRef, 'right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover/trend:opacity-100 translate-x-3"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-3 md:mb-4">What Our Patients Say</h2>
          <p className="text-gray-500 font-medium text-sm md:text-base">Real reviews from customers who found their shopping cure.</p>
        </div>
        <div className="overflow-x-auto snap-x snap-mandatory scrollbar-hide flex gap-6 md:gap-8 pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          {[
            { name: "Rahul S.", review: "I was skeptical about the low prices, but the quality is actually better than what I find at the mall. dr.cheapcart is my new go-to!", rating: 5 },
            { name: "Priya M.", review: "Fast delivery and excellent customer support. I had an issue with my size and they resolved it in 24 hours. Highly recommend!", rating: 5 },
            { name: "Ankit K.", review: "The best deals I've seen online. I saved over 50% on my home electronics. The 'doctor' really knows his stuff!", rating: 5 }
          ].map((testimonial, i) => (
            <div key={i} className="bg-white p-6 md:p-10 rounded-2xl md:rounded-[3rem] border border-gray-100 shadow-sm relative min-w-[85vw] md:min-w-[400px] snap-center">
              <div className="flex text-yellow-400 mb-4 md:mb-6">
                {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="h-4 w-4 md:h-5 md:w-5 fill-current" />)}
              </div>
              <p className="text-gray-600 text-sm md:text-lg leading-relaxed mb-6 md:mb-8 italic">"{testimonial.review}"</p>
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center font-black text-blue-600 text-sm md:text-base">
                  {testimonial.name[0]}
                </div>
                <span className="font-black text-gray-900 text-sm md:text-base">{testimonial.name}</span>
              </div>
              <div className="absolute top-6 md:top-10 right-6 md:right-10 text-gray-100">
                <Star className="h-10 w-10 md:h-16 md:w-16 fill-current" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const ProductCard = ({ product, onAddToCart }: { product: Product; onAddToCart: () => void }) => {
  const navigate = useNavigate();
  const displayPrice = product.price ?? (product as any).sellingPrice ?? 0;
  const displayComparativePrice = product.comparativePrice ?? (product as any).basePrice ?? 0;
  
  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/product/${product.id}`);
  };
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group transition-all duration-300 hover:shadow-lg"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {displayComparativePrice && displayComparativePrice > displayPrice && (
            <div className="bg-red-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full">
              {Math.round((displayComparativePrice - displayPrice) / displayComparativePrice * 100)}% OFF
            </div>
          )}
        </div>
      </Link>
      <div className="p-3">
        <Link to={`/product/${product.id}`} className="block font-bold text-gray-900 text-xs sm:text-sm mb-1 truncate hover:text-blue-600">
          {product.title}
        </Link>
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-2.5 w-2.5 fill-current" />)}
          </div>
          <span className="text-gray-400 text-[10px]">(4.8)</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm sm:text-base font-black text-gray-900">₹{displayPrice}</span>
            {displayComparativePrice > displayPrice && (
              <span className="text-[10px] text-gray-400 line-through ml-1">₹{displayComparativePrice}</span>
            )}
          </div>
          <button
            onClick={(e) => { e.preventDefault(); onAddToCart(); }}
            className="bg-blue-600 text-white p-1.5 rounded-lg hover:bg-blue-700 transition-all"
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingCart className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
