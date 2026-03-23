import React from 'react';
import { RotateCcw, PackageCheck, Truck, CreditCard, AlertTriangle, Video, CheckCircle, XCircle } from 'lucide-react';

export const Returns = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <RotateCcw className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-4">Return & Refund Policy</h1>
        <p className="text-gray-500">Last Updated: March 21, 2026</p>
      </div>

      <div className="prose prose-emerald max-w-none bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <RotateCcw className="h-6 w-6 mr-3 text-emerald-500" />
            1. Return Window
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We want you to be completely satisfied with your purchase. If you are not happy with your order, you can request a return within <strong>7 days</strong> of delivery, subject to verification and approval.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
            <p className="text-amber-800 text-sm font-medium flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
              <span>An unboxing video is <strong>mandatory</strong> for all claims related to damaged, missing, or wrong items. Claims without video proof may not be accepted.</span>
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <CheckCircle className="h-6 w-6 mr-3 text-emerald-500" />
            2. Eligibility Criteria
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            To be eligible for a return, the following conditions must be met:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Product must be <strong>unused, unwashed, and in original packaging</strong></li>
            <li>All tags and accessories must be intact</li>
            <li>Return request must be raised within <strong>7 days</strong> of delivery</li>
            <li>Proof of purchase (order ID) is required</li>
            <li>Unboxing video is required for damaged, missing, or wrong item claims</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <XCircle className="h-6 w-6 mr-3 text-red-500" />
            3. Non-Returnable Items
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            For hygiene and safety reasons, the following categories of products <strong>cannot be returned</strong>:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
              <h4 className="font-bold text-red-800 mb-2">Innerwear</h4>
              <p className="text-red-700 text-sm">All types of innerwear items</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
              <h4 className="font-bold text-red-800 mb-2">Beauty & Personal Care</h4>
              <p className="text-red-700 text-sm">Cosmetics, skincare, grooming items</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
              <h4 className="font-bold text-red-800 mb-2">Grooming Items</h4>
              <p className="text-red-700 text-sm">Personal grooming products</p>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
              <h4 className="font-bold text-red-800 mb-2">Clearance Products</h4>
              <p className="text-red-700 text-sm">Items marked as final sale/clearance</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <PackageCheck className="h-6 w-6 mr-3 text-emerald-500" />
            4. Return Request Process
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            To initiate a return request:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-gray-600">
            <li>Go to <strong>My Orders</strong> in your account dashboard</li>
            <li>Select the order containing the item you wish to return</li>
            <li>Click on <strong>Raise Request</strong> for the specific product</li>
            <li>Select the reason for return and provide details</li>
            <li>Upload unboxing video (for damaged/wrong/missing items)</li>
            <li>Submit the request for verification</li>
          </ol>
          <div className="bg-gray-50 rounded-2xl p-4 mt-4">
            <p className="text-gray-600 text-sm">
              <strong>Note:</strong> All return requests go through a verification process. We reserve the right to reject requests that do not meet our policy conditions.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <CreditCard className="h-6 w-6 mr-3 text-emerald-500" />
            5. Refund Process
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Refunds are processed within <strong>5–10 business days</strong> after successful pickup and verification of the returned item.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <h4 className="font-bold text-blue-800 mb-2">Prepaid Orders</h4>
              <p className="text-blue-700 text-sm">Refunded to original payment method (UPI, Card, Net Banking)</p>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
              <h4 className="font-bold text-purple-800 mb-2">Cash on Delivery (COD)</h4>
              <p className="text-purple-700 text-sm">Refunded to your bank account. Bank account number and IFSC code required.</p>
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 mt-4">
            <p className="text-purple-800 text-sm font-medium flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
              <span>For COD refunds, you may be asked to provide your <strong>Bank Account Number and IFSC Code</strong> via a secure link for refund processing.</span>
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <Truck className="h-6 w-6 mr-3 text-emerald-500" />
            6. Return Shipping
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            For defective, damaged, or incorrect items, dr.cheapcart will provide a prepaid return shipping label. For change-of-mind returns, the customer may be responsible for return shipping costs.
          </p>
          <p className="text-gray-600 leading-relaxed">
            All returns go through a supplier verification process, which may take a few days before approval.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <AlertTriangle className="h-6 w-6 mr-3 text-amber-500" />
            7. Important Notes
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Slight differences in product color, design, or packaging may occur due to lighting effects and supplier variations. These are not considered valid reasons for return.</li>
            <li>All return requests are verified before approval.</li>
            <li>Issues are typically resolved within <strong>7–10 business days</strong>.</li>
          </ul>
        </section>

        <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 mt-12">
          <h4 className="font-black text-emerald-900 mb-2">Ready to start a return?</h4>
          <p className="text-emerald-700 text-sm mb-4">
            Visit our Order Tracking page or contact our support team to initiate your return request.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="/track-order" className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all">
              Track Order
            </a>
            <a href="/contact" className="bg-white text-emerald-600 border border-emerald-200 px-4 py-2 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-all">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
