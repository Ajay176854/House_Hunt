'use client';

import React from 'react';
import { Building2, ShieldCheck, Sparkles, Phone, Mail, Heart } from 'lucide-react';
import { useMetadata } from '@/context/MetadataContext';

interface FooterProps {
  onNavigate: (path: string) => void;
  onSelectCity: (city: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectCity }) => {
  const { cities: dynamicCities } = useMetadata();
  const displayCities = dynamicCities?.length > 0 ? dynamicCities.slice(0, 8) : ['Bengaluru', 'Mumbai', 'Delhi-NCR', 'Hyderabad', 'Pune'];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 text-white flex items-center justify-center shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-black text-xl tracking-tight text-white">
                House<span className="text-rose-500">Hunt</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              India's premier verified real estate portal enabling buyers and tenants to connect directly with property owners without paying costly middleman commissions.
            </p>
            <div className="flex items-center gap-4 text-xs text-emerald-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> 100% Verified Owners
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Zero Brokerage Fee
              </span>
            </div>
          </div>

          {/* Popular Cities */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Explore Top Metros
            </h4>
            <ul className="space-y-2 text-xs">
              {displayCities.map((city) => (
                <li key={city}>
                  <button
                    onClick={() => {
                      onSelectCity(city);
                      onNavigate('/');
                    }}
                    className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    Properties in {city}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Quick Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-white transition-colors cursor-pointer">
                  Flats for Rent
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-white transition-colors cursor-pointer">
                  Apartments for Sale
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/listings/new')} className="hover:text-white transition-colors cursor-pointer">
                  Post Free Property Ad
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/dashboard')} className="hover:text-white transition-colors cursor-pointer">
                  Owner Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/saved')} className="hover:text-white transition-colors cursor-pointer">
                  Shortlisted Homes
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Support */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Zero Brokerage Guarantee
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Every property listing undergoes phone and title verification before publishing.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-rose-500" />
                <span>+91 80 4567 8900</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-rose-500" />
                <span>support@househunt.in</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} HouseHunt Real Estate Portal. Built for high performance.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Use</span>
            <span className="hover:text-slate-400 cursor-pointer">Rental Agreement</span>
            <span className="hover:text-slate-400 cursor-pointer">Home Loan Advisory</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
