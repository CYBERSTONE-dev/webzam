import React from 'react';
import { Scale, Gavel, FileCheck, AlertTriangle, Ban, ShieldAlert, Shield } from 'lucide-react';

export const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Scale className="h-8 w-8 text-orange-600" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-4">Terms & Conditions</h1>
        <p className="text-gray-500">Last Updated: March 21, 2026</p>
      </div>

      <div className="prose prose-orange max-w-none bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <Gavel className="h-6 w-6 mr-3 text-orange-500" />
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            By accessing and using dr.cheapcart, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <FileCheck className="h-6 w-6 mr-3 text-orange-500" />
            2. Use License
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Permission is granted to temporarily download one copy of the materials (information or software) on dr.cheapcart's website for personal, non-commercial transitory viewing only.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <Shield className="h-6 w-6 mr-3 text-orange-500" />
            3. Product Information
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We source products from multiple trusted suppliers across India. While we strive for accuracy, slight differences in product color, design, or packaging may occur due to lighting effects and supplier variations. Product images on our website are for illustration purposes only.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <AlertTriangle className="h-6 w-6 mr-3 text-orange-500" />
            4. Disclaimer
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            The materials on dr.cheapcart's website are provided on an 'as is' basis. dr.cheapcart makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <Scale className="h-6 w-6 mr-3 text-orange-500" />
            5. Limitations
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            In no event shall dr.cheapcart or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on dr.cheapcart's website.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <FileCheck className="h-6 w-6 mr-3 text-orange-500" />
            6. Return Policy
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Returns are accepted within 7 days of delivery for eligible products. For full details on our return policy, please refer to our <a href="/returns" className="text-blue-600 underline font-bold">Return & Refund Policy</a>.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Return requests are subject to verification and approval. Products must be unused, in original packaging with all tags intact.
          </p>
          <p className="text-gray-600 leading-relaxed">
            An unboxing video is mandatory for claims related to damaged, missing, or wrong items.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <Ban className="h-6 w-6 mr-3 text-red-500" />
            7. Policy Violations & Account Actions
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We reserve the right to take action against accounts that violate our policies. This includes but is not limited to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
            <li><strong>Repeated Returns:</strong> Excessive return requests may be flagged for review</li>
            <li><strong>Policy Misuse:</strong> Any misuse of return, refund, or promotional policies</li>
            <li><strong>Suspicious Activity:</strong> Fraudulent transactions or fraudulent claims</li>
            <li><strong>Invalid Claims:</strong> Claims without required proof (e.g., unboxing video)</li>
          </ul>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="text-red-800 font-bold mb-2 flex items-center">
              <ShieldAlert className="h-5 w-5 mr-2" />
              We reserve the right to:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-red-700 text-sm">
              <li>Refuse service to any user</li>
              <li>Cancel any order at any time</li>
              <li>Block or suspend user accounts</li>
              <li>Deny future purchases or returns</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <Gavel className="h-6 w-6 mr-3 text-orange-500" />
            8. Governing Law
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of India.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <FileCheck className="h-6 w-6 mr-3 text-orange-500" />
            9. Changes to Terms
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on the website. Your continued use of the website constitutes acceptance of the modified terms.
          </p>
        </section>

        <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100 mt-12">
          <h4 className="font-black text-orange-900 mb-2">Need clarification?</h4>
          <p className="text-orange-700 text-sm mb-4">
            If you have any questions regarding our terms and conditions, please reach out to our support team.
          </p>
          <a href="/contact" className="bg-orange-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-orange-700 transition-all inline-block">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};
