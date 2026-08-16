import React from 'react';
import { Scale, FileText, AlertTriangle, Copyright } from 'lucide-react';

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 lg:pt-32 lg:pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider mb-6 border border-slate-300">
            <Scale className="w-4 h-4" />
            Effective Date: August 16, 2026
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-6">
            Terms of Use
          </h1>
          <p className="text-lg text-slate-600">
            Please read these terms of service carefully before using HouseHunt.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 prose prose-slate max-w-none">
          <div className="space-y-10">
            <section>
              <div className="flex items-center gap-3 mb-4 text-slate-900">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold m-0">1. Acceptance of Terms</h2>
              </div>
              <div className="pl-13 text-slate-600 space-y-4">
                <p>
                  By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4 text-slate-900">
                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold m-0">2. Prohibited Uses</h2>
              </div>
              <div className="pl-13 text-slate-600 space-y-4">
                <p>
                  You may use Service only for lawful purposes and in accordance with Terms. You agree not to use Service:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>In any way that violates any applicable national or international law or regulation.</li>
                  <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way by exposing them to inappropriate content or otherwise.</li>
                  <li>To transmit, or procure the sending of, any advertising or promotional material, including any &quot;junk mail&quot;, &quot;chain letter,&quot; &quot;spam,&quot; or any other similar solicitation.</li>
                  <li>To impersonate or attempt to impersonate Company, a Company employee, another user, or any other person or entity.</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4 text-slate-900">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Copyright className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold m-0">3. Intellectual Property</h2>
              </div>
              <div className="pl-13 text-slate-600 space-y-4">
                <p>
                  The Service and its original content, features and functionality are and will remain the exclusive property of HouseHunt and its licensors. The Service is protected by copyright, trademark, and other laws of both the country and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of HouseHunt.
                </p>
              </div>
            </section>

          </div>
          
        </div>
      </div>
    </div>
  );
}
