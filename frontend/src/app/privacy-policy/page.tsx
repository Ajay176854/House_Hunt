import React from 'react';
import { ShieldCheck, Lock, Eye, Server, RefreshCw } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 lg:pt-32 lg:pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6 border border-emerald-200">
            <ShieldCheck className="w-4 h-4" />
            Last Updated: August 16, 2026
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-600">
            Your privacy is critically important to us. At HouseHunt, we have a few fundamental principles.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 prose prose-slate max-w-none">
          <p className="text-lg text-slate-700 leading-relaxed font-medium mb-10">
            We are thoughtful about the personal information we ask you to provide and the personal information that we collect about you through the operation of our services. We store personal information for only as long as we have a reason to keep it.
          </p>

          <div className="space-y-10">
            <section>
              <div className="flex items-center gap-3 mb-4 text-slate-900">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold m-0">1. Information We Collect</h2>
              </div>
              <div className="pl-13 text-slate-600 space-y-4">
                <p>
                  We only collect information about you if we have a reason to do so—for example, to provide our Services, to communicate with you, or to make our Services better.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Basic Account Information:</strong> We ask for basic information from you in order to set up your account. For example, we require individuals who sign up for a HouseHunt account to provide an email address and password, along with a username or name.</li>
                  <li><strong>Public Profile Information:</strong> If you have an account with us, we collect the information that you provide for your public profile. For example, if you are a property owner, your verified phone number.</li>
                  <li><strong>Property Listing Data:</strong> Data regarding the properties you choose to list, including locations, amenities, and media.</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4 text-slate-900">
                <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold m-0">2. How We Use Information</h2>
              </div>
              <div className="pl-13 text-slate-600 space-y-4">
                <p>
                  We use information about you as mentioned above and for the purposes listed below:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>To provide our Services—for example, to set up and maintain your account, host your property listings, or process payments.</li>
                  <li>To further develop and improve our Services—for example by adding new features that we think our users will enjoy or will help them to create and manage properties more efficiently.</li>
                  <li>To monitor and analyze trends and better understand how users interact with our Services, which helps us improve our Services and make them easier to use.</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4 text-slate-900">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Server className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold m-0">3. Sharing Information</h2>
              </div>
              <div className="pl-13 text-slate-600 space-y-4">
                <p>
                  We do not sell our users&apos; private personal information. We share information about you in the limited circumstances spelled out below and with appropriate safeguards on your privacy:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Subsidiaries, Employees, and Independent Contractors:</strong> We may disclose information about you to our subsidiaries, our employees, and individuals who are our independent contractors that need to know the information in order to help us provide our Services.</li>
                  <li><strong>Third-Party Vendors:</strong> We may share information about you with third-party vendors who need to know information about you in order to provide their services to us, or to provide their services to you or your site.</li>
                  <li><strong>Legal Requests:</strong> We may disclose information about you in response to a subpoena, court order, or other governmental request.</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4 text-slate-900">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold m-0">4. Changes to Policy</h2>
              </div>
              <div className="pl-13 text-slate-600 space-y-4">
                <p>
                  Although most changes are likely to be minor, HouseHunt may change its Privacy Policy from time to time. HouseHunt encourages visitors to frequently check this page for any changes to its Privacy Policy.
                </p>
              </div>
            </section>
          </div>
          
        </div>
      </div>
    </div>
  );
}
