import React, { useState } from 'react';
import { Mail, Check, ArrowRight, Heart, Users } from 'lucide-react';
import { motion } from 'motion/react';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.5" fill="white" fillOpacity="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          {/* Decorative Circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 px-6 py-10 md:px-12 md:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="text-center lg:text-left flex-1">
              <div className="inline-flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-4 md:mb-6">
                <Users className="h-4 w-4" />
                <span>Join Our Community</span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-3 md:mb-4">
                Be Part of the <span className="italic font-serif">dr.cheapcart</span> Family
              </h2>
              <p className="text-blue-100 text-sm md:text-base max-w-xl mx-auto lg:mx-0">
                Get exclusive deals, early access to new products, and special offers delivered straight to your inbox. We're glad you're here!
              </p>
            </div>

            {/* Right Form */}
            <div className="w-full lg:w-auto">
              {subscribed ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white/20 backdrop-blur-md rounded-2xl p-6 md:p-8 text-center"
                >
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="h-6 w-6 text-emerald-500" />
                  </div>
                  <h3 className="text-white font-bold text-lg">Welcome to the Family!</h3>
                  <p className="text-blue-100 text-sm">You're now part of our community.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-white rounded-xl md:rounded-2xl pl-12 pr-4 py-3 md:py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Subscribe to newsletter"
                    className="bg-white text-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm md:text-base flex items-center justify-center space-x-2 hover:shadow-xl transition-all shadow-lg"
                  >
                    <Heart className={`h-4 w-4 md:h-5 md:w-5 ${isHovered ? 'fill-red-500 text-red-500' : ''}`} aria-hidden="true" />
                    <span>Subscribe</span>
                    <ArrowRight className={`h-4 w-4 md:h-5 md:w-5 transition-transform ${isHovered ? 'translate-x-1' : ''}`} aria-hidden="true" />
                  </motion.button>
                </form>
              )}
              <p className="text-blue-200 text-xs mt-3 text-center">
                No spam, ever. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-4 md:h-8 bg-white/10" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 0)' }}></div>
      </motion.div>
    </section>
  );
};
