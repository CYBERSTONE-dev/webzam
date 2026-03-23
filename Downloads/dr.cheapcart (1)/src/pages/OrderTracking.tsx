import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowRight, Copy, CheckCircle } from 'lucide-react';

export const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      navigate(`/track-order/${orderId.trim()}`);
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setOrderId(text);
    } catch (err) {
      console.log('Could not read clipboard');
    }
  };

  const copyOrderId = () => {
    if (orderId.trim()) {
      navigator.clipboard.writeText(orderId.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-3xl mb-4 shadow-lg shadow-blue-200">
            <Package className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-500">Enter your Order ID to see delivery status</p>
        </div>

        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Order ID
                </label>
                <button 
                  type="button"
                  onClick={pasteFromClipboard}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Paste from clipboard
                </button>
              </div>
              <div className="relative">
                <Package className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Enter your Order ID" 
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pl-14 pr-14 py-4 text-lg font-mono focus:border-blue-500 transition-all outline-none"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  required
                />
                {orderId && (
                  <button 
                    type="button"
                    onClick={copyOrderId}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {copied ? <CheckCircle className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
                  </button>
                )}
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Find your Order ID in your confirmation email or dashboard
              </p>
            </div>

            <button 
              type="submit" 
              disabled={!orderId.trim()}
              className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Track Order
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-center text-gray-500 text-sm">
              Need help finding your order?{' '}
              <a href="/contact" className="text-blue-600 font-bold hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {[
            { title: 'Delivery Time', desc: '4-8 business days' },
            { title: 'Track via SMS', desc: 'Link sent after shipping' },
            { title: 'Need Help?', desc: '24/7 Support' }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
              <p className="font-bold text-gray-900">{item.title}</p>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
