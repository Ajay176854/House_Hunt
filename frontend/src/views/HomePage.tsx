'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Property, FilterParams, PaginatedResponse } from '@/types';
import { getProperties } from '@/services/api';
import { PropertyCard } from '@/components/property/PropertyCard';
import { PropertyGridSkeleton } from '@/components/common/LoadingSkeletons';
import { InquiryModal } from '@/components/property/InquiryModal';
import { SEOHead } from '@/components/common/SEOHead';
import { useMetadata } from '@/context/MetadataContext';
import {
  Sparkles,
  ShieldCheck,
  Building2,
  TrendingUp,
  MapPin,
  CheckCircle,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

interface HomePageProps {
  initialCity?: string;
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ initialCity, onNavigate }) => {
  const { heroProperty, cityCounts, stats } = useMetadata();
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  const [filters, setFilters] = useState<FilterParams>({
    city: initialCity && initialCity !== 'All Cities' ? initialCity : undefined,
    listingType: 'all',
  });

  const [latestProperties, setLatestProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Inquiry modal state
  const [selectedPropertyForInquiry, setSelectedPropertyForInquiry] = useState<Property | null>(null);

  useEffect(() => {
    setFilters((prev: FilterParams) => ({
      ...prev,
      city: initialCity && initialCity !== 'All Cities' ? initialCity : undefined
    }));
  }, [initialCity]);

  useEffect(() => {
    const fetchLatest = async () => {
      setIsLoading(true);
      try {
        const query: any = { limit: 6, sort: 'newest' };
        if (filters.city) {
          query.city = filters.city;
        }
        const res = await getProperties(query);
        setLatestProperties(res.data);
      } catch (err) {
        console.error("Failed to load latest properties");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatest();
  }, [filters.city]);

  const handleFilterChange = (newFilters: Partial<FilterParams>) => {
    setFilters((prev: FilterParams) => ({ ...prev, ...newFilters }));
  };

  const executeSearch = (overrideFilters?: Partial<FilterParams>) => {
    const finalFilters = { ...filters, ...overrideFilters };
    const query = new URLSearchParams();
    if (finalFilters.city) query.set('city', finalFilters.city);
    if (finalFilters.listingType && finalFilters.listingType !== 'all') query.set('listingType', finalFilters.listingType);
    if (finalFilters.search) query.set('search', finalFilters.search);
    if (finalFilters.propertyTypes && finalFilters.propertyTypes.length > 0) {
      finalFilters.propertyTypes.forEach((pt: string) => query.append('propertyTypes', pt));
    }
    onNavigate(`/search?${query.toString()}`);
  };

  const handleResetFilters = () => {
    setFilters({
      city: undefined,
      listingType: 'all',
      page: 1,
      limit: 9,
      sort: 'newest',
    });
  };

  const activeHeroProperty = (filters.city && filters.city !== 'All Cities' && latestProperties.length > 0 && latestProperties[0].images?.length > 0) 
    ? latestProperties[0] 
    : heroProperty;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <SEOHead
        title="Find Zero Brokerage Houses, Flats & Apartments for Rent & Sale"
        description="Search 10,000+ verified owner properties with 0 brokerage in Bangalore, Mumbai, Delhi-NCR, Hyderabad, and Pune."
      />

      {/* Hero Header Section */}
      <section className="relative w-full h-[400px] md:h-[460px] flex flex-col items-center justify-center pt-10 pb-14 overflow-visible mt-0 mb-20 md:mb-16">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 bg-slate-900">
          <img 
            src={activeHeroProperty?.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=2000"} 
            alt="Real Estate Banner"
            className="w-full h-full object-cover opacity-60"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=2000&auto=format&fit=crop&q=80';
            }}
          />
        </div>

        {/* Floating text content at the top of hero */}
        <div className="absolute top-8 md:top-16 left-0 right-0 z-10 text-center px-4">

          <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-md tracking-tight leading-tight cursor-pointer hover:underline" onClick={() => activeHeroProperty && onNavigate(`/listings/${activeHeroProperty.id}`)}>
            {activeHeroProperty ? (
              <>
                {activeHeroProperty.bedrooms}BHK | ₹ {(activeHeroProperty.price / 10000000).toFixed(2)} CR.* <span className="font-medium text-2xl md:text-4xl">Onwards</span>
              </>
            ) : (
              <>
                3BHK | ₹ 2.55 CR.* <span className="font-medium text-2xl md:text-4xl">Onwards</span>
              </>
            )}
          </h1>
          <p className="text-white text-base md:text-xl font-bold mt-2 drop-shadow-md">
            {activeHeroProperty ? (
              <>{activeHeroProperty.title.substring(0, 30).toUpperCase()}... <span className="font-normal opacity-90">{activeHeroProperty.locality.toUpperCase()}, {activeHeroProperty.city.toUpperCase()}</span></>
            ) : (
              <>KFG DEVELOPERS <span className="font-normal opacity-90">SECTOR 70A, GURGAON</span></>
            )}
          </p>
        </div>

        {/* Search Container Box - overlapping the bottom */}
        <div className="absolute -bottom-16 md:-bottom-12 left-4 right-4 md:left-auto md:right-auto md:w-[90%] max-w-4xl bg-white rounded-xl shadow-xl z-20 overflow-hidden flex flex-col border border-slate-200">
          {/* Tabs */}
          <div className="flex overflow-x-auto hide-scrollbar border-b border-slate-200">
            {['Buy', 'Rent', 'New Launch', 'Commercial', 'Plots/Land', 'Projects'].map((tab, idx) => {
              const isActive = 
                (tab === 'Buy' && filters.listingType !== 'rent' && !filters.propertyTypes?.includes('Commercial') && !filters.propertyTypes?.includes('Plot') && filters.readyToMove !== false && (!filters.propertyTypes || !filters.propertyTypes.includes('Apartment') || filters.listingType !== 'buy')) || 
                (tab === 'Rent' && filters.listingType === 'rent' && !filters.propertyTypes?.includes('Commercial') && !filters.propertyTypes?.includes('Plot')) ||
                (tab === 'Commercial' && filters.propertyTypes?.includes('Commercial')) ||
                (tab === 'Plots/Land' && filters.propertyTypes?.includes('Plot')) ||
                (tab === 'New Launch' && filters.readyToMove === false) ||
                (tab === 'Projects' && filters.listingType === 'buy' && filters.propertyTypes?.includes('Apartment') && filters.readyToMove !== false);

              return (
              <button 
                key={tab}
                onClick={() => {
                  if (tab === 'Buy') handleFilterChange({ listingType: 'buy', propertyTypes: undefined, readyToMove: undefined });
                  else if (tab === 'Rent') handleFilterChange({ listingType: 'rent', propertyTypes: undefined, readyToMove: undefined });
                  else if (tab === 'Commercial') handleFilterChange({ propertyTypes: ['Commercial'] });
                  else if (tab === 'Plots/Land') handleFilterChange({ propertyTypes: ['Plot'] });
                  else if (tab === 'New Launch') handleFilterChange({ readyToMove: false, listingType: 'buy' });
                  else if (tab === 'Projects') handleFilterChange({ listingType: 'buy', propertyTypes: ['Apartment'] });
                }}
                className={`whitespace-nowrap px-4 py-3 text-[13px] font-bold border-b-2 transition-colors cursor-pointer ${
                  isActive
                  ? 'border-rose-600 text-rose-600 bg-rose-50/30' 
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            )})}
            <div className="ml-auto hidden sm:flex items-center pr-2">
              <button 
                onClick={() => onNavigate('/listings/new')}
                className="whitespace-nowrap px-3 py-1.5 text-[11px] font-bold text-white bg-slate-900 rounded-md cursor-pointer hover:bg-slate-800 transition-colors"
              >
                Post Property <span className="text-yellow-400">FREE</span>
              </button>
            </div>
          </div>
          
          {/* Search Inputs */}
          <div className="p-2 sm:p-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white">
            <div className="flex-shrink-0 relative border-b sm:border-b-0 sm:border-r border-slate-200">
              <select 
                value={filters.propertyTypes?.[0] || 'All Residential'}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'All Residential') handleFilterChange({ propertyTypes: [] });
                  else handleFilterChange({ propertyTypes: [val as any] });
                }}
                className="w-full sm:w-auto appearance-none bg-transparent py-2.5 pl-3 pr-8 text-[13px] font-semibold text-slate-700 outline-none cursor-pointer"
              >
                <option value="All Residential">All Residential</option>
                <option value="Apartment">Apartments</option>
                <option value="Independent House">Independent House</option>
                <option value="Villa">Villas</option>
              </select>
              <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
            
            <div className="flex-1 relative flex items-center bg-slate-100 rounded-lg px-3 py-1.5 border border-slate-200 focus-within:border-rose-400 focus-within:ring-1 focus-within:ring-rose-400 transition-all">
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input 
                type="text" 
                value={filters.search || ''}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                placeholder="Search 3 BHK for sale in Mumbai" 
                className="w-full bg-transparent text-[13px] font-medium text-slate-800 placeholder-slate-400 outline-none py-1.5"
                suppressHydrationWarning
              />

            </div>
            
            <button 
              onClick={() => executeSearch()}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[13px] rounded-lg shadow-sm transition-colors shrink-0 cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Explore Options Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 overflow-hidden">
        <div className="text-center mb-6 flex items-center justify-center gap-4 before:h-px before:flex-1 before:bg-slate-200 after:h-px after:flex-1 after:bg-slate-200">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">GET STARTED WITH EXPLORING REAL ESTATE OPTIONS</span>
        </div>
        
        <div className="relative group">
          <div ref={carouselRef} className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
            {[
              { title: 'Buying a home', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=300&h=200', action: () => executeSearch({ listingType: 'buy' }) },
              { title: 'Renting a home', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=300&h=200', action: () => executeSearch({ listingType: 'rent' }) },
              { title: 'Invest in Real Estate', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=300&h=200', tag: 'NEW', action: () => executeSearch() },
              { title: 'Sell/Rent your property', img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=300&h=200', action: () => onNavigate('/listings/new') },
              { title: 'Plots/Land', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=300&h=200', tag: 'NEW', action: () => executeSearch({ propertyTypes: ['Plot'] }) },
              { title: 'PG / Co-living', img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=300&h=200', action: () => executeSearch({ listingType: 'rent' }) },
            ].map((option, i) => (
              <div key={i} onClick={option.action} className="flex-shrink-0 w-44 group/item cursor-pointer">
                <div className="relative rounded-xl overflow-hidden bg-white shadow-sm border border-slate-200 aspect-[4/3] mb-3">
                  <img src={option.img} alt={option.title} className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300" />
                  {option.tag && (
                    <span className="absolute top-2 right-2 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm uppercase">
                      {option.tag}
                    </span>
                  )}
                  {option.title === 'Sell/Rent your property' && (
                    <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col items-center justify-center bg-white p-3 text-center">
                      <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mb-2 shadow-sm border-2 border-rose-100 text-rose-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                      </div>
                      <span className="text-xs font-bold text-slate-800 leading-tight">Sell faster at the right price!</span>
                    </div>
                  )}
                </div>
                <h3 className="text-center text-[13px] font-semibold text-slate-700 group-hover/item:text-rose-600 transition-colors">{option.title}</h3>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => executeSearch()} 
            className="absolute top-1/2 -right-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:text-white hover:bg-rose-500 hover:border-rose-500 cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-all hidden sm:flex"
            aria-label="View all properties"
            title="Go to Search"
          >
            <svg className="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </section>

      {/* Discovery Content block below options */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-8 text-center">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 inline-block">ALL PROPERTY NEEDS - ONE PORTAL</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight max-w-4xl mx-auto mb-16">
          Find Better Places to Live, Work<br />and Wonder...
        </h2>
        
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 text-left bg-white rounded-2xl overflow-hidden p-6 sm:p-0 mb-16">
          <div className="w-full md:w-1/2 overflow-hidden rounded-2xl md:rounded-none">
            <img 
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800" 
              alt="Living Room" 
              className="w-full h-[300px] md:h-[400px] object-cover rounded-2xl"
            />
          </div>
          <div className="w-full md:w-1/2 md:pr-12 lg:pr-20">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">BUY A HOME</span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
              Find, Buy & Own Your<br />Dream Home
            </h3>
            <p className="text-sm md:text-base text-slate-600 mb-8 font-medium">
              Explore from Apartments, land, builder floors,<br />villas and more
            </p>
            <button 
              onClick={() => executeSearch({ listingType: 'buy' })}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Explore Buying
            </button>
          </div>
        </div>

        {/* Popular Cities — driven by DB cityCounts */}
        <div className="mb-20 text-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">TOP CITIES</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-8">
            Explore Real Estate in Popular Indian Cities
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {(() => {
              const CITY_IMAGES: Record<string, string> = {
                'Delhi-NCR': '/images/cities/delhi.png',
                'Bengaluru': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80&w=150&h=150',
                'Mumbai': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=150&h=150',
                'Pune': '/images/cities/pune.png',
                'Hyderabad': '/images/cities/hyderabad.png',
                'Chennai': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=150&h=150',
                'Kolkata': 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&q=80&w=150&h=150',
                'Ahmedabad': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=150&h=150',
              };

              // Use cityCounts from metadata if available, with fallback
              const cityCountsObj = (cityCounts || {}) as Record<string, number>;
              const cityEntries = Object.keys(cityCountsObj).length > 0
                ? Object.entries(cityCountsObj).sort((a, b) => b[1] - a[1]).slice(0, 8)
                : Object.keys(CITY_IMAGES).map(c => [c, 0] as [string, number]);

              return cityEntries.map(([cityName, count]) => (
                <div 
                  key={cityName} 
                  onClick={() => executeSearch({ city: cityName })}
                  className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-slate-100"
                >
                  <img 
                    src={CITY_IMAGES[cityName] || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=150&h=150'} 
                    alt={cityName} 
                    className="w-12 h-12 rounded-lg object-cover" 
                  />
                  <div className="text-left">
                    <h4 className="text-[13px] font-bold text-slate-800">{cityName}</h4>
                    <p className="text-[11px] text-slate-500">
                      {count > 0 ? `${count.toLocaleString('en-IN')}+` : '—'} Properties
                    </p>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Stats Banner — driven by DB stats */}
        {stats && stats.totalProperties > 0 && (
          <div className="mb-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-center text-white shadow-lg">
              <p className="text-3xl sm:text-4xl font-black">{stats.totalProperties.toLocaleString('en-IN')}+</p>
              <p className="text-sm font-semibold opacity-90 mt-1">Total Properties</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-center text-white shadow-lg">
              <p className="text-3xl sm:text-4xl font-black">{stats.rentProperties.toLocaleString('en-IN')}+</p>
              <p className="text-sm font-semibold opacity-90 mt-1">Properties for Rent</p>
            </div>
            <div className="bg-gradient-to-br from-rose-600 to-rose-700 rounded-2xl p-6 text-center text-white shadow-lg">
              <p className="text-3xl sm:text-4xl font-black">{stats.buyProperties.toLocaleString('en-IN')}+</p>
              <p className="text-sm font-semibold opacity-90 mt-1">Properties for Sale</p>
            </div>
          </div>
        )}

        {/* Commercial Properties */}
        <div className="mb-12 text-center max-w-6xl mx-auto">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">COMMERCIAL SPACES</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-8">
            Choose from a wide variety of<br />commercial properties
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div 
              onClick={() => executeSearch({ listingType: 'buy', propertyTypes: ['Commercial'] })}
              className="bg-slate-100 rounded-2xl overflow-hidden relative text-left group cursor-pointer border border-slate-200"
            >
              <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="relative z-10 p-8">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">BUY FOR COMMERCIAL USE</span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">Buy a Commercial<br />property</h3>
                <p className="text-sm text-slate-700 mb-6 font-medium max-w-[200px]">Explore from Office Spaces, Co-working spaces, Retail Shops, Land, Factories and more</p>
                <button className="px-5 py-2.5 bg-white hover:bg-slate-50 text-blue-600 font-bold text-xs rounded-lg shadow-sm border border-slate-200 transition-colors">
                  Explore Buying Commercial
                </button>
              </div>
            </div>
            
            <div 
              onClick={() => executeSearch({ listingType: 'rent', propertyTypes: ['Commercial'] })}
              className="bg-rose-50 rounded-2xl overflow-hidden relative text-left group cursor-pointer border border-rose-100"
            >
              <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1572025442646-866d16c84a54?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="relative z-10 p-8">
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-2 block">LEASE FOR COMMERCIAL USE</span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">Lease a Commercial<br />property</h3>
                <p className="text-sm text-slate-700 mb-6 font-medium max-w-[200px]">Explore from Office Spaces, Co-working spaces, Retail Shops, Land, Factories and more</p>
                <button className="px-5 py-2.5 bg-white hover:bg-slate-50 text-blue-600 font-bold text-xs rounded-lg shadow-sm border border-slate-200 transition-colors">
                  Explore Leasing Commercial
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-12 border-t border-slate-200">
        <div className="mb-6 text-center">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">VERIFIED LISTINGS</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Latest Properties
          </h2>
        </div>

        {/* Content Views: Loading or Grid */}
        {isLoading ? (
          <PropertyGridSkeleton count={6} />
        ) : latestProperties.length === 0 ? (
          <div className="text-center py-10 text-slate-500">No properties available yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {latestProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={(id: string) => onNavigate(`/listings/${id}`)}
                onContactClick={(prop: Property) => setSelectedPropertyForInquiry(prop)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Inquiry Modal */}
      {selectedPropertyForInquiry && (
        <InquiryModal
          property={selectedPropertyForInquiry}
          isOpen={Boolean(selectedPropertyForInquiry)}
          onClose={() => setSelectedPropertyForInquiry(null)}
        />
      )}
    </div>
  );
};

