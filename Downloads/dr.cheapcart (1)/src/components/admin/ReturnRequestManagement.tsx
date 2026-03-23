import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { RotateCcw, Search, Check, X, Eye, Clock, AlertTriangle, Image, Video, ChevronDown } from 'lucide-react';

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

export const ReturnRequestManagement = () => {
  const [requests, setRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);

  useEffect(() => {
    fetchReturnRequests();
  }, []);

  const fetchReturnRequests = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'returnRequests'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setRequests(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReturnRequest)));
    } catch (error) {
      console.error('Error fetching return requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, newStatus: 'pending' | 'under_review' | 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'returnRequests', requestId), { status: newStatus });
      fetchReturnRequests();
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">Pending</span>;
      case 'under_review':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-600 border border-purple-200">Under Review</span>;
      case 'approved':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">Approved</span>;
      case 'rejected':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-200">Rejected</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-50 text-gray-600">{status}</span>;
    }
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case 'damaged': return 'Product is Damaged';
      case 'wrong_item': return 'Wrong Item Received';
      case 'not_as_described': return 'Not as Described';
      case 'defective': return 'Defective/Not Working';
      case 'missing_parts': return 'Missing Parts/Accessories';
      case 'other': return 'Other';
      default: return reason;
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.itemTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    under_review: requests.filter(r => r.status === 'under_review').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests', count: statusCounts.all, color: 'bg-gray-900' },
          { label: 'Pending', count: statusCounts.pending, color: 'bg-amber-500' },
          { label: 'Under Review', count: statusCounts.under_review, color: 'bg-purple-500' },
          { label: 'Resolved', count: statusCounts.approved + statusCounts.rejected, color: 'bg-emerald-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-bold">{stat.label}</p>
                <p className="text-3xl font-black text-gray-900 mt-1">{stat.count}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-xl`}>
                <RotateCcw className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID, customer, product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl pl-12 pr-4 py-3 font-bold focus:border-blue-500 outline-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'under_review', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                statusFilter === status
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status === 'all' ? 'All' : status === 'under_review' ? 'Under Review' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
              <div className="h-20 bg-gray-100 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
          <RotateCcw className="h-12 w-12 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Return Requests</h3>
          <p className="text-gray-500">Return requests from customers will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Request Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedRequest(expandedRequest === request.id ? null : request.id)}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={request.itemImage} alt={request.itemTitle} className="w-16 h-16 rounded-xl object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <p className="font-bold text-gray-900">{request.itemTitle}</p>
                      <p className="text-sm text-gray-500">Order: #{request.orderId.slice(-8).toUpperCase()}</p>
                      <p className="text-sm text-gray-500">Customer: {request.userName} ({request.userEmail})</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-black text-gray-900">₹{request.itemPrice}</p>
                      <p className="text-xs text-gray-400">{new Date(request.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    {getStatusBadge(request.status)}
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${expandedRequest === request.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedRequest === request.id && (
                <div className="border-t border-gray-100 p-6 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Reason</h4>
                        <p className="font-bold text-gray-900">{getReasonLabel(request.reason)}</p>
                      </div>
                      {request.description && (
                        <div>
                          <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Description</h4>
                          <p className="text-gray-700">{request.description}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Attached Files</h4>
                        <div className="flex flex-wrap gap-2">
                          {request.videoUrl && (
                            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
                              <Video className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-600">{request.videoUrl}</span>
                            </div>
                          )}
                          {request.photoUrls.map((photo, i) => (
                            <div key={i} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
                              <Image className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-600">{photo}</span>
                            </div>
                          ))}
                          {!request.videoUrl && request.photoUrls.length === 0 && (
                            <p className="text-gray-400 text-sm">No files attached</p>
                          )}
                        </div>
                      </div>
                      {request.status === 'pending' && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-amber-800 font-bold text-sm mb-1">Action Required</p>
                              <p className="text-amber-700 text-sm">Review this request and update its status.</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {request.status === 'pending' || request.status === 'under_review' ? (
                    <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => updateRequestStatus(request.id, 'under_review')}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-600 rounded-xl font-bold text-sm hover:bg-purple-200 transition-all"
                      >
                        <Clock className="h-4 w-4" />
                        Mark Under Review
                      </button>
                      <button
                        onClick={() => updateRequestStatus(request.id, 'approved')}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-600 rounded-xl font-bold text-sm hover:bg-emerald-200 transition-all"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => updateRequestStatus(request.id, 'rejected')}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-xl font-bold text-sm hover:bg-red-200 transition-all"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => updateRequestStatus(request.id, 'pending')}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Reset to Pending
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
