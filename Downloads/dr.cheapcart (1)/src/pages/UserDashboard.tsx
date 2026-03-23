import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Order, Address } from '../types';
import { Package, MapPin, Settings, ChevronRight, ShoppingBag, Clock, User, LogOut, CreditCard, Bell, Plus, Trash2, Edit, Check, X, Phone, Mail, Home as HomeIcon, Briefcase, Eye, EyeOff, RotateCcw, AlertTriangle, Upload, Image, Video, MessageSquare, Truck, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

type TabType = 'addresses' | 'payments' | 'settings';

interface ReturnRequest {
  id: string;
  orderId: string;
  orderItemId: string;
  itemTitle: string;
  itemImage: string;
  itemPrice: number;
  reason: string;
  description: string;
  videoUrl: string;
  photoUrls: string[];
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  createdAt: number;
  userId: string;
  userName: string;
  userEmail: string;
}

export const UserDashboard = () => {
  const { user, profile, logout } = useAuth();
  const { addToCart } = useCart();
  
  const [activeTab, setActiveTab] = useState<TabType>('addresses');
  const [orders, setOrders] = useState<Order[]>([]);
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState<Partial<Address>>({
    fullName: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    type: 'home'
  });
  const [name, setName] = useState(profile?.displayName || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [showPassword, setShowPassword] = useState(false);

  // Return request modal state
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [returnReason, setReturnReason] = useState('');
  const [returnDescription, setReturnDescription] = useState('');
  const [returnVideoFile, setReturnVideoFile] = useState<File | null>(null);
  const [returnPhotoFiles, setReturnPhotoFiles] = useState<File[]>([]);
  const [submittingReturn, setSubmittingReturn] = useState(false);

  // Order detail modal state
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [orderDetail, setOrderDetail] = useState<Order | null>(null);

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'pending': return 0;
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'delivered': return 'from-emerald-500 to-emerald-600';
      case 'shipped': return 'from-blue-500 to-blue-600';
      case 'processing': return 'from-yellow-400 to-yellow-500';
      case 'cancelled': return 'from-red-500 to-red-600';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-500';
      case 'shipped': return 'bg-blue-500';
      case 'processing': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-200';
    }
  };

  const handleViewOrderDetail = (order: Order) => {
    setOrderDetail(order);
    setShowOrderDetail(true);
  };

  const tabs = [
    { id: 'addresses' as TabType, icon: MapPin, label: 'Saved Addresses' },
    { id: 'payments' as TabType, icon: CreditCard, label: 'Payment Methods' },
    { id: 'settings' as TabType, icon: Settings, label: 'Account Settings' }
  ];

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchReturnRequests();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReturnRequests = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, 'returnRequests'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      setReturnRequests(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReturnRequest)));
    } catch (error) {
      console.error('Error fetching return requests:', error);
    }
  };

  const getReturnStatusForItem = (orderId: string, itemId: string) => {
    return returnRequests.find(r => r.orderId === orderId && r.orderItemId === itemId);
  };

  const handleOpenReturnModal = (order: Order, item: any) => {
    setSelectedOrder(order);
    setSelectedItem(item);
    setReturnReason('');
    setReturnDescription('');
    setReturnVideoFile(null);
    setReturnPhotoFiles([]);
    setShowReturnModal(true);
  };

  const handleSubmitReturnRequest = async () => {
    if (!user || !selectedOrder || !selectedItem || !returnReason) return;
    
    setSubmittingReturn(true);
    try {
      // In a real app, you would upload files to storage and get URLs
      // For now, we'll store the file names as placeholders
      const returnData = {
        orderId: selectedOrder.id,
        orderItemId: selectedItem.id,
        itemTitle: selectedItem.title || selectedItem.name || 'Unknown Item',
        itemImage: selectedItem.image || '',
        itemPrice: selectedItem.price || 0,
        reason: returnReason,
        description: returnDescription,
        videoUrl: returnVideoFile?.name || '',
        photoUrls: returnPhotoFiles.map(f => f.name),
        status: 'pending' as const,
        createdAt: Date.now(),
        userId: user.uid,
        userName: profile?.displayName || 'User',
        userEmail: profile?.email || ''
      };

      await addDoc(collection(db, 'returnRequests'), returnData);
      
      // Refresh return requests
      await fetchReturnRequests();
      
      setShowReturnModal(false);
      alert('Return request submitted successfully! We will review it within 7-10 business days.');
    } catch (error) {
      console.error('Error submitting return request:', error);
      alert('Failed to submit return request. Please try again.');
    } finally {
      setSubmittingReturn(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!user || !addressForm.fullName || !addressForm.phone || !addressForm.street) return;
    
    try {
      if (editingAddress && profile?.addresses?.find(a => a === editingAddress)) {
        const updatedAddresses = profile.addresses.map(a => 
          a === editingAddress ? addressForm as Address : a
        );
        await updateDoc(doc(db, 'users', user.uid), { addresses: updatedAddresses });
      } else {
        const newAddress = addressForm as Address;
        await updateDoc(doc(db, 'users', user.uid), {
          addresses: [...(profile?.addresses || []), newAddress]
        });
      }
      setShowAddressModal(false);
      setEditingAddress(null);
      setAddressForm({ fullName: '', phone: '', email: '', street: '', city: '', state: '', zipCode: '', country: 'India', type: 'home' });
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleDeleteAddress = async (address: Address) => {
    if (!user || !profile?.addresses) return;
    try {
      const updatedAddresses = profile.addresses.filter(a => a !== address);
      await updateDoc(doc(db, 'users', user.uid), { addresses: updatedAddresses });
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: name,
        phone: phone
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-50 text-emerald-600';
      case 'shipped': return 'bg-blue-50 text-blue-600';
      case 'processing': return 'bg-yellow-50 text-yellow-600';
      case 'cancelled': return 'bg-red-50 text-red-600';
      case 'pending': return 'bg-amber-50 text-amber-600';
      case 'under_review': return 'bg-purple-50 text-purple-600';
      case 'approved': return 'bg-emerald-50 text-emerald-600';
      case 'rejected': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const getReturnStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Under Evaluation';
      case 'under_review': return 'Under Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-100 pt-12 pb-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-xl shadow-blue-200">
                  <span className="text-3xl font-black text-white">
                    {profile?.displayName?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 border-4 border-white w-6 h-6 rounded-full shadow-lg"></div>
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900 mb-1">Welcome, {profile?.displayName}!</h1>
                <p className="text-gray-400 font-bold text-xs flex items-center">
                  <Mail className="h-3 w-3 mr-1" /> {profile?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/contact" className="bg-gray-50 p-3 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                <Bell className="h-5 w-5" />
              </Link>
              <button 
                onClick={logout}
                className="bg-red-50 text-red-600 px-5 py-3 rounded-xl font-bold text-sm flex items-center hover:bg-red-100 transition-all"
              >
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="space-y-3">
            {tabs.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all group ${
                  activeTab === item.id 
                    ? 'bg-gray-900 text-white shadow-xl shadow-gray-200' 
                    : 'bg-white text-gray-500 hover:bg-blue-50 hover:text-blue-600 border border-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5" />
                  <span className="font-bold text-sm">{item.label}</span>
                </div>
                <ChevronRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${activeTab === item.id ? 'opacity-100' : 'opacity-30'}`} />
              </button>
            ))}

            {/* Support Card */}
            <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg mt-6">
              <h3 className="font-bold text-base mb-1">Need Help?</h3>
              <p className="text-blue-100 text-xs mb-4">24/7 support for your orders.</p>
              <Link to="/contact" className="bg-white/20 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-white/30 transition-all inline-block">
                Contact Us
              </Link>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* SAVED ADDRESSES */}
            {activeTab === 'addresses' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Saved Addresses</h2>
                  <button 
                    onClick={() => { setEditingAddress(null); setAddressForm({ fullName: '', phone: '', email: '', street: '', city: '', state: '', zipCode: '', country: 'India', type: 'home' }); setShowAddressModal(true); }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-700 transition-all flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> Add New
                  </button>
                </div>
                
                {profile?.addresses && profile.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.addresses.map((addr, i) => (
                      <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 relative">
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button onClick={() => { setEditingAddress(addr); setAddressForm(addr); setShowAddressModal(true); }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDeleteAddress(addr)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          {addr.type === 'work' ? <Briefcase className="h-4 w-4 text-blue-600" /> : <HomeIcon className="h-4 w-4 text-blue-600" />}
                          <span className="text-xs font-bold text-gray-400 uppercase">{addr.type}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">{addr.fullName}</h3>
                        <p className="text-sm text-gray-500 mb-1">{addr.street}, {addr.city}</p>
                        <p className="text-sm text-gray-500 mb-2">{addr.state} - {addr.zipCode}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1"><Phone className="h-3 w-3" /> {addr.phone}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-16 rounded-3xl border border-gray-100 text-center">
                    <MapPin className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Saved Addresses</h3>
                    <p className="text-gray-400 text-sm mb-4">Add an address for faster checkout.</p>
                    <button onClick={() => setShowAddressModal(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all inline-block">
                      Add Address
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* PAYMENT METHODS */}
            {activeTab === 'payments' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Methods</h2>
                
                <div className="space-y-4">
                  {[
                    { name: 'UPI', desc: 'Google Pay, PhonePe, Paytm', icon: '💳' },
                    { name: 'Debit/Credit Card', desc: 'Visa, Mastercard, RuPay', icon: '💳' },
                    { name: 'Net Banking', desc: 'All major banks supported', icon: '🏦' },
                    { name: 'Cash on Delivery', desc: 'Pay when you receive', icon: '📦' }
                  ].map((method, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{method.name}</h3>
                        <p className="text-sm text-gray-500">{method.desc}</p>
                      </div>
                      <Check className="h-5 w-5 text-emerald-500" />
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <h3 className="font-bold text-blue-900 mb-2">Secure Payments</h3>
                  <p className="text-sm text-blue-700">All transactions are encrypted and secure. Your payment information is never stored on our servers.</p>
                </div>
              </motion.div>
            )}

            {/* ACCOUNT SETTINGS */}
            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>
                
                <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-6">
                  <h3 className="font-bold text-gray-900 mb-4">Profile Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Full Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-gray-900 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Email</label>
                      <input 
                        type="email" 
                        value={profile?.email || ''}
                        disabled
                        className="w-full bg-gray-100 border-none rounded-xl px-4 py-3 font-bold text-gray-400 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Phone Number</label>
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-gray-900 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button onClick={handleUpdateProfile} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all">
                      Save Changes
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-6">
                  <h3 className="font-bold text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="Current Password"
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 pr-12"
                      />
                      <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="New Password"
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-gray-900 focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all">
                      Update Password
                    </button>
                  </div>
                </div>
                
                <div className="bg-red-50 rounded-3xl border border-red-100 p-6">
                  <h3 className="font-bold text-red-900 mb-2">Danger Zone</h3>
                  <p className="text-sm text-red-700 mb-4">Once you delete your account, there is no going back.</p>
                  <button className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-red-700 transition-all">
                    Delete Account
                  </button>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* Address Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl w-full max-w-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                <button onClick={() => setShowAddressModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Full Name *</label>
                  <input type="text" value={addressForm.fullName} onChange={(e) => setAddressForm({...addressForm, fullName: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Phone *</label>
                  <input type="tel" value={addressForm.phone} onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Email</label>
                  <input type="email" value={addressForm.email} onChange={(e) => setAddressForm({...addressForm, email: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Street Address *</label>
                  <input type="text" value={addressForm.street} onChange={(e) => setAddressForm({...addressForm, street: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">City</label>
                    <input type="text" value={addressForm.city} onChange={(e) => setAddressForm({...addressForm, city: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">State</label>
                    <input type="text" value={addressForm.state} onChange={(e) => setAddressForm({...addressForm, state: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">ZIP Code</label>
                    <input type="text" value={addressForm.zipCode} onChange={(e) => setAddressForm({...addressForm, zipCode: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Type</label>
                    <select value={addressForm.type} onChange={(e) => setAddressForm({...addressForm, type: e.target.value as 'home' | 'work'})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-blue-500">
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                    </select>
                  </div>
                </div>
                <button onClick={handleSaveAddress} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all mt-4">
                  {editingAddress ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Return Request Modal */}
      <AnimatePresence>
        {showReturnModal && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="bg-white rounded-3xl w-full max-w-lg p-6 md:p-8 my-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-orange-500" />
                  Return Request
                </h3>
                <button onClick={() => setShowReturnModal(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Selected Item */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl mb-6">
                <img src={selectedItem.image} alt={selectedItem.title} className="w-16 h-16 rounded-lg object-cover" referrerPolicy="no-referrer" />
                <div className="flex-1">
                  <p className="font-bold text-gray-900 truncate">{selectedItem.title}</p>
                  <p className="text-gray-500 text-sm">₹{selectedItem.price} × {selectedItem.quantity}</p>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-800 font-bold text-sm mb-1">Important</p>
                    <ul className="text-amber-700 text-xs space-y-1">
                      <li>• Unboxing video is <strong>mandatory</strong> for all claims</li>
                      <li>• Return window: <strong>7 days</strong> from delivery</li>
                      <li>• Requests are verified before approval</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Reason Selection */}
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Reason for Return *</label>
                  <select 
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-bold focus:border-blue-500 outline-none"
                    required
                  >
                    <option value="">Select a reason</option>
                    <option value="damaged">Product is Damaged</option>
                    <option value="wrong_item">Wrong Item Received</option>
                    <option value="not_as_described">Not as Described</option>
                    <option value="defective">Defective/Not Working</option>
                    <option value="missing_parts">Missing Parts/Accessories</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Description</label>
                  <textarea
                    value={returnDescription}
                    onChange={(e) => setReturnDescription(e.target.value)}
                    placeholder="Please describe the issue in detail..."
                    rows={3}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 font-medium focus:border-blue-500 outline-none resize-none"
                  />
                </div>

                {/* Video Upload */}
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Unboxing Video (Mandatory)
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <input 
                      type="file" 
                      accept="video/*"
                      onChange={(e) => setReturnVideoFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="video-upload"
                    />
                    <label htmlFor="video-upload" className="cursor-pointer">
                      {returnVideoFile ? (
                        <div className="flex items-center justify-center gap-2 text-emerald-600">
                          <Check className="h-5 w-5" />
                          <span className="font-bold text-sm">{returnVideoFile.name}</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm font-medium">Click to upload video</p>
                          <p className="text-gray-400 text-xs mt-1">MP4, MOV up to 50MB</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Photos (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      onChange={(e) => setReturnPhotoFiles(Array.from(e.target.files || []))}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      {returnPhotoFiles.length > 0 ? (
                        <div className="flex items-center justify-center gap-2 text-emerald-600">
                          <Check className="h-5 w-5" />
                          <span className="font-bold text-sm">{returnPhotoFiles.length} photo(s) selected</span>
                        </div>
                      ) : (
                        <>
                          <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm font-medium">Click to upload photos</p>
                          <p className="text-gray-400 text-xs mt-1">JPG, PNG up to 5MB each</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitReturnRequest}
                  disabled={!returnReason || submittingReturn}
                  className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 mt-6 ${
                    !returnReason || submittingReturn
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-200'
                  }`}
                >
                  {submittingReturn ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-5 w-5" />
                      Submit Return Request
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {showOrderDetail && orderDetail && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] max-w-2xl w-full overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${getStatusBg(orderDetail.status)} p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={() => setShowOrderDetail(false)}
                    className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-bold capitalize">
                    {orderDetail.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Order ID</p>
                    <p className="text-2xl font-black">#{orderDetail.id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="text-3xl font-black">₹{orderDetail.totalAmount}</p>
                  </div>
                </div>
              </div>

              {/* Progress Steps */}
              {orderDetail.status !== 'cancelled' && (
                <div className="p-6 bg-gray-50">
                  <div className="relative mb-6">
                    <div className="absolute top-5 left-0 right-0 h-2 bg-gray-200 rounded-full"></div>
                    <div 
                      className={`absolute top-5 left-0 h-2 rounded-full transition-all duration-700 ${getProgressBarColor(orderDetail.status)}`}
                      style={{ width: `${Math.min(100, (getStatusStep(orderDetail.status) / 3) * 100)}%` }}
                    ></div>
                    
                    <div className="relative flex justify-between">
                      {[
                        { icon: Clock, label: 'Ordered', step: 0 },
                        { icon: Package, label: 'Processed', step: 1 },
                        { icon: Truck, label: 'Shipped', step: 2 },
                        { icon: CheckCircle, label: 'Delivered', step: 3 }
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                            getStatusStep(orderDetail.status) >= item.step 
                              ? 'bg-emerald-500 text-white shadow-lg' 
                              : 'bg-gray-200 text-gray-400'
                          }`}>
                            <item.icon className="h-5 w-5" />
                          </div>
                          <span className={`text-xs font-bold ${
                            getStatusStep(orderDetail.status) >= item.step ? 'text-gray-900' : 'text-gray-400'
                          }`}>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`rounded-xl p-4 ${
                    orderDetail.status === 'delivered' ? 'bg-emerald-50' :
                    orderDetail.status === 'shipped' ? 'bg-blue-50' :
                    'bg-yellow-50'
                  }`}>
                    <p className={`font-bold ${
                      orderDetail.status === 'delivered' ? 'text-emerald-800' :
                      orderDetail.status === 'shipped' ? 'text-blue-800' :
                      'text-yellow-800'
                    }`}>
                      {orderDetail.status === 'delivered' ? 'Your order has been delivered!' :
                       orderDetail.status === 'shipped' ? 'Your order is on the way!' :
                       orderDetail.status === 'processing' ? 'Your order is being prepared!' :
                       'Order received!'}
                    </p>
                    <p className={`text-sm mt-1 ${
                      orderDetail.status === 'delivered' ? 'text-emerald-600' :
                      orderDetail.status === 'shipped' ? 'text-blue-600' :
                      'text-yellow-600'
                    }`}>
                      {orderDetail.status === 'shipped' ? 'Estimated delivery in 4-8 business days' :
                       orderDetail.status === 'delivered' ? `Delivered on ${new Date(orderDetail.createdAt + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}` :
                       'We will update you once shipped'}
                    </p>
                  </div>
                </div>
              )}

              {/* Product Details */}
              <div className="p-6">
                <h3 className="text-lg font-black text-gray-900 mb-4">Product Ordered</h3>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  <img 
                    src={(orderDetail as any).productImage || orderDetail.items?.[0]?.image || ''} 
                    alt={(orderDetail as any).productTitle || orderDetail.items?.[0]?.title || ''} 
                    className="w-24 h-24 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-lg">{(orderDetail as any).productTitle || orderDetail.items?.[0]?.title || 'N/A'}</p>
                    <p className="text-gray-500">₹{(orderDetail as any).price || orderDetail.items?.[0]?.price || 0} × {(orderDetail as any).quantity || orderDetail.items?.[0]?.quantity || 1}</p>
                    <p className="font-black text-xl text-blue-600 mt-2">₹{orderDetail.totalAmount}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="p-6 border-t border-gray-100">
                <h3 className="text-lg font-black text-gray-900 mb-4">Shipping Address</h3>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="font-bold text-gray-900">{(orderDetail as any).shippingAddress?.fullName || orderDetail.shippingAddress?.fullName}</p>
                  <p className="text-gray-600 text-sm mt-1">{(orderDetail as any).shippingAddress?.street || orderDetail.shippingAddress?.street}</p>
                  <p className="text-gray-600 text-sm">{(orderDetail as any).shippingAddress?.city || orderDetail.shippingAddress?.city}, {(orderDetail as any).shippingAddress?.state || orderDetail.shippingAddress?.state} - {(orderDetail as any).shippingAddress?.zipCode || orderDetail.shippingAddress?.zipCode}</p>
                  <p className="text-gray-500 text-sm mt-2">📞 {(orderDetail as any).shippingAddress?.phone || orderDetail.shippingAddress?.phone}</p>
                </div>
              </div>

              {/* Payment Info */}
              <div className="p-6 border-t border-gray-100">
                <h3 className="text-lg font-black text-gray-900 mb-4">Payment Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-400 text-xs font-bold uppercase mb-1">Method</p>
                    <p className="font-bold text-gray-900 capitalize">{(orderDetail as any).paymentMethod || orderDetail.paymentMethod || 'COD'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-400 text-xs font-bold uppercase mb-1">Status</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                      (orderDetail as any).paymentStatus === 'paid' || orderDetail.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {(orderDetail as any).paymentStatus || orderDetail.paymentStatus || 'pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Date */}
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <p className="text-gray-400 text-xs font-bold uppercase">Order Date</p>
                <p className="font-bold text-gray-900">{new Date(orderDetail.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100 flex gap-4">
                <button 
                  onClick={() => setShowOrderDetail(false)}
                  className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all"
                >
                  Close
                </button>
                <Link 
                  to="/contact"
                  className="flex-1 bg-blue-50 text-blue-600 py-4 rounded-2xl font-bold hover:bg-blue-100 transition-all text-center"
                >
                  Need Help?
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
