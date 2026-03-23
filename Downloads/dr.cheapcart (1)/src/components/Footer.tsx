import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white pt-12 md:pt-16 pb-4 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
          <div className="space-y-4 md:space-y-6">
            <Link to="/" className="text-2xl md:text-3xl font-black tracking-tighter text-blue-500 block">
              dr.cheapcart
            </Link>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              Your trusted "doctor" for finding high-quality products at the most affordable prices. We bridge the gap between quality and cost for your everyday needs.
            </p>
            <div className="flex space-x-3 md:space-x-4">
              <a href="#" className="bg-white/5 p-2 rounded-lg hover:bg-blue-600 transition-all" aria-label="Follow us on Facebook"><Facebook className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" /></a>
              <a href="#" className="bg-white/5 p-2 rounded-lg hover:bg-blue-400 transition-all" aria-label="Follow us on Twitter"><Twitter className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" /></a>
              <a href="#" className="bg-white/5 p-2 rounded-lg hover:bg-pink-600 transition-all" aria-label="Follow us on Instagram"><Instagram className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" /></a>
              <a href="#" className="bg-white/5 p-2 rounded-lg hover:bg-red-600 transition-all" aria-label="Subscribe on YouTube"><Youtube className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 md:mb-8 text-base md:text-lg uppercase tracking-widest text-blue-400">Quick Links</h4>
            <ul className="space-y-3 md:space-y-4 text-gray-400 text-sm md:text-base">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/catalog" className="hover:text-white transition-colors">Shop All</Link></li>
              <li><Link to="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 md:mb-8 text-base md:text-lg uppercase tracking-widest text-blue-400">Customer Service</h4>
            <ul className="space-y-3 md:space-y-4 text-gray-400 text-sm md:text-base">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Return Policy</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 md:mb-8 text-base md:text-lg uppercase tracking-widest text-blue-400">Contact Info</h4>
            <ul className="space-y-3 md:space-y-4 text-gray-400 text-sm md:text-base">
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 text-blue-500 shrink-0" />
                <span>123 Commerce Way, Digital City, 56789</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 md:h-5 md:w-5 text-blue-500 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 md:h-5 md:w-5 text-blue-500 shrink-0" />
                <span>support@drcheapcart.com</span>
              </li>
            </ul>
            <div className="mt-6 md:mt-8">
              <h5 className="font-bold mb-3 md:mb-4 text-xs md:text-sm uppercase text-gray-500">Newsletter</h5>
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-white/5 border-none rounded-l-xl px-3 md:px-4 py-2 md:py-3 w-full text-sm md:text-base focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button className="bg-blue-600 px-4 md:px-6 rounded-r-xl font-bold hover:bg-blue-700 transition-all text-sm md:text-base">
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs md:text-sm">
            © 2026 dr.cheapcart. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 md:space-x-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-3 md:h-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-4 md:h-6 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" alt="PayPal" className="h-3 md:h-5 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
          </div>
        </div>
      </div>
    </footer>
  );
};
