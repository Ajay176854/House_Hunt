'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Home,
  Heart,
  PlusCircle,
  User,
  LogOut,
  LogIn,
  ChevronDown,
  LayoutDashboard,
  ShieldCheck,
  MapPin,
  Menu,
  X,
  Headphones,
  TrendingUp,
  CheckCircle,
  Lightbulb,
  Phone,
  Mail,
} from 'lucide-react';
import { useMetadata } from '@/context/MetadataContext';
import { CITIES } from '@/components/property/FilterBar';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  selectedCity?: string;
  onCityChange?: (city: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  selectedCity = 'All Cities',
  onCityChange,
}) => {
  const { user, logout, savedPropertyIds } = useAuth();
  const { cities: dynamicCities } = useMetadata();
  const displayCities = dynamicCities?.length > 0 ? dynamicCities.slice(0, 8) : ['Bengaluru', 'Mumbai', 'Delhi-NCR', 'Hyderabad', 'Pune'];

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCityMenu, setShowCityMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSupportMenu, setShowSupportMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#141414] border-b border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Brand & Location */}
          <div className="flex items-center gap-6">
            <div
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 cursor-pointer group shrink-0"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-xl tracking-tight text-white leading-none">
                  House<span className="text-rose-500">Hunt</span>
                </span>
              </div>
            </div>

            <div className="relative hidden md:block">
              <button
                onClick={() => setShowCityMenu(!showCityMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-semibold rounded-lg hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/20"
              >
                <span>{selectedCity === 'All Cities' ? 'All India' : selectedCity}</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/70" />
              </button>

              {showCityMenu && (
                <div className="absolute left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in">
                  <button
                    onClick={() => {
                      if (onCityChange) onCityChange('All Cities');
                      setShowCityMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-xs font-medium hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer text-slate-700"
                  >
                    All India
                  </button>
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        if (onCityChange) onCityChange(city);
                        setShowCityMenu(false);
                      }}
                      className={`w-full text-left px-3.5 py-1.5 text-xs font-medium hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer ${
                        selectedCity === city ? 'text-rose-600 font-bold bg-rose-50/50' : 'text-slate-700'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Center: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-white/90">
            <div className="relative group">
              <button className="hover:text-white transition-colors cursor-pointer py-5">For Buyers</button>
              
              <div className="absolute top-full -left-20 w-[850px] bg-white shadow-2xl border border-slate-200 rounded-b-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all -mt-1 z-50 flex overflow-hidden">
                {/* Left Sidebar */}
                <div className="w-64 bg-slate-50 flex flex-col justify-between py-6">
                  <div className="flex flex-col">
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/search?listingType=buy'); }} className="px-6 py-2.5 text-[13px] text-blue-700 font-semibold uppercase hover:bg-slate-100">BUY A HOME</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/search?listingType=buy&propertyTypes=Plot'); }} className="px-6 py-2.5 text-[13px] text-slate-700 font-medium hover:bg-slate-100 hover:text-blue-700 uppercase">Land/Plot</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/search?propertyTypes=Commercial'); }} className="px-6 py-2.5 text-[13px] text-slate-700 font-medium hover:bg-slate-100 hover:text-blue-700 uppercase">COMMERCIAL</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/search'); }} className="px-6 py-2.5 text-[13px] text-slate-700 font-medium hover:bg-slate-100 flex items-center gap-2 uppercase">
                      INSIGHTS <span className="bg-[#0052cc] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">NEW</span>
                    </a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/articles'); }} className="px-6 py-2.5 text-[13px] text-slate-700 font-medium hover:bg-slate-100 hover:text-blue-700 uppercase">ARTICLES & NEWS</a>
                  </div>
                  
                  <div className="px-6 pt-12">
                    <p className="text-[11px] text-slate-500 font-medium mb-1">contact us toll free on</p>
                    <p className="text-sm font-bold text-slate-700">1800 41 99099 <span className="text-[10px] font-normal text-slate-500">(9AM-11PM IST)</span></p>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="flex gap-8">
                    {/* Middle Column: Cities */}
                    <div className="flex-1">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">TOP CITIES</h4>
                      <div className="space-y-3.5">
                        {displayCities.map(city => (
                          <a key={city} href="#" onClick={(e) => { e.preventDefault(); onNavigate(`/search?city=${encodeURIComponent(city)}&listingType=buy`); }} className="block text-[13px] font-bold text-slate-800 hover:text-blue-600 transition-colors">
                            Property in {city}
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Insights Feature Card */}
                    <div className="w-[280px] bg-[#f2f8fc] rounded-xl p-5 border border-blue-100 relative shadow-sm h-fit">
                      <TrendingUp className="w-5 h-5 text-blue-600 absolute top-4 right-4" />
                      
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-11 bg-blue-600 rounded flex flex-col items-center justify-center relative overflow-hidden shrink-0 shadow-sm">
                          <div className="w-full h-2.5 bg-yellow-400 absolute top-0"></div>
                          <Lightbulb className="w-5 h-5 text-white mt-1.5" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest leading-none mb-1">INTRODUCING</p>
                          <h3 className="text-2xl font-black text-slate-900 leading-none tracking-tight">Insights</h3>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {[
                          'Understand localities',
                          'Read Resident Reviews',
                          'Check Price Trends',
                          'Tools, Utilities & more'
                        ].map(feature => (
                          <div key={feature} className="flex items-start gap-2.5">
                            <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                            <span className="text-[13px] text-slate-700 font-medium leading-tight">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6">
                    <p className="text-[11px] text-slate-400 font-medium">
                      Email us at <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/search'); }} className="text-slate-600 font-medium hover:text-blue-600">services@househunt.in</a>. or call us at <span className="font-bold text-slate-600">1800 41 99099</span> (IND Toll-Free)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <button className="hover:text-white transition-colors cursor-pointer py-5">For Tenants</button>
              
              <div className="absolute top-full -left-48 w-[850px] bg-white shadow-2xl border border-slate-200 rounded-b-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all -mt-1 z-50 flex overflow-hidden">
                {/* Left Sidebar */}
                <div className="w-64 bg-slate-50 flex flex-col justify-between py-6">
                  <div className="flex flex-col">
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/search?listingType=rent'); }} className="px-6 py-2.5 text-[13px] text-blue-700 font-semibold uppercase hover:bg-slate-100">RENT A HOME</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/search?listingType=rent'); }} className="px-6 py-2.5 text-[13px] text-slate-700 font-medium hover:bg-slate-100 hover:text-blue-700 uppercase">PG/Co-living</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/search?listingType=rent&propertyTypes=Commercial'); }} className="px-6 py-2.5 text-[13px] text-slate-700 font-medium hover:bg-slate-100 hover:text-blue-700 uppercase">COMMERCIAL</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/search'); }} className="px-6 py-2.5 text-[13px] text-slate-700 font-medium hover:bg-slate-100 flex items-center gap-2 uppercase">
                      INSIGHTS <span className="bg-[#0052cc] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">NEW</span>
                    </a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/articles'); }} className="px-6 py-2.5 text-[13px] text-slate-700 font-medium hover:bg-slate-100 hover:text-blue-700 uppercase">ARTICLES & NEWS</a>
                  </div>
                  
                  <div className="px-6 pt-12">
                    <p className="text-[11px] text-slate-500 font-medium mb-1">contact us toll free on</p>
                    <p className="text-sm font-bold text-slate-700">1800 41 99099 <span className="text-[10px] font-normal text-slate-500">(9AM-11PM IST)</span></p>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="flex gap-8">
                    {/* Middle Column: Cities */}
                    <div className="flex-1">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">TOP CITIES</h4>
                      <div className="space-y-3.5">
                        {displayCities.map(city => (
                          <a key={city} href="#" onClick={(e) => { e.preventDefault(); onNavigate(`/search?city=${encodeURIComponent(city)}&listingType=rent`); }} className="block text-[13px] font-bold text-slate-800 hover:text-blue-600 transition-colors">
                            Property for rent in {city}
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Insights Feature Card */}
                    <div className="w-[280px] bg-[#f2f8fc] rounded-xl p-5 border border-blue-100 relative shadow-sm h-fit">
                      <TrendingUp className="w-5 h-5 text-blue-600 absolute top-4 right-4" />
                      
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-11 bg-blue-600 rounded flex flex-col items-center justify-center relative overflow-hidden shrink-0 shadow-sm">
                          <div className="w-full h-2.5 bg-yellow-400 absolute top-0"></div>
                          <Lightbulb className="w-5 h-5 text-white mt-1.5" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest leading-none mb-1">INTRODUCING</p>
                          <h3 className="text-2xl font-black text-slate-900 leading-none tracking-tight">Insights</h3>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {[
                          'Understand localities',
                          'Read Resident Reviews',
                          'Check Price Trends',
                          'Tools, Utilities & more'
                        ].map(feature => (
                          <div key={feature} className="flex items-start gap-2.5">
                            <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                            <span className="text-[13px] text-slate-700 font-medium leading-tight">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6">
                    <p className="text-[11px] text-slate-400 font-medium">
                      Email us at <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/search'); }} className="text-slate-600 font-medium hover:text-blue-600">services@househunt.in</a>. or call us at <span className="font-bold text-slate-600">1800 41 99099</span> (IND Toll-Free)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <button className="hover:text-white transition-colors cursor-pointer py-5">For Owners</button>
              
              <div className="absolute top-full -left-64 w-[850px] bg-white shadow-2xl border border-slate-200 rounded-b-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all -mt-1 z-50 flex overflow-hidden">
                {/* Left Sidebar */}
                <div className="w-64 bg-slate-50 flex flex-col justify-between py-6">
                  <div className="flex flex-col">
                    <h4 className="px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-2">OWNER OFFERINGS</h4>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/listings/new'); }} className="px-6 py-2.5 text-[13px] text-slate-700 font-semibold hover:bg-slate-100 hover:text-blue-700 flex items-center">
                      Post Property <span className="bg-[#00a687] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm ml-2">FREE</span>
                    </a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/search'); }} className="px-6 py-2.5 text-[13px] text-slate-700 font-medium hover:bg-slate-100 hover:text-blue-700">Owner Services</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/dashboard'); }} className="px-6 py-2.5 text-[13px] text-slate-700 font-medium hover:bg-slate-100 hover:text-blue-700">My Listings</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/dashboard'); }} className="px-6 py-2.5 text-[13px] text-slate-700 font-medium hover:bg-slate-100 hover:text-blue-700">View Responses</a>
                    <div className="my-2 border-t border-slate-200"></div>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/search'); }} className="px-6 py-2.5 text-[13px] text-slate-700 font-medium hover:bg-slate-100 flex items-center gap-2 uppercase">
                      INSIGHTS <span className="bg-[#0052cc] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">NEW</span>
                    </a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/articles'); }} className="px-6 py-2.5 text-[13px] text-slate-700 font-medium hover:bg-slate-100 hover:text-blue-700 uppercase">ARTICLES & NEWS</a>
                  </div>
                  
                  <div className="px-6 pt-12">
                    <p className="text-[11px] text-slate-500 font-medium mb-1">contact us toll free on</p>
                    <p className="text-sm font-bold text-slate-700">1800 41 99099 <span className="text-[10px] font-normal text-slate-500">(9AM-11PM IST)</span></p>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-6 flex items-center justify-center bg-slate-50/50">
                  <div className="bg-[#fff1f2] rounded-2xl p-8 border border-rose-100 text-center max-w-sm w-full shadow-sm">
                     <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Sell or rent faster at the right price!</h3>
                     <p className="text-sm text-slate-700 mb-6 font-medium">List your property now for FREE and reach millions of potential buyers & tenants.</p>
                     <button onClick={() => onNavigate('/listings/new')} className="px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm w-full">
                       Post Property
                     </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <button className="hover:text-white transition-colors cursor-pointer py-5">For Dealers / Builders</button>
              
              <div className="absolute top-full -left-[400px] w-[700px] bg-white shadow-2xl border border-slate-200 rounded-b-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all -mt-1 z-50 flex overflow-hidden">
                {/* Left Sidebar */}
                <div className="w-64 bg-slate-50 flex flex-col py-6">
                  <div className="flex flex-col">
                    <h4 className="px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-2">DEALER OFFERINGS</h4>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/listings/new'); }} className="px-6 py-2.5 text-[13px] text-slate-700 font-medium hover:bg-slate-100 hover:text-blue-700">Post Property</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/dealer-services'); }} className="px-6 py-2.5 text-[13px] text-slate-700 font-medium hover:bg-slate-100 hover:text-blue-700">Dealer Services</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/dashboard'); }} className="px-6 py-2.5 text-[13px] text-slate-700 font-medium hover:bg-slate-100 hover:text-blue-700">My Listings</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/dashboard'); }} className="px-6 py-2.5 text-[13px] text-slate-700 font-medium hover:bg-slate-100 hover:text-blue-700">View Responses</a>
                    <div className="my-2 border-t border-slate-200"></div>
                    <h4 className="px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-2">RESEARCH AND ADVICE</h4>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/builders'); }} className="px-6 py-2.5 text-[13px] text-slate-700 font-medium hover:bg-slate-100 hover:text-blue-700">Are you a builder? click here</a>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-6 flex flex-col justify-between bg-white border-l border-slate-100">
                  <div className="text-center pt-8">
                     <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Become a Verified Dealer</h3>
                     <p className="text-sm text-slate-600 mb-6 font-medium max-w-[280px] mx-auto">Get exclusive leads, better visibility, and premium dealer services.</p>
                     <button onClick={() => onNavigate('/register-dealer')} className="px-6 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 transition-colors shadow-sm cursor-pointer">
                       Register as Dealer
                     </button>
                  </div>
                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <p className="text-[11px] text-slate-400 font-medium">
                      Dealer Support: <a href="mailto:dealers@househunt.in" className="text-slate-600 font-medium hover:text-blue-600">dealers@househunt.in</a> | <span className="font-bold text-slate-600">1800 41 99099</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative group flex items-center">
              <button className="hover:text-white transition-colors cursor-pointer py-5">Insights</button>
              <span className="ml-1.5 bg-[#e45a6c] text-white text-[9px] font-bold px-1 py-0.5 rounded shadow-sm leading-none uppercase">New</span>
              
              <div className="absolute top-full right-0 w-[850px] bg-white shadow-2xl border border-slate-200 rounded-b-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all -mt-1 z-50 flex overflow-hidden">
                {/* Left Sidebar */}
                <div className="w-64 bg-slate-50 flex flex-col py-6">
                  <div className="flex flex-col">
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/insights/city-overview'); }} className="px-6 py-2.5 text-[13px] text-blue-700 font-semibold uppercase hover:bg-slate-100">CITY OVERVIEW</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/insights/price-trends'); }} className="px-6 py-2.5 text-[13px] text-slate-700 font-medium hover:bg-slate-100 hover:text-blue-700 uppercase">PRICE TRENDS</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/insights/locality-ratings'); }} className="px-6 py-2.5 text-[13px] text-slate-700 font-medium hover:bg-slate-100 hover:text-blue-700 uppercase">LOCALITY RATINGS</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/insights/buying-guide'); }} className="px-6 py-2.5 text-[13px] text-slate-700 font-medium hover:bg-slate-100 hover:text-blue-700 uppercase">BUYING GUIDE</a>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="flex gap-8">
                    {/* Middle Column: Cities */}
                    <div className="flex-1">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">CHECK OVERVIEW OF TOP CITIES</h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">
                        {displayCities.map(city => (
                          <a key={city} href="#" onClick={(e) => { e.preventDefault(); onNavigate(`/insights/city-overview?city=${encodeURIComponent(city)}`); }} className="block text-[13px] font-bold text-slate-800 hover:text-blue-600 transition-colors">
                            {city}
                          </a>
                        ))}
                      </div>
                      <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('/insights/city-overview'); }} className="inline-block mt-6 text-[12px] font-bold text-blue-600 hover:text-blue-700 underline">View All Insights</a>
                    </div>

                    {/* Right Column: Insights Feature Card */}
                    <div className="w-[280px] bg-[#f2f8fc] rounded-xl p-5 border border-blue-100 relative shadow-sm h-fit">
                      <TrendingUp className="w-5 h-5 text-blue-600 absolute top-4 right-4" />
                      
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-11 bg-blue-600 rounded flex flex-col items-center justify-center relative overflow-hidden shrink-0 shadow-sm">
                          <div className="w-full h-2.5 bg-yellow-400 absolute top-0"></div>
                          <Lightbulb className="w-5 h-5 text-white mt-1.5" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 leading-none tracking-tight">Insights</h3>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {[
                          'Understand localities',
                          'Read Resident Reviews',
                          'Check Price Trends',
                          'Tools, Utilities & more'
                        ].map(feature => (
                          <div key={feature} className="flex items-start gap-2.5">
                            <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                            <span className="text-[13px] text-slate-700 font-medium leading-tight">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              onClick={() => onNavigate('/listings/new')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-blue-900 text-[13px] font-bold rounded-lg transition-all cursor-pointer shadow-sm"
            >
              Post property <span className="bg-[#00a687] text-white px-1.5 py-0.5 rounded text-[10px] ml-0.5 tracking-wide">FREE</span>
            </button>

            <div className="relative flex items-center">
              <button 
                title="Support"
                onClick={() => setShowSupportMenu(!showSupportMenu)}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full cursor-pointer hidden sm:block transition-colors"
              >
                <Headphones className="w-5 h-5" />
              </button>
              
              {showSupportMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSupportMenu(false)}
                  ></div>
                  <div className="absolute right-0 top-full mt-2 w-64 bg-[#141414] border border-white/10 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50 p-4 animate-in fade-in slide-in-from-top-2">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Customer Support</h3>
                    <div className="space-y-3">
                      <a href="tel:+918045678900" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
                        <Phone className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-medium">+91 80 4567 8900</span>
                      </a>
                      <a href="mailto:support@househunt.in" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
                        <Mail className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-medium">support@househunt.in</span>
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="relative flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-1.5 cursor-pointer group text-white mr-2 hover:bg-white/5 px-2 py-1.5 rounded-lg transition-colors"
              >
                {user ? (
                  <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-sm shadow-sm group-hover:from-emerald-400 group-hover:to-emerald-500 transition-all">
                    {user.name.charAt(0).toUpperCase()}
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-[2px] border-[#141414] rounded-full box-content"></span>
                  </div>
                ) : (
                  <>
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-full border border-white/30 bg-white/5 group-hover:bg-white/15 transition-colors">
                      <User className="w-4 h-4 text-white/70" />
                    </div>
                    <div className="hidden sm:block text-left ml-0.5">
                      <p className="text-[13px] font-bold text-white leading-tight">Login / Register</p>
                    </div>
                  </>
                )}
              </button>

              {/* Small Profile Menu */}
              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                  <div className="absolute top-full right-12 mt-2 w-48 bg-white shadow-2xl border border-slate-200 py-2 rounded-xl z-50">
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="font-bold text-sm text-slate-800">{user.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        </div>
                        <button onClick={() => { onNavigate('/dashboard'); setShowProfileMenu(false); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 cursor-pointer">Dashboard</button>
                        <button onClick={() => { onNavigate('/saved'); setShowProfileMenu(false); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 cursor-pointer">Saved Properties</button>
                        <button onClick={() => { logout(); setShowProfileMenu(false); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border-t border-slate-100 mt-1 pt-2 cursor-pointer">Logout</button>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-2 border-b border-slate-100 mb-1">
                          <p className="text-xs text-slate-500">Welcome to HouseHunt</p>
                        </div>
                        <button onClick={() => { onNavigate('/login'); setShowProfileMenu(false); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 cursor-pointer">Login</button>
                        <button onClick={() => { onNavigate('/register'); setShowProfileMenu(false); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 cursor-pointer">Register</button>
                      </>
                    )}
                  </div>
                </>
              )}

              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="text-white/80 hover:text-white transition-colors cursor-pointer p-1"
              >
                {showUserMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Right Side Drawer Menu (Video Style) */}
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 bg-slate-900/20 z-40 lg:hidden" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 mt-2 top-full w-72 bg-white shadow-2xl border border-slate-200 py-0 z-50 max-h-[80vh] overflow-y-auto no-scrollbar fixed bottom-0 sm:absolute sm:bottom-auto">
                    
                    {/* Header */}
                    <div className="bg-slate-900 text-white p-4 pt-10 relative">
                      <button 
                        onClick={() => setShowUserMenu(false)}
                        className="absolute top-2 right-3 text-white/70 hover:text-white cursor-pointer p-1.5 rounded-md hover:bg-white/10 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      {user ? (
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold text-sm">{user.name}</p>
                            <p className="text-[11px] text-slate-300">{user.email}</p>
                          </div>
                          <button onClick={() => { logout(); setShowUserMenu(false); }} className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer">
                            <LogOut className="w-3 h-3" /> Logout
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm">LOGIN / REGISTER</span>
                          <button onClick={() => { onNavigate('/login'); setShowUserMenu(false); }} className="px-3 py-1 bg-white text-slate-900 text-[11px] font-bold rounded cursor-pointer">
                            Login
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-4">
                      {/* My Activity */}
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">My Activity</p>
                        <div className="space-y-2.5">
                          <button onClick={() => { onNavigate('/search'); setShowUserMenu(false); }} className="w-full text-left text-xs font-semibold text-slate-700 hover:text-rose-600 cursor-pointer">Recently Searched</button>
                          <button onClick={() => { onNavigate('/search'); setShowUserMenu(false); }} className="w-full text-left text-xs font-semibold text-slate-700 hover:text-rose-600 cursor-pointer">Recently Viewed</button>
                          <button onClick={() => { onNavigate('/saved'); setShowUserMenu(false); }} className="w-full text-left text-xs font-semibold text-slate-700 hover:text-rose-600 flex justify-between cursor-pointer">
                            Shortlisted {savedPropertyIds.length > 0 && <span className="bg-rose-100 text-rose-600 px-1.5 rounded">{savedPropertyIds.length}</span>}
                          </button>
                          <button onClick={() => { onNavigate('/search'); setShowUserMenu(false); }} className="w-full text-left text-xs font-semibold text-slate-700 hover:text-rose-600 cursor-pointer">Contacted</button>
                          <button onClick={() => { onNavigate('/listings/new'); setShowUserMenu(false); }} className="w-full text-left text-xs font-semibold text-slate-700 hover:text-rose-600 flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 cursor-pointer">
                            Post Property <span className="bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded text-[9px] uppercase font-bold">Free</span>
                          </button>
                        </div>
                      </div>

                      {/* Explore our Services */}
                      <div className="pt-4 border-t border-slate-100">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Explore our Services</p>
                        <div className="space-y-3">
                          <button onClick={() => { onNavigate('/search?listingType=buy'); setShowUserMenu(false); }} className="w-full flex justify-between items-center cursor-pointer group">
                            <span className="text-xs font-semibold text-slate-700 group-hover:text-rose-600">For Buyers</span>
                            <ChevronDown className="w-3 h-3 text-slate-400" />
                          </button>
                          <button onClick={() => { onNavigate('/search?listingType=rent'); setShowUserMenu(false); }} className="w-full flex justify-between items-center cursor-pointer group">
                            <span className="text-xs font-semibold text-slate-700 group-hover:text-rose-600">For Tenants</span>
                            <ChevronDown className="w-3 h-3 text-slate-400" />
                          </button>
                          <button onClick={() => { onNavigate('/listings/new'); setShowUserMenu(false); }} className="w-full flex justify-between items-center cursor-pointer group">
                            <span className="text-xs font-semibold text-slate-700 group-hover:text-rose-600">For Owners</span>
                            <ChevronDown className="w-3 h-3 text-slate-400" />
                          </button>
                          <button onClick={() => { onNavigate('/dealer-services'); setShowUserMenu(false); }} className="w-full flex justify-between items-center cursor-pointer group">
                            <span className="text-xs font-semibold text-slate-700 group-hover:text-rose-600">For Dealers / Builders</span>
                            <ChevronDown className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>
                      </div>

                      {/* Other Links */}
                      <div className="pt-4 border-t border-slate-100 space-y-3 pb-2">
                        <button onClick={() => { onNavigate('/home-loans'); setShowUserMenu(false); }} className="w-full text-left text-xs font-semibold text-slate-700 hover:text-rose-600 cursor-pointer">Home Loans</button>
                        <button onClick={() => { onNavigate('/insights/city-overview'); setShowUserMenu(false); }} className="w-full text-left text-xs font-semibold text-slate-700 hover:text-rose-600 flex justify-between items-center cursor-pointer">
                          Insights <span className="bg-rose-50 text-rose-600 px-1 py-0.5 rounded text-[9px] uppercase font-bold">New</span>
                        </button>
                        <button onClick={() => { onNavigate('/articles'); setShowUserMenu(false); }} className="w-full text-left text-xs font-semibold text-slate-700 hover:text-rose-600 cursor-pointer">Articles & News</button>
                        <button onClick={() => { onNavigate('/about-us'); setShowUserMenu(false); }} className="w-full text-left text-xs font-semibold text-slate-700 hover:text-rose-600 cursor-pointer">About Us</button>
                        <button onClick={() => { onNavigate('/contact-us'); setShowUserMenu(false); }} className="w-full text-left text-xs font-semibold text-slate-700 hover:text-rose-600 cursor-pointer">Get Help</button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
