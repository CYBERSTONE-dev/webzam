import React from 'react';
import { Truck, ShieldCheck, RotateCcw, BadgeIndianRupee, Smile } from 'lucide-react';

export const TrustBanner = () => {
  return (
    <div className="bg-gray-50">
      {/* Customer Satisfaction Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-3 md:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2 md:space-x-3">
            <Smile className="h-4 w-4 md:h-5 md:w-5 text-yellow-300 fill-yellow-300" />
            <span className="text-white font-bold text-xs md:text-sm">Customer Satisfaction</span>
            <span className="text-blue-200">|</span>
            <span className="text-blue-100 text-xs md:text-sm">10,000+ happy customers across India</span>
          </div>
        </div>
      </div>

      {/* Trust Badges - Under the banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          <div className="flex items-center space-x-2 md:space-x-3 bg-white p-2 md:p-3 rounded-xl shadow-sm">
            <div className="bg-blue-100 p-1.5 md:p-2 rounded-lg">
              <Truck className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
            </div>
            <span className="font-bold text-[10px] md:text-xs text-gray-800 whitespace-nowrap">Pan India Delivery</span>
          </div>
          <div className="flex items-center space-x-2 md:space-x-3 bg-white p-2 md:p-3 rounded-xl shadow-sm">
            <div className="bg-emerald-100 p-1.5 md:p-2 rounded-lg">
              <ShieldCheck className="h-3 w-3 md:h-4 md:w-4 text-emerald-600" />
            </div>
            <span className="font-bold text-[10px] md:text-xs text-gray-800 whitespace-nowrap">100% Safe Payments</span>
          </div>
          <div className="flex items-center space-x-2 md:space-x-3 bg-white p-2 md:p-3 rounded-xl shadow-sm">
            <div className="bg-orange-100 p-1.5 md:p-2 rounded-lg">
              <RotateCcw className="h-3 w-3 md:h-4 md:w-4 text-orange-600" />
            </div>
            <span className="font-bold text-[10px] md:text-xs text-gray-800 whitespace-nowrap">7-Day Replacement</span>
          </div>
          <div className="flex items-center space-x-2 md:space-x-3 bg-white p-2 md:p-3 rounded-xl shadow-sm">
            <div className="bg-purple-100 p-1.5 md:p-2 rounded-lg">
              <BadgeIndianRupee className="h-3 w-3 md:h-4 md:w-4 text-purple-600" />
            </div>
            <span className="font-bold text-[10px] md:text-xs text-gray-800 whitespace-nowrap">Best Prices</span>
          </div>
        </div>
      </div>
    </div>
  );
};
