import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '919037757064';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const WhatsAppButton = () => {
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight / 2 - 30 });
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef(position);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = Math.max(0, Math.min(window.innerWidth - 70, positionRef.current.x + e.clientX - dragStartRef.current.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 70, positionRef.current.y + e.clientY - dragStartRef.current.y));
      setPosition({ x: newX, y: newY });
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      const newX = Math.max(0, Math.min(window.innerWidth - 70, positionRef.current.x + touch.clientX - dragStartRef.current.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 70, positionRef.current.y + touch.clientY - dragStartRef.current.y));
      setPosition({ x: newX, y: newY });
      dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  return (
    <div
      ref={buttonRef}
      className="fixed z-50 group cursor-grab active:cursor-grabbing"
      style={{ left: position.x, top: position.y }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="relative flex items-center">
          <span className={`absolute left-full ml-3 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-opacity duration-300 pointer-events-none shadow-lg ${
            showTooltip ? 'opacity-100' : 'opacity-0'
          }`}>
            Chat with us
          </span>
          <div className="bg-green-500 p-4 rounded-full shadow-lg shadow-green-500/30 hover:bg-green-600 hover:scale-110 hover:shadow-green-500/50 transition-all duration-300">
            <MessageCircle className="h-7 w-7 text-white fill-white" />
          </div>
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
      </a>
    </div>
  );
};
