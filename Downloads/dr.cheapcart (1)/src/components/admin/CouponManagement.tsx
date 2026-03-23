import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Coupon } from '../../types';
import { useToast } from '../../context/ToastContext';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Ticket, 
  Calendar, 
  Users, 
  Percent, 
  Search, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Zap,
  ArrowRight,
  Info,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CouponManagement = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    minOrderAmount: 0,
    expiryDate: '',
    usageLimit: 100,
    active: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'coupons'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setCoupons(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coupon)));
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        expiryDate: new Date(formData.expiryDate).getTime(),
        createdAt: Date.now(),
        usageCount: editingCoupon?.usageCount || 0
      };

      if (editingCoupon) {
        await updateDoc(doc(db, 'coupons', editingCoupon.id), data);
      } else {
        await addDoc(collection(db, 'coupons'), data);
      }
      fetchCoupons();
      closeModal();
    } catch (error) {
      console.error("Error saving coupon:", error);
      showToast('Operation failed. Please try again.', 'error');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 0,
      minOrderAmount: 0,
      expiryDate: '',
      usageLimit: 100,
      active: true
    });
  };

  const deleteCoupon = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this coupon? This action cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'coupons', id));
      setCoupons(coupons.filter(c => c.id !== id));
      showToast('Coupon deleted successfully', 'success');
    } catch (error) {
      console.error("Error deleting coupon:", error);
      showToast('Delete failed. Please try again.', 'error');
    }
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Coupon Management</h1>
          <p className="text-gray-500 mt-1">Create and manage promotional offers to drive customer engagement.</p>
        </div>
        <button 
          onClick={() => { setShowModal(true); setEditingCoupon(null); }}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
        >
          <Plus className="h-5 w-5" />
          Create New Coupon
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by coupon code..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-gray-900 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select className="flex-1 md:flex-none px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-gray-900">
            <option>All Coupons</option>
            <option>Active Only</option>
            <option>Expired</option>
            <option>Percentage</option>
            <option>Fixed Amount</option>
          </select>
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white h-64 rounded-[2.5rem] border border-gray-100 animate-pulse" />
            ))
          ) : filteredCoupons.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-gray-50 rounded-full">
                  <Ticket className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-500">No coupons found. Start by creating one!</p>
              </div>
            </div>
          ) : (
            filteredCoupons.map((coupon, idx) => (
              <motion.div 
                key={coupon.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden"
              >
                {/* Decorative Ticket Notches */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full border border-gray-100 z-10" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full border border-gray-100 z-10" />
                
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                  <Ticket className="h-32 w-32 rotate-12" />
                </div>

                <div className="p-8 relative z-0">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-3 rounded-2xl ${coupon.active ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                      <Zap className="h-6 w-6" />
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => { 
                          setEditingCoupon(coupon); 
                          setFormData({ 
                            code: coupon.code,
                            discountType: coupon.discountType,
                            discountValue: coupon.discountValue,
                            minOrderAmount: coupon.minOrderAmount,
                            expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0],
                            usageLimit: coupon.usageLimit,
                            active: coupon.active
                          }); 
                          setShowModal(true); 
                        }}
                        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => deleteCoupon(coupon.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 mb-8">
                    <div className="flex items-center gap-2">
                      <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">{coupon.code}</h3>
                      {coupon.active && <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-indigo-600">
                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Storewide</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-8 border-t border-dashed border-gray-200">
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock className="h-3 w-3" /> Expiry
                      </p>
                      <p className="text-xs font-black text-gray-700">{new Date(coupon.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Users className="h-3 w-3" /> Usage
                      </p>
                      <p className="text-xs font-black text-gray-700">{coupon.usageCount} / {coupon.usageLimit}</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-between items-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      coupon.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                      {coupon.active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {coupon.active ? 'Active' : 'Inactive'}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      <Info className="h-3 w-3" />
                      Min: ₹{coupon.minOrderAmount}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-8 sm:p-12">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                      {editingCoupon ? 'Update Coupon' : 'Create New Coupon'}
                    </h2>
                    <p className="text-gray-500 mt-1">Configure your promotional offer details below.</p>
                  </div>
                  <button 
                    onClick={closeModal}
                    className="p-3 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-2xl transition-all"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Coupon Code</label>
                      <input 
                        required
                        type="text"
                        placeholder="e.g. SUMMER50"
                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-gray-900 uppercase font-black text-lg tracking-wider transition-all"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Discount Type</label>
                      <select 
                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-gray-900 font-bold text-gray-700 transition-all appearance-none"
                        value={formData.discountType}
                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (₹)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Discount Value</label>
                      <div className="relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                          {formData.discountType === 'percentage' ? '%' : '₹'}
                        </div>
                        <input 
                          required
                          type="number"
                          className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-6 py-4 focus:ring-2 focus:ring-gray-900 font-bold transition-all"
                          value={formData.discountValue}
                          onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Min. Order Amount (₹)</label>
                      <input 
                        required
                        type="number"
                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-gray-900 font-bold transition-all"
                        value={formData.minOrderAmount}
                        onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Expiry Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input 
                          required
                          type="date"
                          className="w-full bg-gray-50 border-none rounded-2xl pl-14 pr-6 py-4 focus:ring-2 focus:ring-gray-900 font-bold transition-all"
                          value={formData.expiryDate}
                          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Usage Limit</label>
                      <input 
                        required
                        type="number"
                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-gray-900 font-bold transition-all"
                        value={formData.usageLimit}
                        onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        id="active-toggle"
                        className="sr-only peer"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                    </div>
                    <div>
                      <label htmlFor="active-toggle" className="text-sm font-bold text-gray-900 block">Active Status</label>
                      <p className="text-xs text-gray-500">Allow customers to use this coupon at checkout.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={closeModal}
                      className="flex-1 bg-gray-100 text-gray-600 py-5 rounded-[2rem] font-bold hover:bg-gray-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-[2] bg-gray-900 text-white py-5 rounded-[2rem] font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2"
                    >
                      {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                      <ArrowRight className="h-5 w-5" />
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
