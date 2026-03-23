import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { ShoppingCart, Share2, ShieldCheck, Truck, RefreshCw, Loader2, Star, Check, Info, ArrowLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ExpandableText } from '../components/ExpandableText';
import { useToast } from '../context/ToastContext';
import { motion } from 'motion/react';


export const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart, setDirectBuy } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(productData);
          setSelectedImage(productData.image);
          
          // Fetch related products
          const productCats = Array.isArray(productData.category) ? productData.category : [productData.category];
          const q = query(
            collection(db, 'products'), 
            where('category', 'array-contains-any', productCats),
            limit(4)
          );
          const relatedSnap = await getDocs(q);
          setRelatedProducts(
            relatedSnap.docs
              .map(doc => ({ id: doc.id, ...doc.data() as Object } as Product))
              .filter(p => p.id !== id)
          );
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <Loader2 className="animate-spin h-12 w-12 text-blue-600 mb-4" />
      <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Diagnosing Product Details...</p>
    </div>
  );
  
  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-32 text-center">
      <Info className="h-16 w-16 text-gray-200 mx-auto mb-6" />
      <h2 className="text-3xl font-black text-gray-900 mb-4">Prescription Not Found</h2>
      <p className="text-gray-500 mb-8">The product you are looking for might have been removed or is temporarily unavailable.</p>
      <Link to="/catalog" className="inline-flex bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all">
        Back to Catalog
      </Link>
    </div>
  );

  const oldProduct = product as any;
  const displayPrice = product.price ?? oldProduct.sellingPrice ?? 0;
  const displayComparativePrice = product.comparativePrice ?? oldProduct.basePrice ?? 0;
  
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image, product.image, product.image, product.image];
  
  const discount = displayComparativePrice && displayComparativePrice > displayPrice 
    ? Math.round((displayComparativePrice - displayPrice) / displayComparativePrice * 100) 
    : 0;

  return (
    <div className="bg-gray-50 pb-12 md:pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/catalog" className="hover:text-blue-600 transition-colors">Shop</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to={`/catalog?category=${Array.isArray(product.category) ? product.category[0] : product.category}`} className="hover:text-blue-600 transition-colors">{Array.isArray(product.category) ? product.category[0] : product.category}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900 truncate max-w-[150px]">{product.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="aspect-square rounded-2xl md:rounded-[3rem] overflow-hidden bg-white border border-gray-100 shadow-xl shadow-gray-200/50 group relative">
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 md:top-8 md:left-8 bg-red-600 text-white px-4 py-1.5 md:px-6 md:py-2 rounded-full font-black text-xs md:text-sm shadow-xl">
                  {discount}% OFF
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-2 md:gap-4">
              {productImages.slice(0, 4).map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square rounded-3xl overflow-hidden border-2 transition-all ${
                    selectedImage === img 
                      ? 'border-blue-600 scale-95 shadow-lg' 
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 md:space-y-10"
          >
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-between">
                <span className="bg-blue-50 text-blue-600 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                  {Array.isArray(product.category) ? product.category.join(', ') : product.category}
                </span>
                <div className="flex items-center space-x-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 md:h-4 md:w-4 fill-current" />)}
                  <span className="text-gray-400 text-xs md:text-sm font-bold ml-1 md:ml-2">4.9 (128 Reviews)</span>
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 leading-tight">{product.title}</h1>
            </div>

            {/* Mobile-Friendly Unified Product Box */}
            <div className="lg:hidden bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
              {/* Price Section */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-black">₹{displayPrice}</span>
                    {displayComparativePrice && displayComparativePrice > displayPrice && (
                      <span className="ml-2 text-white/70 line-through text-lg">₹{displayComparativePrice}</span>
                    )}
                  </div>
                  {displayComparativePrice && displayComparativePrice > displayPrice && (
                    <div className="bg-white text-blue-600 px-3 py-1 rounded-full font-bold text-sm">
                      Save ₹{Math.round(displayComparativePrice - displayPrice)}
                    </div>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="p-4 border-b border-gray-100">
                {product.stock > 0 ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {product.stock <= 14 ? (
                        <>
                          <AlertTriangle className="h-5 w-5 text-amber-600" />
                          <span className="text-amber-600 font-bold">Only {product.stock} left - Hurry!</span>
                        </>
                      ) : (
                        <>
                          <Check className="h-5 w-5 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">In Stock</span>
                        </>
                      )}
                    </div>
                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-3 bg-gray-100 rounded-2xl p-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-xl bg-white text-gray-900 font-black hover:bg-gray-200 transition-all flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-black text-lg">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={quantity >= product.stock}
                        className="w-10 h-10 rounded-xl bg-white text-gray-900 font-black hover:bg-gray-200 transition-all flex items-center justify-center disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="text-red-600 font-bold">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="p-4 border-b border-gray-100">
                <ExpandableText text={product.description} className="text-gray-600 text-sm font-medium" />
              </div>

              {/* Action Buttons */}
              <div className="p-4 space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className={`flex-1 py-4 rounded-2xl font-black text-base flex items-center justify-center transition-all ${
                      product.stock === 0 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-900 text-white hover:bg-blue-600'
                    }`}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" /> 
                    Add to Cart
                  </button>
                  <button
                    onClick={() => { const item = { ...product }; (item as any).quantity = quantity; setDirectBuy(item); navigate('/checkout'); }}
                    disabled={product.stock === 0}
                    className={`flex-1 py-4 rounded-2xl font-black text-base flex items-center justify-center transition-all ${
                      product.stock === 0 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Buy Now
                  </button>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { navigator.clipboard.writeText(window.location.href); showToast('Link copied to clipboard!'); }}
                    className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 font-bold flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all"
                  >
                    <Share2 className="mr-2 h-5 w-5" />
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:block bg-white p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4 md:space-y-6">
              {/* Price Display */}
              <div className="flex items-center space-x-4 md:space-x-6 pb-4 border-b border-gray-100">
                <span className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900">₹{displayPrice}</span>
                {displayComparativePrice && displayComparativePrice > displayPrice && (
                  <div className="flex flex-col">
                    <span className="text-base md:text-xl text-gray-400 line-through font-bold">₹{displayComparativePrice}</span>
                    <span className="text-emerald-600 text-xs md:text-sm font-black">You save ₹{Math.round(displayComparativePrice - displayPrice)}</span>
                  </div>
                )}
              </div>

              {product.stock > 0 ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-emerald-600 font-bold text-sm md:text-base">
                    <Check className="h-4 w-4 md:h-5 md:w-5" />
                    <span>
                      {product.stock <= 14 
                        ? `Only ${product.stock} left - Hurry!` 
                        : 'In Stock - Ready for Immediate Delivery'}
                    </span>
                  </div>
                  {/* Quantity Selector - Desktop */}
                  <div className="flex items-center space-x-3 bg-gray-100 rounded-2xl p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-xl bg-white text-gray-900 font-black hover:bg-gray-200 transition-all flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-black text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 rounded-xl bg-white text-gray-900 font-black hover:bg-gray-200 transition-all flex items-center justify-center disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3 text-red-600 font-bold text-sm md:text-base">
                  <AlertTriangle className="h-4 w-4 md:h-5 md:w-5" />
                  <span>Out of Stock</span>
                </div>
              )}
              
              {product.stock > 0 && product.stock <= 14 && (
                <div className="flex items-center space-x-2 text-amber-600 text-xs md:text-sm font-bold">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Low stock! Order soon to avoid disappointment</span>
                </div>
              )}
              
              <p className="text-gray-500 leading-relaxed font-medium text-sm md:text-base">
                {product.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className={`flex-1 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-sm md:text-lg flex items-center justify-center transition-all shadow-xl group ${
                    product.stock === 0 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-900 text-white hover:bg-blue-600 shadow-gray-200'
                  }`}
                >
                  <ShoppingCart className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6 group-hover:scale-110 transition-transform" /> 
                  Add to Cart
                </button>
                <button
                  onClick={() => { const item = { ...product }; (item as any).quantity = quantity; setDirectBuy(item); navigate('/checkout'); }}
                  disabled={product.stock === 0}
                  className={`flex-1 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-sm md:text-lg flex items-center justify-center transition-all shadow-xl ${
                    product.stock === 0 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                  }`}
                >
                  Buy Now
                </button>
                <div className="flex gap-3 md:gap-4">
                  <button 
                    onClick={() => { navigator.clipboard.writeText(window.location.href); showToast('Link copied to clipboard!'); }}
                    className="p-4 md:p-5 rounded-xl md:rounded-2xl border border-gray-100 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
                  >
                    <Share2 className="h-5 w-5 md:h-6 md:w-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {[
                { icon: Truck, title: "Free Delivery", desc: "Across India" },
                { icon: ShieldCheck, title: "Authentic", desc: "100% Original" },
                { icon: RefreshCw, title: "Easy Returns", desc: "7 Days Policy" }
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3 md:space-x-4 p-4 md:p-5 bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm">
                  <div className="bg-blue-50 p-2 md:p-3 rounded-xl md:rounded-2xl text-blue-600">
                    <item.icon className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 text-sm md:text-sm">{item.title}</h4>
                    <p className="text-gray-400 text-[10px] md:text-[10px] font-bold uppercase tracking-widest">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Check */}
            <div className="bg-gray-100 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="bg-white p-2 md:p-3 rounded-xl md:rounded-2xl shadow-sm">
                  <Truck className="h-5 w-5 md:h-6 md:w-6 text-gray-900" />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-sm md:text-base">Check Delivery</h4>
                  <p className="text-gray-500 text-xs md:text-sm font-medium">Enter pincode to check availability</p>
                </div>
              </div>
              <div className="flex w-full md:w-auto bg-white p-2 rounded-xl md:rounded-2xl shadow-sm">
                <input type="text" placeholder="Pincode" className="bg-transparent border-none px-3 md:px-4 py-2 w-full md:w-28 lg:w-32 outline-none font-bold text-sm" />
                <button className="bg-gray-900 text-white px-4 md:px-6 py-2 rounded-xl font-black text-xs md:text-sm hover:bg-blue-600 transition-all">Check</button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 md:mt-24 lg:mt-32">
            <div className="flex justify-between items-end mb-8 md:mb-12 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900">Related Prescriptions</h2>
                <p className="text-gray-500 font-medium text-sm md:text-base">Other patients also looked at these products.</p>
              </div>
              <Link to={`/catalog?category=${product.category}`} className="text-blue-600 font-black flex items-center hover:underline text-sm md:text-base">
                View All <ChevronRight className="ml-1 h-4 w-4 md:h-5 md:w-5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} onAddToCart={() => addToCart(p)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const ProductCard = ({ product, onAddToCart }: { product: Product; onAddToCart: () => void }) => {
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
          {product.comparativePrice && product.comparativePrice > product.price && (
            <div className="bg-red-600 text-white text-[9px] md:text-[10px] font-black px-2 md:px-3 py-1 md:py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              {Math.round((product.comparativePrice - product.price) / product.comparativePrice * 100)}% OFF
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
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg md:text-2xl font-black text-gray-900">₹{product.price}</span>
            {product.comparativePrice && product.comparativePrice > product.price && (
              <span className="text-[10px] md:text-xs text-gray-400 line-through font-bold">₹{product.comparativePrice}</span>
            )}
          </div>
          <button
            onClick={(e) => { e.preventDefault(); onAddToCart(); }}
            className="bg-gray-900 text-white p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-blue-600 transition-all shadow-lg shadow-gray-200 group-hover:scale-110"
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
