import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Product } from '../../types';
import { useToast } from '../../context/ToastContext';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  Package, 
  Tag, 
  IndianRupee, 
  Layers, 
  TrendingUp, 
  Star, 
  X, 
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
  MoreVertical,
  ArrowUpRight,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';

export const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState<'import' | 'manual' | 'edit' | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [meeshoUrl, setMeeshoUrl] = useState('');
  const [importing, setImporting] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  
  const initialFormData: Partial<Product> = {
    title: '',
    description: '',
    image: '',
    images: [],
    price: 0,
    comparativePrice: 0,
    category: [],
    stock: 10,
    trending: false,
    featured: false,
    sku: ''
  };

  const [formData, setFormData] = useState<Partial<Product>>(initialFormData);
  const [productImages, setProductImages] = useState<string[]>([]);

  const categoryOptions = ['Electronics', 'Fashion', 'Home', 'Beauty', 'Health', 'Toys'];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      const oldProduct = editingProduct as any;
      setProductImages(editingProduct.images || (editingProduct.image ? [editingProduct.image] : []));
      setFormData({
        ...editingProduct,
        price: editingProduct.price || oldProduct.sellingPrice || 0,
        comparativePrice: editingProduct.comparativePrice || oldProduct.basePrice || 0,
        category: Array.isArray(editingProduct.category) ? editingProduct.category : (editingProduct.category ? [editingProduct.category] : []),
      });
    }
  }, [editingProduct]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!meeshoUrl) return;
    setImporting(true);
    try {
      const res = await axios.post('/api/import-meesho', { url: meeshoUrl });
      const data = res.data;
      setFormData({
        title: data.title,
        description: data.description,
        image: data.image,
        price: data.price || 0,
        comparativePrice: data.comparativePrice || 0,
        category: data.category ? [data.category] : ['General'],
        stock: 50,
        trending: false,
        featured: false
      });
      setShowModal('manual');
    } catch (error) {
      console.error("Import failed:", error);
      showToast('Import failed. Please enter details manually.', 'error');
      setShowModal('manual');
    } finally {
      setImporting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price) {
      showToast('Please add title and price', 'error');
      return;
    }
    if (productImages.length < 1) {
      showToast('Please add at least 1 product image', 'error');
      return;
    }
    
    const finalData = {
      ...formData,
      image: productImages[0] || '',
      images: productImages.filter(img => img),
      comparativePrice: formData.comparativePrice || 0,
      category: formData.category || [],
      stock: formData.stock ?? 10,
      createdAt: Date.now()
    };

    try {
      if (showModal === 'edit' && editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), finalData);
      } else {
        await addDoc(collection(db, 'products'), finalData);
      }
      
      setShowModal(null);
      setFormData(initialFormData);
      setProductImages([]);
      fetchProducts();
      showToast('Product saved successfully!', 'success');
    } catch (error: any) {
      console.error("Error saving product:", error);
      showToast('Error saving product: ' + (error?.message || 'Unknown error'), 'error');
    }
  };

  const deleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'products', id));
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    (Array.isArray(p.category) ? p.category.join(' ').toLowerCase() : p.category || '').toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Low Stock', value: products.filter(p => p.stock < 10).length, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Out of Stock', value: products.filter(p => p.stock === 0).length, icon: X, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Featured', value: products.filter(p => p.featured).length, icon: Star, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Product Catalog</h1>
          <p className="text-gray-500 mt-1">Manage your inventory, pricing, and product visibility.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setShowModal('import')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-sm"
          >
            <Download className="h-4 w-4" />
            Import
          </button>
          <button 
            onClick={() => { setFormData(initialFormData); setShowModal('manual'); }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by name, category, or SKU..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-gray-900 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select className="flex-1 md:flex-none px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-gray-900">
            <option>All Categories</option>
            {Array.from(new Set(products.flatMap(p => Array.isArray(p.category) ? p.category : [p.category]))).map(cat => (
              <option key={String(cat)} value={String(cat)}>{cat}</option>
            ))}
          </select>
          <select className="flex-1 md:flex-none px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-gray-900">
            <option>Stock Status</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Product Details</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Pricing</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Inventory</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                        <p className="text-sm font-medium text-gray-500">Loading products...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 bg-gray-50 rounded-full">
                          <Package className="h-8 w-8 text-gray-300" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">No products found matching your search.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <motion.tr 
                      key={product.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative h-14 w-14 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 group-hover:border-gray-200 transition-colors">
                            <img 
                              src={product.image} 
                              className="h-full w-full object-cover" 
                              referrerPolicy="no-referrer"
                              alt={product.title}
                            />
                          </div>
                          <div className="max-w-xs">
                            <div className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{product.title}</div>
                            <div className="text-xs text-gray-400 font-medium mt-0.5">SKU: {product.sku || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex flex-wrap items-center gap-1.5">
                          {Array.isArray(product.category) ? product.category.map(cat => (
                            <span key={cat} className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                              <Tag className="h-3 w-3" />
                              {cat}
                            </span>
                          )) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                              <Tag className="h-3 w-3" />
                              {product.category}
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-0.5">
                          <div className="text-sm font-bold text-gray-900 flex items-center gap-1">
                            <IndianRupee className="h-3 w-3" />
                            {product.price}
                          </div>
                          {product.comparativePrice && product.comparativePrice > product.price && (
                            <div className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                              MRP: ₹{product.comparativePrice}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                product.stock === 0 ? 'bg-red-500' : 
                                product.stock < 10 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                            />
                          </div>
                          <span className={`text-sm font-bold ${
                            product.stock === 0 ? 'text-red-600' : 
                            product.stock < 10 ? 'text-amber-600' : 'text-gray-900'
                          }`}>
                            {product.stock}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-1.5">
                          {product.featured && (
                            <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md text-[9px] font-bold uppercase tracking-wider border border-purple-100">
                              Featured
                            </span>
                          )}
                          {product.trending && (
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[9px] font-bold uppercase tracking-wider border border-blue-100">
                              Trending
                            </span>
                          )}
                          {!product.featured && !product.trending && (
                            <span className="px-2 py-0.5 bg-gray-50 text-gray-400 rounded-md text-[9px] font-bold uppercase tracking-wider border border-gray-100">
                              Standard
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => { 
                              const oldProduct = product as any;
                              const migratedProduct = {
                                ...product,
                                price: product.price || oldProduct.sellingPrice || 0,
                                comparativePrice: product.comparativePrice || oldProduct.basePrice || 0,
                                category: Array.isArray(product.category) ? product.category : (product.category ? [product.category] : []),
                                images: product.images || (product.image ? [product.image] : []),
                                stock: product.stock || 10
                              };
                              setEditingProduct(migratedProduct);
                              setShowModal('edit'); 
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="Edit Product"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => deleteProduct(product.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showModal === 'import' && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(null)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[2.5rem] max-w-md w-full p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
              
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                  <Download className="h-6 w-6" />
                </div>
                <button onClick={() => setShowModal(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Import from Meesho</h2>
                  <p className="text-gray-500 mt-1 text-sm">Paste a Meesho product URL to automatically fetch details.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Product URL</label>
                    <input 
                      type="text"
                      placeholder="https://www.meesho.com/product/..."
                      className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                      value={meeshoUrl}
                      onChange={(e) => setMeeshoUrl(e.target.value)}
                    />
                  </div>
                  
                  <button 
                    onClick={handleImport}
                    disabled={importing || !meeshoUrl}
                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
                  >
                    {importing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Importing...
                      </>
                    ) : (
                      'Start Import'
                    )}
                  </button>

                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold text-gray-400">
                      <span className="bg-white px-4">Or</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => { setShowModal('manual'); setFormData(initialFormData); }} 
                    className="w-full py-4 text-sm text-gray-600 font-bold hover:bg-gray-50 rounded-2xl transition-all border border-gray-100"
                  >
                    Add Manually
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {(showModal === 'manual' || showModal === 'edit') && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(null)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[2.5rem] max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-700 to-gray-900" />
              
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 rounded-2xl text-gray-900">
                    {showModal === 'edit' ? <Edit className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{showModal === 'edit' ? 'Edit Product' : 'Add New Product'}</h2>
                    <p className="text-gray-500 text-sm">Fill in the details below to {showModal === 'edit' ? 'update' : 'create'} your product.</p>
                  </div>
                </div>
                <button onClick={() => setShowModal(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Basic Info */}
                  <div className="md:col-span-2 space-y-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Product Title</label>
                        <input 
                          required
                          placeholder="e.g. Premium Cotton T-Shirt"
                          className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-gray-900 transition-all"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">SKU (Stock Keeping Unit)</label>
                        <input 
                          placeholder="e.g. TSHIRT-BLK-M"
                          className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-gray-900 transition-all"
                          value={formData.sku || ''}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Categories (Select Multiple)</label>
                        <div className="grid grid-cols-3 gap-2">
                          {categoryOptions.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => {
                                const currentCats = formData.category || [];
                                const newCats = currentCats.includes(cat)
                                  ? currentCats.filter(c => c !== cat)
                                  : [...currentCats, cat];
                                setFormData({ ...formData, category: newCats });
                              }}
                              className={`p-2 rounded-xl text-xs font-bold border-2 transition-all ${
                                (formData.category || []).includes(cat)
                                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                                  : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                        <p className="text-[9px] text-gray-400">Selected: {(formData.category || []).join(', ')}</p>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Description</label>
                        <textarea 
                          required
                          rows={4}
                          placeholder="Write a compelling description for your product..."
                          className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-gray-900 transition-all resize-none"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Media & Pricing */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Media & Pricing
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Product Images (At least 3)</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <div key={i} className="relative">
                              <input 
                                placeholder={`Image ${i + 1}`}
                                className="w-full px-3 py-3 bg-gray-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-gray-900 transition-all"
                                value={productImages[i] || ''}
                                onChange={(e) => {
                                  const newImages = [...productImages];
                                  newImages[i] = e.target.value;
                                  setProductImages(newImages);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                        <p className="text-[9px] text-gray-400">{productImages.filter(img => img).length}/3+ images added</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Price (₹)</label>
                          <input 
                            required
                            type="number"
                            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-gray-900 transition-all"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Comparative Price (₹)</label>
                          <input 
                            type="number"
                            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-gray-900 transition-all"
                            value={formData.comparativePrice}
                            onChange={(e) => setFormData({ ...formData, comparativePrice: Number(e.target.value) })}
                          />
                        </div>
                      </div>
                      {(() => {
                          const discount = formData.comparativePrice && formData.price && formData.comparativePrice > formData.price 
                            ? Math.round((formData.comparativePrice - formData.price) / formData.comparativePrice * 100) 
                            : 0;
                          return discount > 0 ? (
                            <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center justify-between">
                              <div className="text-xs font-bold text-red-700">Discount</div>
                              <div className="text-lg font-black text-red-800">{discount}% OFF</div>
                            </div>
                          ) : null;
                        })()}
                    </div>
                  </div>

                  {/* Inventory & Visibility */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      Inventory & Visibility
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Stock Quantity</label>
                        <input 
                          required
                          type="number"
                          className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-gray-900 transition-all"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-3 pt-2">
                        <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                          <input 
                            type="checkbox"
                            className="w-5 h-5 rounded-lg border-gray-300 text-gray-900 focus:ring-gray-900"
                            checked={formData.featured}
                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          />
                          <div>
                            <div className="text-sm font-bold text-gray-900">Featured Product</div>
                            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Show in featured section</div>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors">
                          <input 
                            type="checkbox"
                            className="w-5 h-5 rounded-lg border-gray-300 text-gray-900 focus:ring-gray-900"
                            checked={formData.trending}
                            onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
                          />
                          <div>
                            <div className="text-sm font-bold text-gray-900">Trending Now</div>
                            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Mark as a trending item</div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex items-center gap-4">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(null)} 
                    className="flex-1 py-4 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-2xl transition-all"
                  >
                    Discard Changes
                  </button>
                  <button 
                    type="submit" 
                    className="flex-[2] bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2"
                  >
                    {showModal === 'edit' ? <CheckCircle2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    {showModal === 'edit' ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
