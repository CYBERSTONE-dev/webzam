import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { LogIn } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const Login = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error?.message || 'Unknown error';
      showToast(`Login failed: ${errorMessage}`, 'error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl border border-gray-100 shadow-xl space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter text-blue-600">dr.cheapcart</h1>
          <p className="text-gray-500">Welcome back! Please login to your account.</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-200 py-4 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="h-6 w-6" alt="Google" />
          <span>Continue with Google</span>
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">Secure Authentication</span></div>
        </div>

        <p className="text-xs text-gray-400">
          By continuing, you agree to dr.cheapcart's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};
