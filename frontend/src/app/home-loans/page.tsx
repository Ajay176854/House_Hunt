'use client';

import React, { useState } from 'react';
import { Landmark, CheckCircle, Calculator, ChevronRight, Phone, ShieldCheck, BadgePercent, Clock, CreditCard } from 'lucide-react';

export default function HomeLoansPage() {
  const [loanAmount, setLoanAmount] = useState<number>(5000000);
  const [tenure, setTenure] = useState<number>(20);
  const interestRate = 8.5; // fixed for demo

  // EMI Calculation: E = P x R x (1+R)^N / [(1+R)^N-1]
  const calculateEMI = () => {
    const p = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenure * 12;
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  };

  const emi = calculateEMI();
  const totalAmount = emi * (tenure * 12);
  const totalInterest = totalAmount - loanAmount;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-slate-900 to-slate-900"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
                <Landmark className="w-4 h-4" />
                Zero Advisory Fee
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight">
                Get Your Dream Home with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Lowest Interest Rates</span>
              </h1>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Compare offers from 15+ top banks. We guarantee the lowest interest rates, zero processing fees, and doorstep document pickup.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2 text-lg cursor-pointer">
                  Apply Now <ChevronRight className="w-5 h-5" />
                </button>
                <button className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl backdrop-blur-sm border border-white/10 transition-all flex items-center justify-center gap-2 text-lg cursor-pointer">
                  <Phone className="w-5 h-5" /> Request Call Back
                </button>
              </div>
              <div className="mt-10 flex items-center gap-6 text-sm font-semibold text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  100% Secure
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  24h Approval
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block relative h-[400px]">
              <img 
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800&h=600" 
                alt="Home Loan" 
                className="absolute inset-0 w-full h-full object-cover rounded-3xl shadow-2xl rotate-3 scale-105 border-4 border-slate-800 opacity-90"
              />
            </div>
          </div>
        </div>
      </section>

      {/* EMI Calculator */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Calculate Your EMI</h2>
          <p className="text-slate-600">Plan your finances better by estimating your monthly EMIs</p>
        </div>

        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-200 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-4">
                <label className="font-bold text-slate-700">Loan Amount</label>
                <span className="font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-lg">₹{(loanAmount / 100000).toFixed(1)} Lakhs</span>
              </div>
              <input 
                type="range" 
                min="500000" 
                max="50000000" 
                step="100000"
                value={loanAmount} 
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between mt-2 text-xs text-slate-400 font-semibold">
                <span>₹5 L</span>
                <span>₹5 Cr</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-4">
                <label className="font-bold text-slate-700">Tenure (Years)</label>
                <span className="font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-lg">{tenure} Years</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="30" 
                step="1"
                value={tenure} 
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between mt-2 text-xs text-slate-400 font-semibold">
                <span>1 Yr</span>
                <span>30 Yrs</span>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3">
              <BadgePercent className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 font-medium">Interest rate starts at 8.5% p.a. Note that rates vary based on credit score, bank, and property type.</p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-8 text-white flex flex-col justify-center">
            <h3 className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-2 text-center">Your Monthly EMI</h3>
            <div className="text-5xl font-black text-center mb-8">
              ₹{emi.toLocaleString('en-IN')}
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-700">
                <span className="text-slate-300">Principal Amount</span>
                <span className="font-bold">₹{loanAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-700">
                <span className="text-slate-300">Total Interest</span>
                <span className="font-bold">₹{totalInterest.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-slate-300">Total Payable</span>
                <span className="font-bold text-emerald-400">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            <button className="w-full mt-8 px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
              Check Eligibility
            </button>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Why HouseHunt Home Loans?</h2>
            <p className="text-slate-600">We make the complex home loan process simple, fast, and completely free of cost for you.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <CreditCard className="w-8 h-8 text-rose-500" />, title: 'Zero Fees', desc: 'No advisory or hidden charges. Our service is completely free.' },
              { icon: <BadgePercent className="w-8 h-8 text-blue-500" />, title: 'Lowest Rates', desc: 'We negotiate on your behalf to get the lowest possible interest rates.' },
              { icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />, title: 'Doorstep Service', desc: 'End-to-end assistance from application to disbursement at your doorstep.' },
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-slate-200 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
