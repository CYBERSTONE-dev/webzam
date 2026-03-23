import React, { useState } from 'react';
import { 
  Package, ShoppingBag, Users, 
  TrendingUp, Layout,
  LogOut, Menu, X, Ticket,
  BarChart3, Bell, Search, ChevronRight, Settings, RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

import { DashboardOverview } from '../components/admin/DashboardOverview';
import { OrderManagement } from '../components/admin/OrderManagement';
import { CustomerManagement } from '../components/admin/CustomerManagement';
import { InventoryManagement } from '../components/admin/InventoryManagement';
import { SalesReport } from '../components/admin/SalesReport';
import { CouponManagement } from '../components/admin/CouponManagement';
import { ProductManagement } from '../components/admin/ProductManagement';
import { ReturnRequestManagement } from '../components/admin/ReturnRequestManagement';
import { ErrorBoundary } from '../components/ErrorBoundary';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'inventory' | 'coupons' | 'reports' | 'returns'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Layout },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'returns', label: 'Returns', icon: RotateCcw },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'inventory', label: 'Inventory', icon: TrendingUp },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'coupons', label: 'Coupons', icon: Ticket },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-[#F8FAFC]">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 transition-transform duration-500 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-8 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-xl">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div className="text-xl font-black text-white tracking-tighter uppercase">DR.CHEAPCART</div>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Sidebar Navigation */}
            <nav className="flex-1 px-6 space-y-2 overflow-y-auto custom-scrollbar">
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 px-4">Main Menu</div>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all group ${
                    activeTab === tab.id 
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <tab.icon className={`h-5 w-5 transition-colors ${activeTab === tab.id ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
                    <span className="font-black text-sm">{tab.label}</span>
                  </div>
                  {activeTab === tab.id && (
                    <motion.div layoutId="active-indicator" className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </button>
              ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-6 mt-auto border-t border-white/5">
              <div className="bg-white/5 p-6 rounded-3xl mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white">
                    {profile?.displayName?.charAt(0) || 'A'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-white truncate">{profile?.displayName || 'Admin'}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Administrator</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 py-3 text-red-400 font-black text-xs hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout System</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Header */}
          <header className="bg-white border-b border-gray-100 h-20 flex items-center justify-between px-8 sticky top-0 z-40">
            <div className="flex items-center space-x-4">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-gray-400 hover:text-gray-900">
                <Menu className="h-6 w-6" />
              </button>
              <div className="hidden md:flex items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 w-96 group focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <Search className="h-4 w-4 text-gray-400 mr-3" />
                <input 
                  type="text" 
                  placeholder="Search orders, products, customers..." 
                  className="bg-transparent border-none outline-none text-sm font-bold text-gray-900 w-full placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <button className="relative p-3 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                </button>
                <button className="p-3 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all">
                  <Settings className="h-5 w-5" />
                </button>
              </div>
              <div className="h-8 w-px bg-gray-100"></div>
              <div className="flex items-center space-x-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-gray-900 leading-none mb-1">{profile?.displayName || 'Admin'}</p>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Online Now</p>
                </div>
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-black text-sm">
                  {profile?.displayName?.charAt(0) || 'A'}
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            <div className="max-w-[1600px] mx-auto">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    <span>Admin</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-blue-600">{tabs.find(t => t.id === activeTab)?.label}</span>
                  </div>
                  <h1 className="text-4xl font-black text-gray-900">{tabs.find(t => t.id === activeTab)?.label}</h1>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'overview' && <DashboardOverview />}
                  {activeTab === 'products' && <ProductManagement />}
                  {activeTab === 'orders' && <OrderManagement />}
                  {activeTab === 'returns' && <ReturnRequestManagement />}
                  {activeTab === 'customers' && <CustomerManagement />}
                  {activeTab === 'inventory' && <InventoryManagement />}
                  {activeTab === 'coupons' && <CouponManagement />}
                  {activeTab === 'reports' && <SalesReport />}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};
