'use client';

import React from 'react';
import { FileText, Truck, ShieldCheck, CheckCircle, ArrowRight, Download, PenTool, Home } from 'lucide-react';

export default function RentalAgreementPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100 text-rose-600 text-xs font-bold uppercase tracking-wider mb-6 border border-rose-200">
                <FileText className="w-4 h-4" />
                100% Legally Valid
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
                Online Rental <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400">Agreements</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Draft, customize, and register your rental agreement online. Skip the lawyer fees and get the stamped document delivered directly to your doorstep.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2 text-lg cursor-pointer">
                  Create Draft Now <PenTool className="w-5 h-5" />
                </button>
                <button className="px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 text-lg shadow-sm cursor-pointer">
                  <Download className="w-5 h-5" /> View Sample
                </button>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex -space-x-4">
                  <img src="https://i.pravatar.cc/100?img=1" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt="User" />
                  <img src="https://i.pravatar.cc/100?img=2" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt="User" />
                  <img src="https://i.pravatar.cc/100?img=3" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt="User" />
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm">
                    +10k
                  </div>
                </div>
                <div className="text-sm">
                  <div className="font-bold text-slate-900">Trusted by Landlords</div>
                  <div className="text-slate-500">Over 10,000 agreements drafted</div>
                </div>
              </div>
            </div>

            <div className="relative lg:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-100 to-blue-50 rounded-[3rem] transform rotate-3"></div>
              <div className="absolute inset-0 bg-white rounded-[3rem] transform -rotate-2 shadow-xl border border-slate-100 p-8 flex flex-col">
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">HouseHunt Legal</div>
                      <div className="text-xs text-slate-500">Rental Agreement Template</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">
                    Draft
                  </div>
                </div>
                
                <div className="space-y-4 flex-1">
                  <div className="h-4 w-3/4 bg-slate-100 rounded"></div>
                  <div className="h-4 w-full bg-slate-100 rounded"></div>
                  <div className="h-4 w-5/6 bg-slate-100 rounded"></div>
                  <div className="h-4 w-full bg-slate-100 rounded mt-6"></div>
                  <div className="h-4 w-4/5 bg-slate-100 rounded"></div>
                  
                  <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                        <PenTool className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="h-3 w-32 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-600">Get your legally binding rental agreement in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-200"></div>
            
            {[
              { step: '1', title: 'Fill Details Online', desc: 'Enter tenant, landlord, and property details in our simple form.', icon: <PenTool className="w-6 h-6 text-blue-600" /> },
              { step: '2', title: 'We Draft & Stamp', desc: 'Our legal experts draft the agreement and print it on stamp paper.', icon: <FileText className="w-6 h-6 text-blue-600" /> },
              { step: '3', title: 'Doorstep Delivery', desc: 'Get the registered agreement delivered to your home within 2-3 days.', icon: <Truck className="w-6 h-6 text-blue-600" /> }
            ].map((item, i) => (
              <div key={i} className="relative bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center z-10 hover:-translate-y-1 transition-transform duration-300">
                <div className="w-16 h-16 rounded-full bg-blue-50 border-4 border-white shadow-md mx-auto flex items-center justify-center mb-6 relative">
                  {item.icon}
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-6">Transparent Pricing, <br/>No Hidden Charges</h2>
              <p className="text-lg text-slate-600 mb-8">
                Our base drafting fee is extremely affordable. Stamp duty and registration charges are at actuals depending on your state.
              </p>
              
              <div className="space-y-4">
                {[
                  'Drafting by expert legal professionals',
                  'E-Stamp paper included',
                  'Home delivery in 3 working days',
                  'Free revisions before printing',
                  'Legally valid in all courts of India'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                    <span className="text-slate-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
              
              <button className="mt-10 flex items-center gap-2 text-rose-600 font-bold hover:text-rose-700 transition-colors cursor-pointer group">
                View State-wise Stamp Duty Rates <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="bg-slate-900 rounded-3xl p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="relative z-10">
                <div className="uppercase tracking-wider text-sm font-bold text-rose-400 mb-2">Standard Package</div>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-black">₹399</span>
                  <span className="text-slate-400 font-medium">+ Stamp Duty</span>
                </div>
                
                <p className="text-slate-300 mb-8 pb-8 border-b border-slate-700">
                  Everything you need for a legally robust rental agreement.
                </p>
                
                <button className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-colors text-lg shadow-lg shadow-rose-500/20 cursor-pointer">
                  Start Drafting Now
                </button>
                <p className="text-center text-xs text-slate-400 mt-4">Takes only 5 minutes to fill details</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
