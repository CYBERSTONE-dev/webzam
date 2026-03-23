import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { Order, Address } from '../../types';
import { 
  Download, 
  MapPin, 
  Search, 
  Phone, 
  User, 
  Copy, 
  Check, 
  ExternalLink, 
  Navigation, 
  MoreVertical,
  Calendar,
  Package,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';

export const ShippingAddressManagement = () => {
  const [addresses, setAddresses] = useState<{ address: Address, orderId: string, date: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const orders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      
      const addrList = orders.map(o => ({
        address: o.shippingAddress,
        orderId: o.id,
        date: o.createdAt
      }));
      
      setAddresses(addrList);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const data = filteredAddresses.map(item => ({
      'Customer Name': item.address.fullName,
      'Phone Number': item.address.phone,
      'Street Address': item.address.street,
      'City': item.address.city,
      'State': item.address.state,
      'ZIP Code': item.address.zipCode,
      'Country': item.address.country,
      'Order ID': item.orderId,
      'Date': new Date(item.date).toLocaleDateString()
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Shipping Addresses');
    XLSX.writeFile(wb, `shipping_addresses_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const copyToClipboard = (item: any, id: string) => {
    const text = `${item.address.fullName}\n${item.address.phone}\n${item.address.street}\n${item.address.city}, ${item.address.state} - ${item.address.zipCode}`;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredAddresses = addresses.filter(item => 
    item.address.fullName.toLowerCase().includes(search.toLowerCase()) ||
    item.address.phone.includes(search) ||
    item.address.zipCode.includes(search) ||
    item.address.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Shipping Logistics</h1>
          <p className="text-gray-500 mt-1">Manage delivery destinations and export address data for fulfillment partners.</p>
        </div>
        <button 
          onClick={exportToExcel}
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
        >
          <Download className="h-5 w-5" />
          Export for Fulfillment
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by name, phone, city or zip..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-gray-900 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select className="flex-1 md:flex-none px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-gray-900">
            <option>All Regions</option>
            <option>North India</option>
            <option>South India</option>
            <option>East India</option>
            <option>West India</option>
          </select>
          <select className="flex-1 md:flex-none px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-gray-900">
            <option>Latest Orders</option>
            <option>Oldest First</option>
          </select>
        </div>
      </div>

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white h-64 rounded-[2.5rem] border border-gray-100 animate-pulse" />
            ))
          ) : filteredAddresses.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-gray-50 rounded-full">
                  <MapPin className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-500">No shipping addresses found matching your criteria.</p>
              </div>
            </div>
          ) : (
            filteredAddresses.map((item, idx) => (
              <motion.div 
                key={`${item.orderId}-${idx}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col"
              >
                <div className="p-8 flex-1">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-900 text-white p-3 rounded-2xl shadow-lg shadow-gray-200">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{item.address.fullName}</h3>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                          <Package className="h-3 w-3" />
                          Order #{item.orderId.slice(-8).toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-700 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {item.address.phone}
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-blue-50/30 rounded-2xl border border-blue-50">
                      <MapPin className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                      <div className="text-sm leading-relaxed text-gray-600">
                        <p className="font-bold text-gray-900">{item.address.street}</p>
                        <p>{item.address.city}, {item.address.state}</p>
                        <p className="font-black text-gray-900 mt-1">{item.address.zipCode}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">{item.address.country}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-5 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <Calendar className="h-3 w-3" />
                    {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => copyToClipboard(item, item.orderId)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        copiedId === item.orderId 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {copiedId === item.orderId ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedId === item.orderId ? 'Copied' : 'Copy'}
                    </button>
                    <button className="p-2 bg-white text-gray-400 hover:text-blue-600 border border-gray-200 rounded-xl transition-all">
                      <Navigation className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Logistics Summary Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 p-8 rounded-[3rem] text-white relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
          <Navigation className="h-32 w-32" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-black tracking-tight">Ready for Fulfillment?</h2>
            <p className="text-gray-400 max-w-md">Download the latest shipping manifest to streamline your delivery process with Meesho or other partners.</p>
          </div>
          <button 
            onClick={exportToExcel}
            className="px-8 py-4 bg-white text-gray-900 rounded-[2rem] font-black hover:bg-gray-100 transition-all flex items-center gap-3 shadow-xl"
          >
            Generate Manifest
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
