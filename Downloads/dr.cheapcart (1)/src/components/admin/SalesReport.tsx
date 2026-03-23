import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { Order } from '../../types';
import { 
  Download, 
  Calendar, 
  Filter, 
  TrendingUp, 
  ShoppingBag, 
  Tag, 
  FileText, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  Search,
  RefreshCcw,
  BarChart3,
  PieChart as PieChartIcon,
  Layers
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

export const SalesReport = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'>('monthly');
  const [dateRange, setDateRange] = useState({ 
    start: format(subDays(new Date(), 30), 'yyyy-MM-dd'), 
    end: format(new Date(), 'yyyy-MM-dd') 
  });
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [period, dateRange]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const ordersRef = collection(db, 'orders');
      let q = query(ordersRef, orderBy('createdAt', 'desc'));
      
      const snap = await getDocs(q);
      let allOrders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));

      const now = new Date();
      let start: Date, end: Date;

      switch (period) {
        case 'daily':
          start = startOfDay(now);
          end = endOfDay(now);
          break;
        case 'weekly':
          start = startOfWeek(now);
          end = endOfWeek(now);
          break;
        case 'monthly':
          start = startOfMonth(now);
          end = endOfMonth(now);
          break;
        case 'yearly':
          start = startOfYear(now);
          end = endOfYear(now);
          break;
        case 'custom':
          start = new Date(dateRange.start);
          end = endOfDay(new Date(dateRange.end));
          break;
        default:
          start = startOfMonth(now);
          end = endOfMonth(now);
      }

      const filtered = allOrders.filter(o => o.createdAt >= start.getTime() && o.createdAt <= end.getTime());
      setOrders(filtered);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalRevenue: orders.reduce((acc, o) => acc + o.totalAmount, 0),
    orderCount: orders.length,
    avgOrderValue: orders.length > 0 ? Math.round(orders.reduce((acc, o) => acc + o.totalAmount, 0) / orders.length) : 0,
    conversionRate: '3.2%', // Mock data for UI
    revenueGrowth: '+12.5%',
    orderGrowth: '+8.2%'
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(31, 41, 55);
    doc.text('SALES PERFORMANCE REPORT', 105, 25, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 35);
    doc.text(`Reporting Period: ${period.toUpperCase()}`, 20, 40);
    
    // Stats Box
    doc.setDrawColor(229, 231, 235);
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(20, 50, 170, 30, 3, 3, 'FD');
    
    doc.setFontSize(12);
    doc.setTextColor(31, 41, 55);
    doc.text(`Total Revenue: INR ${stats.totalRevenue.toLocaleString()}`, 30, 60);
    doc.text(`Total Orders: ${stats.orderCount}`, 30, 70);
    doc.text(`Avg Order Value: INR ${stats.avgOrderValue.toLocaleString()}`, 110, 60);

    const tableData = orders.map(o => [
      o.id.slice(-8).toUpperCase(),
      o.shippingAddress.fullName,
      `INR ${o.totalAmount.toLocaleString()}`,
      o.status.toUpperCase(),
      new Date(o.createdAt).toLocaleDateString()
    ]);

    (doc as any).autoTable({
      startY: 90,
      head: [['Order ID', 'Customer', 'Amount', 'Status', 'Date']],
      body: tableData,
      headStyles: { fillColor: [31, 41, 55], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      margin: { top: 90 }
    });

    doc.save(`sales_report_${period}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportExcel = () => {
    const data = orders.map(o => ({
      'Order ID': o.id,
      'Customer': o.shippingAddress.fullName,
      'Amount': o.totalAmount,
      'Status': o.status,
      'Date': new Date(o.createdAt).toLocaleString(),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales');
    XLSX.writeFile(wb, `sales_report_${period}.xlsx`);
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    o.shippingAddress.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Sales Analytics</h1>
          <p className="text-gray-500 mt-1">Monitor revenue trends, order volume, and customer purchasing behavior.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <button 
            onClick={fetchOrders}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-sm"
          >
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <div className="flex items-center gap-2 flex-1 lg:flex-none">
            <button 
              onClick={exportPDF} 
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-all"
            >
              <FileText className="h-4 w-4" />
              PDF
            </button>
            <button 
              onClick={exportExcel} 
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-100 transition-all"
            >
              <Download className="h-4 w-4" />
              Excel
            </button>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center gap-6">
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="p-2 bg-gray-50 rounded-lg">
            <Filter className="h-4 w-4 text-gray-400" />
          </div>
          <div className="flex bg-gray-50 p-1 rounded-xl w-full lg:w-auto overflow-x-auto no-scrollbar">
            {['daily', 'weekly', 'monthly', 'yearly', 'custom'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p as any)}
                className={`flex-1 lg:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  period === p 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {period === 'custom' && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 w-full lg:w-auto"
          >
            <div className="relative flex-1 lg:w-40">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="date" 
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-gray-900"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <span className="text-gray-300 font-bold">to</span>
            <div className="relative flex-1 lg:w-40">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="date" 
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-gray-900"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </motion.div>
        )}

        <div className="lg:ml-auto w-full lg:w-72 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search orders..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-gray-900 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 p-6 rounded-[2.5rem] text-white relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp className="h-24 w-24" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-center">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-1 text-xs font-bold bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-lg">
                <ArrowUpRight className="h-3 w-3" />
                {stats.revenueGrowth}
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-black mt-1">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group"
        >
          <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-center">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-1 text-xs font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg">
                <ArrowUpRight className="h-3 w-3" />
                {stats.orderGrowth}
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-black text-gray-900 mt-1">{stats.orderCount}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group"
        >
          <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-center">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Tag className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-1 text-xs font-bold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg">
                <ArrowUpRight className="h-3 w-3" />
                +5.4%
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Avg Order Value</p>
              <p className="text-3xl font-black text-gray-900 mt-1">₹{stats.avgOrderValue.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group"
        >
          <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-center">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <PieChartIcon className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-1 text-xs font-bold bg-red-50 text-red-600 px-2.5 py-1 rounded-lg">
                <ArrowDownRight className="h-3 w-3" />
                -1.2%
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Conversion Rate</p>
              <p className="text-3xl font-black text-gray-900 mt-1">{stats.conversionRate}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Transaction History</h3>
            <p className="text-sm text-gray-500 mt-1">A detailed list of all orders within the selected period.</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-2xl">
            <Layers className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                        <p className="text-sm font-medium text-gray-500">Processing analytics data...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 bg-gray-50 rounded-full">
                          <ShoppingBag className="h-8 w-8 text-gray-300" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">No transactions found for this period.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o, idx) => (
                    <motion.tr 
                      key={o.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <span className="text-xs font-bold text-gray-500 font-mono bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 group-hover:bg-white transition-colors">
                          #{o.id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{o.shippingAddress.fullName}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{o.shippingAddress.email}</div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="text-sm font-black text-gray-900">₹{o.totalAmount.toLocaleString()}</div>
                        <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mt-0.5">Paid via {o.paymentMethod}</div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          o.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          o.status === 'shipped' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                          o.status === 'processing' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          'bg-gray-50 text-gray-600 border border-gray-100'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            o.status === 'delivered' ? 'bg-emerald-500' :
                            o.status === 'shipped' ? 'bg-blue-500' :
                            o.status === 'processing' ? 'bg-amber-500' :
                            'bg-gray-400'
                          }`} />
                          {o.status}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="text-sm font-bold text-gray-600">{new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all">
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Showing {filteredOrders.length} of {orders.length} Transactions</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-400 rounded-xl text-xs font-bold cursor-not-allowed">Previous</button>
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-900 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};
