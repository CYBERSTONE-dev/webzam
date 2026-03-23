import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Package, CreditCard, RotateCcw, Wallet, Info, Phone, Shield, AlertTriangle, Search, MessageCircle } from 'lucide-react';

const faqData = [
  {
    category: 'Orders & Delivery',
    icon: Package,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    questions: [
      {
        q: 'How does your store work?',
        a: 'We source products from multiple trusted suppliers across India and deliver them directly to your doorstep. This allows us to offer a wide variety of products at affordable prices.'
      },
      {
        q: 'How long does delivery take?',
        a: 'Orders are usually delivered within 4–8 business days depending on your location and product availability.'
      },
      {
        q: 'Why does delivery time vary?',
        a: 'Since products are shipped from different supplier locations, delivery timelines may vary slightly.'
      },
      {
        q: 'Can I track my order?',
        a: 'Yes, once your order is shipped, you will receive a tracking link via SMS/email.'
      }
    ]
  },
  {
    category: 'Payments',
    icon: CreditCard,
    color: 'text-green-600',
    bg: 'bg-green-50',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept: UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards, Net Banking, and Cash on Delivery (available on selected products).'
      },
      {
        q: 'Is Cash on Delivery available?',
        a: 'Yes, COD is available on most products depending on your location.'
      }
    ]
  },
  {
    category: 'Returns & Refunds',
    icon: RotateCcw,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'Most products are eligible for return within 7 days of delivery, subject to verification and approval.'
      },
      {
        q: 'What conditions must be met for a return?',
        a: 'Product must be unused, unwashed, and in original packaging. All tags and accessories must be intact. Return request must be raised within 7 days.'
      },
      {
        q: 'Is an unboxing video required?',
        a: 'Yes. An unboxing video is mandatory for claims related to damaged, missing, or wrong items. Claims without video proof may not be accepted.'
      },
      {
        q: 'Which items are non-returnable?',
        a: 'For hygiene and safety reasons, the following cannot be returned: Innerwear, Beauty and personal care products, Grooming items, and certain clearance products.'
      },
      {
        q: 'Are all return requests approved?',
        a: 'No. All return requests go through a verification process. We reserve the right to reject requests that do not meet our policy conditions.'
      }
    ]
  },
  {
    category: 'Refunds',
    icon: Wallet,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    questions: [
      {
        q: 'When will I receive my refund?',
        a: 'Refunds are processed within 5–10 business days after successful pickup and verification.'
      },
      {
        q: 'How will I receive my refund?',
        a: 'Prepaid orders → refunded to original payment method. Cash on Delivery (COD) → refunded to your bank account.'
      },
      {
        q: 'What details are required for COD refunds?',
        a: 'You may be asked to provide Bank account number and IFSC code via a secure link for refund processing.'
      }
    ]
  },
  {
    category: 'Important Product Information',
    icon: Info,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    questions: [
      {
        q: 'Will the product look exactly like the images?',
        a: 'Slight differences in color, design, or packaging may occur due to lighting effects and supplier variations.'
      },
      {
        q: 'Why do some returns or refunds take time?',
        a: 'All returns go through a supplier verification process, which may take a few days before approval.'
      }
    ]
  },
  {
    category: 'Support & Issue Resolution',
    icon: Phone,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    questions: [
      {
        q: 'How can I contact support?',
        a: 'You can contact us via Email, WhatsApp, or the Website contact form.'
      },
      {
        q: 'How do I raise a complaint or return request?',
        a: 'Go to My Orders → Select Product → Raise Request or contact our support team.'
      },
      {
        q: 'How long does it take to resolve issues?',
        a: 'Most issues, return requests, or complaints are resolved within 7–10 business days.'
      }
    ]
  },
  {
    category: 'Policy & Misuse',
    icon: Shield,
    color: 'text-red-600',
    bg: 'bg-red-50',
    questions: [
      {
        q: 'Can my return request be rejected?',
        a: 'Yes, if the request does not meet our policy conditions or lacks required proof.'
      },
      {
        q: 'Do you take action against misuse?',
        a: 'Yes. We reserve the right to refuse service, cancel orders, or block accounts in case of repeated returns, suspicious activity, or policy misuse.'
      }
    ]
  }
];

export const FAQ = () => {
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const filteredData = faqData.map(section => ({
    ...section,
    questions: section.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.questions.length > 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-bold mb-4">
          <MessageCircle className="h-4 w-4" />
          <span>Help Center</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
          Find answers to common questions about orders, payments, returns, and more.
        </p>
        
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for answers..."
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-base focus:border-blue-500 focus:bg-white transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-8">
        {filteredData.map((section, categoryIndex) => (
          <section key={section.category} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
            <div className={`${section.bg} p-6 md:p-8`}>
              <div className="flex items-center gap-3">
                <div className={`${section.color} p-2 rounded-xl bg-white/80`}>
                  <section.icon className="h-6 w-6" />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-gray-900">{section.category}</h2>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {section.questions.map((item, questionIndex) => {
                const key = `${categoryIndex}-${questionIndex}`;
                const isOpen = openQuestions.has(key);
                return (
                  <div key={key}>
                    <button
                      onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                      className="w-full flex items-center justify-between p-6 md:p-8 text-left hover:bg-gray-50/50 transition-all"
                    >
                      <span className="font-bold text-gray-900 pr-4">{item.q}</span>
                      <ChevronDown className={`h-5 w-5 text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-6 md:px-8 pb-6 md:pb-8 -mt-2">
                        <p className="text-gray-600 leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-500">Try searching with different keywords</p>
        </div>
      )}

      <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-[2.5rem] p-8 md:p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-6">
          <Phone className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl md:text-3xl font-black text-white mb-4">Still have questions?</h3>
        <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
          Can't find what you're looking for? Our support team is here to help you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/contact"
            className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all"
          >
            Contact Us
          </Link>
          <a
            href="mailto:support@drcheapcart.com"
            className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all"
          >
            Email Support
          </a>
        </div>
      </div>
    </div>
  );
};
