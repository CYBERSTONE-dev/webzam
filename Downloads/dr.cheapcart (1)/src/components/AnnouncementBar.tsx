import React, { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';

const announcements = [
  'Welcome to Dr. Cheapcart!',
  'Cash on Delivery Available',
  'Pan India Delivery',
  'New Deals Every Day',
  'Thank You For Your Visit!'
];

export const AnnouncementBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white py-2 overflow-hidden relative">
      <div className="flex items-center justify-center">
        <div className="absolute left-4 flex items-center">
          <Volume2 className="h-4 w-4 animate-pulse" />
        </div>
        <div className="w-full px-12">
          <div
            key={currentIndex}
            className="text-center font-semibold text-sm md:text-base animate-fade-in"
          >
            {announcements[currentIndex]}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
      `}</style>
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1.5">
        {announcements.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === currentIndex ? 'w-4 bg-white' : 'w-1 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
