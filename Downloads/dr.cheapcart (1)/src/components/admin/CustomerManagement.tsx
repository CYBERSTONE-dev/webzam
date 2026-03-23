import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { UserProfile, Order } from '../../types';
import { 
  Search, 
  User, 
  Mail, 
  Phone, 
  ShoppingBag, 
  ChevronRight, 
  Download, 
  X, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight,
  Shield,
  Clock,
  Package,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';

export const CustomerManagement = () => {
  const [customers, setCustomers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<{ profile: UserProfile, orders: Order[] } | null>(null);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setCustomers(snap.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile)));
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDetails = async (customer: UserProfile) => {
    setFetchingDetails(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const customerOrders = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Order))
        .filter(o => o.userId === customer.uid);
      
      setSelectedCustomer({ profile: customer, orders: customerOrders });
    } catch (error) {
      console.error("Error fetching customer details:", error);
    } finally {
      setFetchingDetails(false);
    }
  };

  const exportCustomers = () => {
    const data = customers.map(c => ({
      'Name': c.displayName,
      'Email': c.email,
      'Phone': c.phone || 'N/A',
      'Joined Date': new Date(c.createdAt).toLocaleDateString(),
      'Role': c.role
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Customers');
    XLSX.writeFile(wb, `customers_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const filteredCustomers = customers.filter(c => 
    c.displayName.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: 'Total Customers', value: customers.length, icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'New This Month', value: customers.filter(c => new Date(c.createdAt).getMonth() === new Date().getMonth()).length, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Admins', value: customers.filter(c => c.role === 'admin').length, icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Recent Signups', value: customers.filter(c => Date.now() - c.createdAt < 86400000 * 7).length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Customer Management</h1>
          <p className="text-gray-500 mt-1">Monitor user activity, purchase history, and account roles.</p>
        </div>
        <button 
          onClick={exportCustomers}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm"
        >
          <Download className="h-5 w-5" />
          Export Customer List
        </button>
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

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by name, email, or phone..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-gray-900 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select className="flex-1 md:flex-none px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-gray-900">
            <option>All Roles</option>
            <option>Customer</option>
            <option>Admin</option>
          </select>
          <select className="flex-1 md:flex-none px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-gray-900">
            <option>Joined Date</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Customer Profile</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Contact Details</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Registration</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Access Level</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                        <p className="text-sm font-medium text-gray-500">Loading customers...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 bg-gray-50 rounded-full">
                          <User className="h-8 w-8 text-gray-300" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">No customers found matching your search.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <motion.tr 
                      key={customer.uid}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform">
                            {customer.displayName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{customer.displayName}</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">ID: {customer.uid.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Mail className="h-3.5 w-3.5 text-gray-400" />
                            {customer.email}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Phone className="h-3.5 w-3.5 text-gray-400" />
                            {customer.phone || 'No phone provided'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {new Date(customer.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          customer.role === 'admin' 
                            ? 'bg-purple-50 text-purple-700 border border-purple-100' 
                            : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}>
                          <Shield className="h-3 w-3" />
                          {customer.role}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => fetchCustomerDetails(customer)}
                          disabled={fetchingDetails}
                          className="inline-flex items-center gap-1 px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                        >
                          Details
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </td>
                    </motion.tr>
                  )
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomer(null)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[2.5rem] max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-700 to-gray-900" />
              
              {/* Modal Header */}
              <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-3xl bg-gray-900 text-white flex items-center justify-center text-3xl font-black shadow-xl shadow-gray-200">
                    {selectedCustomer.profile.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-bold text-gray-900">{selectedCustomer.profile.displayName}</h2>
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        selectedCustomer.profile.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {selectedCustomer.profile.role}
                      </span>
                    </div>
                    <p className="text-gray-500 mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Member since {new Date(selectedCustomer.profile.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-6 rounded-3xl space-y-4 border border-gray-100/50">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Email Address</span>
                        <span className="text-sm font-bold text-gray-900">{selectedCustomer.profile.email}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</span>
                        <span className="text-sm font-bold text-gray-900">{selectedCustomer.profile.phone || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-3xl space-y-4 border border-gray-100/50">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      Shopping Activity
                    </h3>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-4xl font-black text-gray-900">{selectedCustomer.orders.length}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Orders</p>
                      </div>
                      <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                        <Package className="h-6 w-6" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-3xl space-y-4 border border-gray-100/50">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Financial Value
                    </h3>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-4xl font-black text-emerald-600">₹{selectedCustomer.orders.reduce((acc, o) => acc + o.totalAmount, 0).toLocaleString()}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Lifetime Spent</p>
                      </div>
                      <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                        <ArrowUpRight className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order History Table */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Recent Order History
                    </h3>
                    <button className="text-xs font-bold text-blue-600 hover:underline">View All Orders</button>
                  </div>
                  <div className="border border-gray-100 rounded-3xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50/50">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {selectedCustomer.orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <span className="text-xs font-bold text-gray-900 font-mono">#{order.id.slice(-8).toUpperCase()}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-gray-900">
                              ₹{order.totalAmount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {order.status === 'delivered' && <CheckCircle2 className="h-3 w-3" />}
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {selectedCustomer.orders.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center gap-2">
                                <Package className="h-8 w-8 text-gray-200" />
                                <p className="text-sm font-medium text-gray-400">No purchase history available.</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                >
                  Close Profile
                </button>
                <button className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
                  Manage Account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
