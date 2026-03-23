import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Category } from '../../types';
import { useToast } from '../../context/ToastContext';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Tag, 
  ShoppingBag, 
  TrendingUp, 
  X, 
  Search, 
  MoreVertical,
  Image as ImageIcon,
  ChevronRight,
  ArrowUpRight,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', image: '' });
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
      const snap = await getDocs(q);
      setCategories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateDoc(doc(db, 'categories', editingCategory.id), formData);
      } else {
        await addDoc(collection(db, 'categories'), {
          ...formData,
          createdAt: Date.now(),
          productCount: 0
        });
      }
      fetchCategories();
      setShowModal(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '', image: '' });
    } catch (error) {
      console.error("Error saving category:", error);
      showToast('Operation failed. Please try again.', 'error');
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This will not delete products in this category.')) return;
    try {
      await deleteDoc(doc(db, 'categories', id));
      setCategories(categories.filter(c => c.id !== id));
      showToast('Category deleted successfully', 'success');
    } catch (error) {
      console.error("Error deleting category:", error);
      showToast('Delete failed. Please try again.', 'error');
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Category Management</h1>
          <p className="text-gray-500 mt-1">Organize your products into logical groups for better browsing.</p>
        </div>
        <button 
          onClick={() => { setShowModal(true); setEditingCategory(null); setFormData({ name: '', description: '', image: '' }); }}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
        >
          <Plus className="h-5 w-5" />
          Add New Category
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search categories..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-gray-900 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
          <span>Total: <span className="text-gray-900 font-bold">{categories.length}</span></span>
          <div className="h-4 w-px bg-gray-200" />
          <span>Active: <span className="text-emerald-600 font-bold">{categories.length}</span></span>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm animate-pulse">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl" />
                  <div className="w-8 h-8 bg-gray-50 rounded-lg" />
                </div>
                <div className="w-2/3 h-6 bg-gray-100 rounded-lg mb-2" />
                <div className="w-full h-4 bg-gray-50 rounded-lg mb-1" />
                <div className="w-full h-4 bg-gray-50 rounded-lg mb-6" />
                <div className="pt-6 border-t border-gray-50 grid grid-cols-2 gap-4">
                  <div className="h-10 bg-gray-50 rounded-xl" />
                  <div className="h-10 bg-gray-50 rounded-xl" />
                </div>
              </div>
            ))
          ) : filteredCategories.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-gray-100">
              <div className="flex flex-col items-center gap-4">
                <div className="p-5 bg-gray-50 rounded-full">
                  <Layers className="h-10 w-10 text-gray-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">No categories found</h3>
                  <p className="text-gray-500">Try adjusting your search or add a new category.</p>
                </div>
              </div>
            </div>
          ) : (
            filteredCategories.map((category, idx) => (
              <motion.div 
                key={category.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all group relative overflow-hidden"
              >
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 group-hover:bg-blue-50 transition-colors" />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className="bg-gray-900 p-4 rounded-2xl text-white shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform">
                      <Tag className="h-6 w-6" />
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <button 
                        onClick={() => { setEditingCategory(category); setFormData({ name: category.name, description: category.description, image: category.image || '' }); setShowModal(true); }}
                        className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        title="Edit Category"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => deleteCategory(category.id)}
                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete Category"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                  <p className="text-sm text-gray-500 mb-8 line-clamp-2 leading-relaxed">{category.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inventory</p>
                      <div className="flex items-center text-gray-900 font-bold">
                        <ShoppingBag className="h-4 w-4 mr-2 text-blue-600" />
                        {category.productCount || 0} <span className="text-[10px] text-gray-400 ml-1 font-medium">Products</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Growth</p>
                      <div className="flex items-center text-emerald-600 font-bold">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        <span className="text-sm">High</span>
                        <ArrowUpRight className="h-3 w-3 ml-1" />
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-6 py-3 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-900 hover:text-white transition-all">
                    View Products
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[2.5rem] max-w-md w-full p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-700 to-gray-900" />
              
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 bg-gray-100 rounded-2xl text-gray-900">
                  {editingCategory ? <Edit className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{editingCategory ? 'Edit Category' : 'New Category'}</h2>
                  <p className="text-gray-500 mt-1 text-sm">Define a new product group for your store.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Category Name</label>
                    <input 
                      required
                      type="text"
                      placeholder="e.g. Electronics, Fashion..."
                      className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-gray-900 transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Briefly describe what this category contains..."
                      className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-gray-900 transition-all resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Cover Image URL (Optional)</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input 
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        className="w-full pl-11 pr-5 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-gray-900 transition-all"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button 
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-4 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-2xl transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-[2] bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
                    >
                      {editingCategory ? 'Update Category' : 'Create Category'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
