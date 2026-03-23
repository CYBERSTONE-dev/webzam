import React from 'react';
import { useToast } from '../context/ToastContext';
import { ShoppingCart, CheckCircle, XCircle, Info, X } from 'lucide-react';

export const GlobalToast: React.FC = () => {
  const { toast } = useToast();

  if (!toast.visible) return null;

  const bgColor = toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600';
  const Icon = toast.type === 'success' ? CheckCircle : toast.type === 'error' ? XCircle : Info;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-[slideDown_0.3s_ease-out]">
      <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[280px]`}>
        <div className="bg-white/20 p-2 rounded-full">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-white/90">{toast.message}</p>
        </div>
      </div>
    </div>
  );
};
