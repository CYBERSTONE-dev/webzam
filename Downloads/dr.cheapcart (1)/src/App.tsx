import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { MobileHeader } from './components/MobileHeader';
import { Footer } from './components/Footer';
import { MobileNav } from './components/MobileNav';
import { Newsletter } from './components/Newsletter';
import { GlobalToast } from './components/Toast';
import { AnnouncementBar } from './components/AnnouncementBar';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Home } from './pages/Home';
import { Loader2 } from 'lucide-react';

const Catalog = lazy(() => import('./pages/Catalog').then(m => ({ default: m.Catalog })));
const ProductDetail = lazy(() => import('./pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Cart = lazy(() => import('./pages/Cart').then(m => ({ default: m.Cart })));
const Checkout = lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const UserDashboard = lazy(() => import('./pages/UserDashboard').then(m => ({ default: m.UserDashboard })));
const FAQ = lazy(() => import('./pages/FAQ').then(m => ({ default: m.FAQ })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const OrderTracking = lazy(() => import('./pages/OrderTracking').then(m => ({ default: m.OrderTracking })));
const OrderTrackingDetails = lazy(() => import('./pages/OrderTrackingDetails').then(m => ({ default: m.OrderTrackingDetails })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const Terms = lazy(() => import('./pages/Terms').then(m => ({ default: m.Terms })));
const Returns = lazy(() => import('./pages/Returns').then(m => ({ default: m.Returns })));
const Orders = lazy(() => import('./pages/Orders').then(m => ({ default: m.Orders })));

const Loading = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
  </div>
);

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return <Loading />;
  return isAdmin ? <>{children}</> : <Navigate to="/" />;
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <Router>
            <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
              <AnnouncementBar />
              <Navbar />
              <MobileHeader />
              <main className="flex-grow">
                <Suspense fallback={<Loading />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/track-order" element={<OrderTracking />} />
                    <Route path="/track-order/:orderId" element={<OrderTrackingDetails />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/returns" element={<Returns />} />
                    <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
                    
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    
                    <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
                    <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
                    
                    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  </Routes>
                </Suspense>
              </main>
              <MobileNav />
              <Newsletter />
              <Footer />
              <WhatsAppButton />
            </div>
          </Router>
          <GlobalToast />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
