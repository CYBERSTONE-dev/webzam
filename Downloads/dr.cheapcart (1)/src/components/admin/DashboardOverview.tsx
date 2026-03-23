import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Order, Product, UserProfile, Category } from '../../types';
import { 
  BarElement, 
  CategoryScale, 
  Chart as ChartJS, 
  Legend, 
  LinearScale, 
  LineElement, 
  PointElement, 
  Title, 
  Tooltip,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { TrendingUp, ShoppingBag, Package, Users, AlertTriangle, Loader2, ArrowUpRight, ArrowDownRight, DollarSign, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

import { handleFirestoreError, OperationType } from '../../utils/firestoreErrorHandler';

export const DashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    lowStockProducts: 0,
  });

  const [salesData, setSalesData] = useState({
    labels: [] as string[],
    revenue: [] as number[],
    orders: [] as number[],
  });

  const [categoryData, setCategoryData] = useState({
    labels: [] as string[],
    data: [] as number[],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersSnap, productsSnap, usersSnap, categoriesSnap] = await Promise.all([
          getDocs(collection(db, 'orders')).catch(e => handleFirestoreError(e, OperationType.LIST, 'orders')),
          getDocs(collection(db, 'products')).catch(e => handleFirestoreError(e, OperationType.LIST, 'products')),
          getDocs(collection(db, 'users')).catch(e => handleFirestoreError(e, OperationType.LIST, 'users')),
          getDocs(collection(db, 'categories')).catch(e => handleFirestoreError(e, OperationType.LIST, 'categories'))
        ]);

        const orders = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        const products = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        const users = usersSnap.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
        const categories = categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

        const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
        const todayRevenue = orders.filter(o => o.createdAt >= today).reduce((acc, o) => acc + o.totalAmount, 0);
        const monthlyRevenue = orders.filter(o => o.createdAt >= thisMonth).reduce((acc, o) => acc + o.totalAmount, 0);

        setStats({
          totalRevenue,
          todayRevenue,
          monthlyRevenue,
          totalOrders: orders.length,
          pendingOrders: orders.filter(o => o.status === 'pending').length,
          completedOrders: orders.filter(o => o.status === 'delivered').length,
          totalCustomers: users.length,
          totalProducts: products.length,
          lowStockProducts: products.filter(p => p.stock <= 10).length,
        });

        const labels = [];
        const revenue = [];
        const orderCounts = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });
          labels.push(dateStr);
          
          const start = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
          const end = start + 86400000;
          const dayOrders = orders.filter(o => o.createdAt >= start && o.createdAt < end);
          revenue.push(dayOrders.reduce((acc, o) => acc + o.totalAmount, 0));
          orderCounts.push(dayOrders.length);
        }

        setSalesData({ labels, revenue, orders: orderCounts });

        const catLabels = categories.slice(0, 5).map(c => c.name);
        const catCounts = categories.slice(0, 5).map(c => {
          return products.filter(p => Array.isArray(p.category) ? p.category.includes(c.name) : p.category === c.name).length;
        });
        setCategoryData({ labels: catLabels, data: catCounts });

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 space-y-6">
      <div className="relative">
        <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 bg-blue-100 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xl font-black text-gray-900">Analyzing Business Data</p>
        <p className="text-gray-500 font-bold mt-1">Fetching latest insights from your store...</p>
      </div>
    </div>
  );

  const lineChartData = {
    labels: salesData.labels,
    datasets: [
      {
        label: 'Revenue',
        data: salesData.revenue,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ],
  };

  const barChartData = {
    labels: salesData.labels,
    datasets: [
      {
        label: 'Orders',
        data: salesData.orders,
        backgroundColor: '#6366f1',
        borderRadius: 12,
        hoverBackgroundColor: '#4f46e5',
      }
    ],
  };

  const doughnutData = {
    labels: categoryData.labels,
    datasets: [
      {
        data: categoryData.data,
        backgroundColor: [
          '#2563eb',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
        ],
        borderWidth: 8,
        borderColor: '#fff',
        hoverOffset: 15,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#111827',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' as const },
        bodyFont: { size: 13 },
        cornerRadius: 8,
        displayColors: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { display: true, color: '#f1f5f9' },
        border: { display: false },
        ticks: { font: { weight: 'bold' as const, size: 11 }, color: '#94a3b8' }
      },
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { font: { weight: 'bold' as const, size: 11 }, color: '#94a3b8' }
      }
    }
  };

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Revenue" 
          value={`₹${stats.totalRevenue.toLocaleString()}`} 
          icon={DollarSign} 
          trend="+12.5%" 
          isPositive={true}
          color="blue" 
        />
        <StatCard 
          label="Total Orders" 
          value={stats.totalOrders} 
          icon={ShoppingBag} 
          trend="+8.2%" 
          isPositive={true}
          color="purple" 
        />
        <StatCard 
          label="Total Customers" 
          value={stats.totalCustomers} 
          icon={Users} 
          trend="+5.4%" 
          isPositive={true}
          color="emerald" 
        />
        <StatCard 
          label="Low Stock Items" 
          value={stats.lowStockProducts} 
          icon={AlertTriangle} 
          trend={stats.lowStockProducts > 0 ? "Action Required" : "All Good"} 
          isPositive={stats.lowStockProducts === 0}
          color="red" 
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-gray-900">Revenue Overview</h3>
              <p className="text-sm font-bold text-gray-400">Weekly performance tracking</p>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 p-1 rounded-xl">
              <button className="px-4 py-2 bg-white shadow-sm rounded-lg text-xs font-black text-gray-900">Revenue</button>
              <button className="px-4 py-2 text-xs font-black text-gray-400 hover:text-gray-900">Orders</button>
            </div>
          </div>
          <div className="h-[400px]">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-gray-900 mb-2">Category Share</h3>
          <p className="text-sm font-bold text-gray-400 mb-8">Product distribution by category</p>
          <div className="h-[300px] relative flex items-center justify-center">
            <Doughnut data={doughnutData} options={{ 
              cutout: '75%',
              plugins: { legend: { display: false } }
            }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-gray-900">{stats.totalProducts}</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Products</span>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            {categoryData.labels.map((label, i) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: doughnutData.datasets[0].backgroundColor[i] }}></div>
                  <span className="text-sm font-bold text-gray-600">{label}</span>
                </div>
                <span className="text-sm font-black text-gray-900">{categoryData.data[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Charts & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-gray-900 mb-8">Order Volume</h3>
          <div className="h-[300px]">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <TrendingUp className="h-64 w-64" />
          </div>
          <div className="relative z-10 h-full flex flex-col">
            <div className="bg-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-8">
              <Calendar className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-3xl font-black mb-4 leading-tight">Monthly Growth<br />Insights</h3>
            <p className="text-gray-400 font-bold text-lg mb-8 max-w-sm">
              Your store has seen a <span className="text-emerald-400">12% increase</span> in revenue this month. 
              Top performing category is <span className="text-blue-400">Electronics</span>.
            </p>
            <div className="mt-auto flex items-center space-x-4">
              <button className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-black text-sm hover:bg-gray-100 transition-all">
                View Full Report
              </button>
              <button className="text-white/60 hover:text-white font-black text-sm transition-all">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, trend, isPositive, color }: any) => {
  const colors: any = {
    blue: 'bg-blue-600 shadow-blue-100',
    emerald: 'bg-emerald-500 shadow-emerald-100',
    purple: 'bg-purple-600 shadow-purple-100',
    red: 'bg-red-500 shadow-red-100',
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-6">
        <div className={`${colors[color]} w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg`}>
          <Icon className="h-7 w-7 text-white" />
        </div>
        <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
          isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
        }`}>
          {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          <span>{trend}</span>
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{label}</p>
        <p className="text-4xl font-black text-gray-900 tracking-tight">{value}</p>
      </div>
    </motion.div>
  );
};
