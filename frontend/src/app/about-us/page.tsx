import React from 'react';
import { Building2, Users, Target, Shield, ArrowRight } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
            <Building2 className="w-4 h-4" />
            Our Story
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
            Revolutionizing Real Estate in India
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            HouseHunt was founded with a simple mission: to make buying, selling, and renting properties transparent, effortless, and accessible for everyone.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            { label: 'Properties Listed', value: '50K+' },
            { label: 'Happy Families', value: '10K+' },
            { label: 'Cities Covered', value: '15+' },
            { label: 'Expert Agents', value: '500+' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-200">
              <div className="text-3xl font-black text-blue-600 mb-2">{stat.value}</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission & Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Our Mission</h3>
            <p className="text-slate-600 leading-relaxed">
              To empower people with data-driven insights and verified listings, enabling them to make the best real estate decisions of their lives.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Trust & Safety</h3>
            <p className="text-slate-600 leading-relaxed">
              Every property on our platform undergoes rigorous verification. We believe in 100% transparency with zero hidden charges.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Community First</h3>
            <p className="text-slate-600 leading-relaxed">
              We're not just selling houses; we're building communities. Our focus is on sustainable growth and creating lasting relationships.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-slate-900 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-black mb-6">Join the HouseHunt Family</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto text-lg">
            Whether you are looking for your dream home or want to sell your property at the best price, we are here to help every step of the way.
          </p>
          <div className="flex justify-center gap-4">
            <a href="/search" className="px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-colors inline-flex items-center gap-2">
              Explore Properties <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
