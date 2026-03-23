import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Product } from '../../types';
import { useToast } from '../../context/ToastContext';
import { 
  Plus, 
  Minus, 
  Package, 
  AlertTriangle, 
  Search, 
  Download, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';

export const InventoryManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [bulkAmount, setBulkAmount] = useState<{id: string, amount: number} | null>(null);
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');
  const [sortBy, setSortBy] = useState<'stock-asc' | 'stock-desc'>('stock-asc');
  const { showToast } = useToast();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'products'), orderBy('stock', 'asc'));
      const snap = await getDocs(q);
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId: string, newStock: number) => {
    setUpdatingId(productId);
    try {
      await updateDoc(doc(db, 'products', productId), { stock: newStock });
      setProducts(products.map(p => p.id === productId ? { ...p, stock: newStock } : p));
    } catch (error) {
      console.error("Error updating stock:", error);
      showToast('Failed to update stock. Please try again.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const addBulkStock = async (productId: string, amount: number) => {
    const product = products.find(p => p.id === productId);
    if (product && amount > 0) {
      await updateStock(productId, product.stock + amount);
      setBulkAmount(null);
    }
  };

  const exportInventory = () => {
    const data = products.map(p => ({
      'Product Name': p.title,
      'SKU': p.sku || 'N/A',
      'Available Stock': p.stock,
      'Sold Quantity': p.soldCount || 0,
      'Status': p.stock === 0 ? 'Out of Stock' : p.stock < 10 ? 'Low Stock' : 'In Stock'
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory');
    XLSX.writeFile(wb, `inventory_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
        p.sku?.toLowerCase().includes(search.toLowerCase());
      
      if (stockFilter === 'in-stock') return matchesSearch && p.stock > 14;
      if (stockFilter === 'low-stock') return matchesSearch && p.stock > 0 && p.stock <= 14;
      if (stockFilter === 'out-of-stock') return matchesSearch && p.stock === 0;
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'stock-asc') return a.stock - b.stock;
      return b.stock - a.stock;
    });

  const stats = [
    { 
      label: 'Total Stock Units', 
      value: products.reduce((acc, p) => acc + p.stock, 0), 
      icon: Package, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      trend: '+12%',
      isUp: true
    },
    { 
      label: 'Low Stock Items', 
      value: products.filter(p => p.stock > 0 && p.stock <= 14).length, 
      icon: AlertCircle, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
      trend: '-5%',
      isUp: false
    },
    { 
      label: 'Out of Stock', 
      value: products.filter(p => p.stock === 0).length, 
      icon: XCircle, 
      color: 'text-red-600', 
      bg: 'bg-red-50',
      trend: '+2',
      isUp: true
    },
    { 
      label: 'Inventory Value', 
      value: `₹${products.reduce((acc, p) => acc + (p.stock * p.price), 0).toLocaleString()}`, 
      icon: TrendingUp, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      trend: '+8%',
      isUp: true
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Inventory Management</h1>
          <p className="text-gray-500 mt-1">Track stock levels, manage replenishments, and monitor inventory health.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={fetchInventory}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-sm"
          >
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={exportInventory}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-sm"
          >
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4"
          >
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${stat.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {stat.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by product name or SKU..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-gray-900 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select 
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="flex-1 md:flex-none px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-gray-900"
          >
            <option value="all">All Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="flex-1 md:flex-none px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-gray-900"
          >
            <option value="stock-asc">Stock: Low to High</option>
            <option value="stock-desc">Stock: High to Low</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Product Information</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">SKU</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Stock</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Sold</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                        <p className="text-sm font-medium text-gray-500">Loading inventory data...</p>
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
                          <div className="h-12 w-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 group-hover:border-gray-200 transition-colors">
                            <img 
                              src={product.image} 
                              className="h-full w-full object-cover" 
                              referrerPolicy="no-referrer"
                              alt={product.title}
                            />
                          </div>
                          <div className="max-w-xs">
                            <div className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{product.title}</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{product.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-bold text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                          {product.sku || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                product.stock === 0 ? 'bg-red-500' : 
                                product.stock <= 14 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                            />
                          </div>
                          <span className={`text-lg font-black ${
                            product.stock === 0 ? 'text-red-600' : 
                            product.stock <= 14 ? 'text-amber-600' : 'text-gray-900'
                          }`}>
                            {product.stock}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                          <TrendingUp className="h-4 w-4 text-emerald-500" />
                          {product.soldCount || 0}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          product.stock === 0 ? 'bg-red-50 text-red-700 border border-red-100' :
                          product.stock <= 14 ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          {product.stock === 0 ? <XCircle className="h-3 w-3" /> : 
                           product.stock <= 14 ? <AlertTriangle className="h-3 w-3" /> : 
                           <CheckCircle2 className="h-3 w-3" />}
                          {product.stock === 0 ? 'Out of Stock' : product.stock <= 14 ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100">
                            <button 
                              disabled={updatingId === product.id || product.stock === 0}
                              onClick={() => updateStock(product.id, Math.max(0, product.stock - 1))}
                              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg transition-all disabled:opacity-30"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <div className="w-10 text-center text-sm font-bold text-gray-900">
                              {updatingId === product.id ? (
                                <div className="w-4 h-4 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto" />
                              ) : (
                                product.stock
                              )}
                            </div>
                            <button 
                              disabled={updatingId === product.id}
                              onClick={() => updateStock(product.id, product.stock + 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg transition-all disabled:opacity-30"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          {bulkAmount?.id === product.id ? (
                            <div className="flex items-center gap-1">
                              <input 
                                type="number" 
                                min="1"
                                placeholder="Qty"
                                className="w-16 px-2 py-1 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                onChange={(e) => setBulkAmount({ id: product.id, amount: parseInt(e.target.value) || 0 })}
                              />
                              <button 
                                onClick={() => addBulkStock(product.id, bulkAmount.amount)}
                                className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => setBulkAmount(null)}
                                className="p-1.5 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => setBulkAmount({ id: product.id, amount: 10 })}
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all"
                              title="Add Bulk Stock"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          )}
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

      {/* Low Stock Warning Banner */}
      {products.some(p => p.stock > 0 && p.stock <= 14) && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-900">Inventory Attention Required</h3>
              <p className="text-amber-700 text-sm">There are {products.filter(p => p.stock > 0 && p.stock <= 14).length} items with stock 14 or less.</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-200">
            Replenish Stock Now
          </button>
        </motion.div>
      )}
    </div>
  );
};
