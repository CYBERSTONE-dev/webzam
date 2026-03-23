import React from 'react';
import { Shield, Lock, Eye, FileText, Users, AlertTriangle, Mail } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Shield className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-500">Last Updated: March 21, 2026</p>
      </div>

      <div className="prose prose-blue max-w-none bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <Eye className="h-6 w-6 mr-3 text-blue-500" />
            1. Information We Collect
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            At dr.cheapcart, we collect information to provide better services to all our users. The types of personal information we collect include:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li><strong>Personal Information:</strong> Name, email address, and phone number</li>
            <li><strong>Shipping Information:</strong> Shipping and billing addresses</li>
            <li><strong>Payment Information:</strong> Processed securely via third-party payment providers. We do not store your complete card details.</li>
            <li><strong>Order Information:</strong> Order history, preferences, and product selections</li>
            <li><strong>Device Information:</strong> IP address, browser type, and device identifiers</li>
            <li><strong>Bank Details:</strong> For Cash on Delivery refunds, we may collect bank account number and IFSC code through a secure process</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <Lock className="h-6 w-6 mr-3 text-blue-500" />
            2. How We Use Your Information
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We use the information we collect for various purposes, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Processing and fulfilling your orders</li>
            <li>Communicating with you about your orders, deliveries, and promotions</li>
            <li>Improving our website and customer service</li>
            <li>Preventing fraud and ensuring security</li>
            <li>Processing refunds, including COD refunds to your bank account</li>
            <li>Complying with legal obligations</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <Users className="h-6 w-6 mr-3 text-blue-500" />
            3. Information Sharing
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We may share your information with:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li><strong>Suppliers:</strong> To fulfill and deliver orders, we share necessary order details with our trusted suppliers and shipping partners</li>
            <li><strong>Payment Providers:</strong> Third-party payment processors for secure transaction handling</li>
            <li><strong>Service Providers:</strong> Companies that assist us in operating our website and services</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
          </ul>
          <div className="bg-blue-50 rounded-2xl p-4 mt-4">
            <p className="text-blue-700 text-sm">
              <strong>Note:</strong> We do not sell your personal information to third parties.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <Shield className="h-6 w-6 mr-3 text-blue-500" />
            4. Data Security
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We implement a variety of security measures to maintain the safety of your personal information:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Personal information is contained behind secured networks</li>
            <li>Access is limited to authorized personnel only</li>
            <li>Payment information is encrypted using secure socket layer (SSL) technology</li>
            <li>Bank details for refunds are handled through secure, encrypted channels</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <FileText className="h-6 w-6 mr-3 text-blue-500" />
            5. Cookies and Tracking
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We use cookies and similar technologies to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Remember and process items in your shopping cart</li>
            <li>Understand and save your preferences for future visits</li>
            <li>Compile aggregate data about site traffic and site interaction</li>
            <li>Track order status and delivery updates</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <Lock className="h-6 w-6 mr-3 text-blue-500" />
            6. Data Retention
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Processing and fulfilling orders</li>
            <li>Providing customer support</li>
            <li>Processing returns and refunds</li>
            <li>Complying with legal obligations</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <Shield className="h-6 w-6 mr-3 text-blue-500" />
            7. Your Rights
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Access your personal information</li>
            <li>Correct inaccurate or incomplete data</li>
            <li>Request deletion of your data (subject to legal requirements)</li>
            <li>Opt out of marketing communications</li>
            <li>Raise concerns about how we handle your data</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <AlertTriangle className="h-6 w-6 mr-3 text-amber-500" />
            8. Account & Policy Enforcement
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            To ensure fair use of our services and protect against fraud:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>We may monitor account activity for suspicious behavior</li>
            <li>Repeated policy violations may result in account restrictions</li>
            <li>We reserve the right to block accounts involved in fraudulent activity</li>
            <li>Your data may be used in fraud prevention efforts</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <FileText className="h-6 w-6 mr-3 text-blue-500" />
            9. Children's Privacy
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Our services are not intended for users under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <FileText className="h-6 w-6 mr-3 text-blue-500" />
            10. Changes to This Policy
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
          </p>
        </section>

        <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 mt-12">
          <h4 className="font-black text-blue-900 mb-2">Questions about our Privacy Policy?</h4>
          <p className="text-blue-700 text-sm mb-4">
            If you have any questions regarding this privacy policy, you may contact us at:
          </p>
          <div className="flex items-center text-blue-700 font-bold">
            <Mail className="h-5 w-5 mr-2" />
            privacy@drcheapcart.com
          </div>
        </div>
      </div>
    </div>
  );
};
