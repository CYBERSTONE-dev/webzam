import React from 'react';
import { Mail, Phone, Clock, MapPin, Send, MessageSquare, HelpCircle } from 'lucide-react';

export const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-20">
        <h1 className="text-5xl font-black text-gray-900 mb-6">Get in Touch</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Have a question about a product or an order? Our support "doctors" are ready to help you with any inquiry.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
        {/* Contact Info Cards */}
        <div className="bg-blue-600 rounded-[3rem] p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-8">Contact Information</h2>
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-3 rounded-2xl">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-100 mb-1">Email Us</h4>
                  <p className="text-xl font-bold">support@drcheapcart.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-3 rounded-2xl">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-100 mb-1">Call Us</h4>
                  <p className="text-xl font-bold">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-3 rounded-2xl">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-100 mb-1">Service Hours</h4>
                  <p className="text-xl font-bold">Mon - Sat: 9AM - 8PM</p>
                  <p className="text-sm text-blue-200">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 relative z-10">
            <div className="flex space-x-4">
              <div className="bg-white/10 p-4 rounded-2xl flex-1 text-center">
                <MessageSquare className="h-6 w-6 mx-auto mb-2" />
                <span className="text-xs font-bold uppercase tracking-widest">Live Chat</span>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl flex-1 text-center">
                <HelpCircle className="h-6 w-6 mx-auto mb-2" />
                <span className="text-xs font-bold uppercase tracking-widest">Help Center</span>
              </div>
            </div>
          </div>

          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-blue-400/20 rounded-full"></div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
          <h2 className="text-3xl font-black text-gray-900 mb-8">Send us a Message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest ml-2">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest ml-2">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-widest ml-2">Subject</label>
              <select className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 transition-all appearance-none">
                <option>General Inquiry</option>
                <option>Order Status</option>
                <option>Returns & Refunds</option>
                <option>Product Question</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-widest ml-2">Message</label>
              <textarea 
                rows={5} 
                placeholder="How can we help you today?" 
                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              ></textarea>
            </div>
            <button className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-600 transition-all flex items-center justify-center space-x-3 shadow-xl shadow-gray-200">
              <Send className="h-5 w-5" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-gray-100 rounded-[3rem] h-[400px] overflow-hidden relative group">
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-bold">Interactive Map Loading...</p>
          </div>
        </div>
        {/* Placeholder for actual map */}
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.142293761308!2d-73.98731968459391!3d40.75889497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1625123456789!5m2!1sen!2sus" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy"
          className="grayscale group-hover:grayscale-0 transition-all duration-700"
        ></iframe>
      </div>
    </div>
  );
};
