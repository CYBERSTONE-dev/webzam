import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Order } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Loader2, Download, Eye, Printer, Search, Filter, ChevronDown, MoreVertical, CheckCircle2, Clock, Truck, XCircle, Package, ShoppingBag } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'motion/react';

export const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { showToast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  const exportToExcel = () => {
    const data = orders.map(order => ({
      'Order ID': order.id.slice(-8).toUpperCase(),
      'Customer Name': order.shippingAddress.fullName,
      'Address': order.shippingAddress.street,
      'City': order.shippingAddress.city,
      'ZIP Code': order.shippingAddress.zipCode,
      'Phone Number': order.shippingAddress.phone,
      'Product': (order as any).productTitle || order.items?.[0]?.title || 'N/A',
      'Quantity': (order as any).quantity || order.items?.[0]?.quantity || 1,
      'Amount (per item)': (order as any).price || order.items?.[0]?.price || 0,
      'Total Amount': order.totalAmount,
      'Payment Method': order.paymentMethod || 'COD',
      'Status': order.status,
      'Date': new Date(order.createdAt).toLocaleString(),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, `orders_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const downloadShippingLabel = (order: Order) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('SHIPPING LABEL', 105, 20, { align: 'center' });
    doc.line(20, 25, 190, 25);
    
    doc.setFontSize(12);
    doc.text('FROM:', 20, 40);
    doc.text('dr.cheapcart Warehouse', 20, 47);
    doc.text('Main Street, Business Hub', 20, 54);
    
    doc.text('TO:', 20, 70);
    doc.setFontSize(14);
    doc.text(order.shippingAddress.fullName, 20, 77);
    doc.setFontSize(12);
    doc.text(order.shippingAddress.street, 20, 84);
    doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zipCode}`, 20, 91);
    doc.text(`Phone: ${order.shippingAddress.phone}`, 20, 98);
    
    doc.line(20, 110, 190, 110);
    doc.text(`Order ID: ${order.id}`, 20, 120);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 127);
    
    doc.save(`shipping_label_${order.id}.pdf`);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'processing': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'processing': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
      <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Syncing Orders...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4 bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm w-full md:w-96 group focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <Search className="h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by Order ID or Customer..." 
            className="bg-transparent border-none outline-none text-sm font-bold text-gray-900 w-full placeholder:text-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative group">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-100 px-6 py-3 pr-12 rounded-2xl font-black text-sm text-gray-900 shadow-sm hover:bg-gray-50 transition-all outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          <button 
            onClick={exportToExcel}
            className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-gray-800 transition-all flex items-center shadow-xl shadow-gray-900/10"
          >
            <Download className="h-4 w-4 mr-2" /> Export
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-4 md:px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                <th className="px-4 md:px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-4 md:px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest hidden lg:table-cell">Address</th>
                <th className="px-4 md:px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest hidden md:table-cell">City</th>
                <th className="px-4 md:px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest hidden lg:table-cell">ZIP</th>
                <th className="px-4 md:px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Phone</th>
                <th className="px-4 md:px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest hidden lg:table-cell">Product</th>
                <th className="px-4 md:px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest hidden lg:table-cell">Qty</th>
                <th className="px-4 md:px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                <th className="px-4 md:px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest hidden md:table-cell">Payment</th>
                <th className="px-4 md:px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-4 md:px-6 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((order) => (
                <motion.tr 
                  layout
                  key={order.id} 
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-4 md:px-6 py-4">
                    <div className="text-xs font-black text-gray-900">#{order.id.slice(-8).toUpperCase()}</div>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="text-xs font-black text-gray-900">{order.shippingAddress.fullName}</div>
                  </td>
                  <td className="px-4 md:px-6 py-4 hidden lg:table-cell">
                    <div className="text-xs font-bold text-gray-600 max-w-[150px] truncate">{order.shippingAddress.street}</div>
                  </td>
                  <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                    <div className="text-xs font-bold text-gray-600">{order.shippingAddress.city}</div>
                  </td>
                  <td className="px-4 md:px-6 py-4 hidden lg:table-cell">
                    <div className="text-xs font-bold text-gray-600">{order.shippingAddress.zipCode}</div>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="text-xs font-bold text-gray-600">{order.shippingAddress.phone}</div>
                  </td>
                  <td className="px-4 md:px-6 py-4 hidden lg:table-cell">
                    <div className="text-xs font-bold text-gray-600 max-w-[150px] truncate">{(order as any).productTitle || order.items?.[0]?.title || 'N/A'}</div>
                  </td>
                  <td className="px-4 md:px-6 py-4 hidden lg:table-cell">
                    <div className="text-xs font-bold text-gray-600">{(order as any).quantity || order.items?.[0]?.quantity || 1}</div>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="text-xs font-black text-gray-900">₹{order.totalAmount.toLocaleString()}</div>
                  </td>
                  <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                    <div className="text-xs font-bold text-gray-600">{order.paymentMethod || 'COD'}</div>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className={`inline-flex items-center px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => downloadShippingLabel(order)}
                        className="p-2 bg-gray-50 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[3rem] max-w-4xl w-full overflow-hidden shadow-2xl"
            >
              <div className="h-full flex flex-col max-h-[90vh]">
                {/* Modal Header */}
                <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                      <ShoppingBag className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-gray-900 tracking-tight">Order #{selectedOrder.id.slice(-8).toUpperCase()}</h2>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="p-4 bg-white border border-gray-100 text-gray-400 hover:text-gray-900 rounded-2xl transition-all shadow-sm"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer Information</h3>
                      <div className="bg-gray-50 p-8 rounded-[2rem] space-y-4 border border-gray-100">
                        <div>
                          <p className="text-xl font-black text-gray-900">{selectedOrder.shippingAddress.fullName}</p>
                          <p className="text-sm font-bold text-gray-500 mt-1">{selectedOrder.shippingAddress.email || 'No email provided'}</p>
                        </div>
                        <div className="flex items-center space-x-2 text-blue-600 font-black text-sm">
                          <MoreVertical className="h-4 w-4 rotate-90" />
                          <span>{selectedOrder.shippingAddress.phone}</span>
                        </div>
                        <div className="pt-6 border-t border-gray-200">
                          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Shipping Address</p>
                          <p className="text-sm font-bold text-gray-600 leading-relaxed">
                            {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}<br />
                            {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.zipCode}, {selectedOrder.shippingAddress.country}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Order Status & Payment</h3>
                      <div className="space-y-4">
                        <div className="relative">
                          <select 
                            value={selectedOrder.status}
                            onChange={(e) => updateStatus(selectedOrder.id, e.target.value as any)}
                            className="w-full bg-white border-2 border-gray-100 rounded-[1.5rem] px-8 py-5 font-black text-gray-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all appearance-none outline-none"
                          >
                            <option value="pending">Pending Approval</option>
                            <option value="processing">Processing Order</option>
                            <option value="shipped">Shipped to Customer</option>
                            <option value="delivered">Delivered Successfully</option>
                            <option value="cancelled">Order Cancelled</option>
                          </select>
                          <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>
                        <div className="bg-gray-900 p-8 rounded-[2rem] text-white flex items-center justify-between shadow-2xl shadow-gray-900/20">
                          <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Amount</p>
                            <p className="text-3xl font-black tracking-tight">₹{selectedOrder.totalAmount.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Payment</p>
                            <p className="text-sm font-black text-emerald-400 uppercase tracking-widest">{selectedOrder.paymentStatus}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Single Product */}
                  <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Product Ordered</h3>
                    <div className="bg-gray-50 rounded-[2rem] p-6 flex items-center gap-6">
                      <img 
                        src={(selectedOrder as any).productImage || selectedOrder.items?.[0]?.image || ''} 
                        alt={(selectedOrder as any).productTitle || selectedOrder.items?.[0]?.title || ''} 
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-black text-gray-900 text-lg">{(selectedOrder as any).productTitle || selectedOrder.items?.[0]?.title || 'N/A'}</h4>
                        <p className="text-gray-500 text-sm">₹{(selectedOrder as any).price || selectedOrder.items?.[0]?.price || 0} × {(selectedOrder as any).quantity || selectedOrder.items?.[0]?.quantity || 1}</p>
                        <p className="font-black text-xl text-blue-600 mt-2">₹{selectedOrder.totalAmount}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-10 border-t border-gray-100 bg-gray-50/50 flex items-center space-x-4">
                  <button 
                    onClick={() => downloadShippingLabel(selectedOrder)}
                    className="flex-1 bg-gray-900 text-white py-5 rounded-2xl font-black text-sm hover:bg-gray-800 transition-all flex items-center justify-center shadow-xl shadow-gray-900/10"
                  >
                    <Printer className="h-5 w-5 mr-3" /> Print Shipping Label
                  </button>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="px-10 bg-white border border-gray-200 text-gray-600 py-5 rounded-2xl font-black text-sm hover:bg-gray-100 transition-all"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
