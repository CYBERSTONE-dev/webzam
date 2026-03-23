import React from 'react';
import { ShieldCheck, Heart, Users, Target, Award, Globe } from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="relative h-[500px] rounded-[3rem] overflow-hidden mb-20">
        <img 
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&q=80" 
          alt="Our Team" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/40 flex items-center p-12">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              The "Doctor" for Your <br /> <span className="text-blue-500">Shopping Needs</span>
            </h1>
            <p className="text-gray-300 text-xl leading-relaxed">
              At dr.cheapcart, we believe that quality shouldn't be a luxury. Our mission is to prescribe the best products at the most affordable prices for everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
        <div>
          <div className="inline-flex items-center space-x-2 text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">
            <Target className="h-4 w-4" />
            <span>Our Mission</span>
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-8">Bridging the gap between quality and affordability.</h2>
          <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
            <p>
              Founded in 2024, dr.cheapcart started with a simple observation: the market was divided between high-priced luxury goods and low-quality cheap alternatives. We saw an opportunity to act as a "doctor" for the consumer—diagnosing the best value products and making them accessible to everyone.
            </p>
            <p>
              Our team of expert curators scours the globe to find manufacturers who prioritize quality without the brand markup. We then pass those savings directly to you, ensuring that your "cart" is always full but your wallet stays healthy.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-blue-50 p-8 rounded-[2.5rem] text-center">
            <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-black text-gray-900 mb-2">Trustworthy</h4>
            <p className="text-gray-500 text-sm">Every product is vetted for quality and durability.</p>
          </div>
          <div className="bg-emerald-50 p-8 rounded-[2.5rem] text-center mt-12">
            <div className="bg-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-black text-gray-900 mb-2">Customer First</h4>
            <p className="text-gray-500 text-sm">Your satisfaction is our primary prescription.</p>
          </div>
          <div className="bg-orange-50 p-8 rounded-[2.5rem] text-center">
            <div className="bg-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-200">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-black text-gray-900 mb-2">Global Reach</h4>
            <p className="text-gray-500 text-sm">Sourcing the best from around the world.</p>
          </div>
          <div className="bg-purple-50 p-8 rounded-[2.5rem] text-center mt-12">
            <div className="bg-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-200">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-black text-gray-900 mb-2">Best Prices</h4>
            <p className="text-gray-500 text-sm">Unbeatable value in every single category.</p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-900 rounded-[4rem] p-16 text-white mb-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Why Choose dr.cheapcart?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            We're not just another online store. We're a customer-focused service approach dedicated to your shopping health.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="text-blue-500 text-5xl font-black opacity-20">01</div>
            <h3 className="text-2xl font-bold">Quality Diagnosis</h3>
            <p className="text-gray-400 leading-relaxed">
              Just like a doctor examines a patient, we examine every product. If it doesn't meet our strict quality standards, it doesn't make it to our store.
            </p>
          </div>
          <div className="space-y-4">
            <div className="text-blue-500 text-5xl font-black opacity-20">02</div>
            <h3 className="text-2xl font-bold">Price Prescription</h3>
            <p className="text-gray-400 leading-relaxed">
              We prescribe the lowest possible price by cutting out middlemen and optimizing our supply chain. You get factory-direct prices on premium goods.
            </p>
          </div>
          <div className="space-y-4">
            <div className="text-blue-500 text-5xl font-black opacity-20">03</div>
            <h3 className="text-2xl font-bold">Aftercare Support</h3>
            <p className="text-gray-500 leading-relaxed">
              Our relationship doesn't end at checkout. Our support team is always ready to help with any issues, ensuring a smooth recovery for any shopping hiccups.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="text-center mb-20">
        <h2 className="text-4xl font-black text-gray-900 mb-16">Meet Our Lead "Doctors"</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { name: 'Dr. Alex Chen', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
            { name: 'Sarah Jenkins', role: 'Head of Quality', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
            { name: 'Michael Ross', role: 'Supply Chain Lead', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
          ].map((member) => (
            <div key={member.name} className="group">
              <div className="aspect-square rounded-[3rem] overflow-hidden mb-6 grayscale group-hover:grayscale-0 transition-all duration-500">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <h4 className="text-xl font-black text-gray-900">{member.name}</h4>
              <p className="text-blue-600 font-bold">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
