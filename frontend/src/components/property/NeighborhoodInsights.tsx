'use client';

import React from 'react';
import { ShieldCheck, Bus, GraduationCap, ShoppingBag, HeartPulse, Navigation, Sparkles } from 'lucide-react';

interface NeighborhoodInsightsProps {
  locality: string;
  city: string;
}

export const NeighborhoodInsights: React.FC<NeighborhoodInsightsProps> = ({ locality, city }) => {
  const scores = [
    { label: 'Public Transit & Metro', score: '9.4/10', icon: Bus, desc: 'Metro station & bus hub within 10 mins walk' },
    { label: 'Safety & Security', score: '9.8/10', icon: ShieldCheck, desc: 'Gated streets with 24x7 active police patrolling' },
    { label: 'Schools & Colleges', score: '9.1/10', icon: GraduationCap, desc: 'Top international schools within 3 km radius' },
    { label: 'Hospitals & Healthcare', score: '9.5/10', icon: HeartPulse, desc: 'Multi-speciality hospitals within 15 mins' },
    { label: 'Shopping & Dining', score: '9.6/10', icon: ShoppingBag, desc: 'Supermarkets, malls & cafes in walking distance' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">Locality & Commute Score</h3>
            <p className="text-xs text-slate-500">
              Verified lifestyle and infrastructure rating for {locality}, {city}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5" />
          Overall 9.5/10
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {scores.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white shadow-xs text-slate-700 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-800">{item.label}</h4>
                  <span className="text-xs font-extrabold text-slate-900">{item.score}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
