'use client';

import React, { useState, useEffect, KeyboardEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Property, FilterParams } from '@/types';
import { getProperties } from '@/services/api';
import { PropertyCard } from '@/components/property/PropertyCard';
import { FilterSidebar } from '@/components/property/FilterSidebar';
import { Pagination } from '@/components/common/Pagination';
import { PropertyGridSkeleton } from '@/components/common/LoadingSkeletons';
import { ErrorState } from '@/components/common/ErrorState';
import { InquiryModal } from '@/components/property/InquiryModal';
import { SEOHead } from '@/components/common/SEOHead';
import { Sparkles, MapPin, Search, ChevronRight, Map, X } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize filters from URL
  const initialFilters: FilterParams = {
    city: searchParams?.get('city') || undefined,
    listingType: (searchParams?.get('listingType') as any) || 'all',
    search: searchParams?.get('q') || searchParams?.get('search') || undefined,
    page: Number(searchParams?.get('page')) || 1,
    limit: 10,
    sort: (searchParams?.get('sort') as any) || 'newest',
    minPrice: searchParams?.get('minPrice') ? Number(searchParams?.get('minPrice')) : undefined,
    maxPrice: searchParams?.get('maxPrice') ? Number(searchParams?.get('maxPrice')) : undefined,
    propertyTypes: searchParams?.getAll('propertyTypes') as any[] || [],
    bedrooms: searchParams?.getAll('bedrooms')?.map(Number) || [],
    isVerified: searchParams?.get('isVerified') === 'true',
    isZeroBrokerage: searchParams?.get('isZeroBrokerage') === 'true',
  };

  const [filters, setFilters] = useState<Partial<FilterParams>>(initialFilters);
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [totalItems, setTotalItems] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  
  const [selectedPropertyForInquiry, setSelectedPropertyForInquiry] = useState<Property | null>(null);

  // Tokenized Search Input State
  type Suggestion = { text: string; type: 'City' | 'Locality' | 'Project' };
  const [searchInput, setSearchInput] = useState('');
  const [searchTokens, setSearchTokens] = useState<string[]>(
    initialFilters.search ? initialFilters.search.split(',').map(s => s.trim()).filter(Boolean) : []
  );
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (searchInput.length < 2) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      try {
        const res = await getProperties({ search: searchInput, limit: 10 });
        const newSuggestions: Suggestion[] = [];
        const seen = new Set<string>();
        
        const addSugg = (text: string, type: 'City'|'Locality'|'Project') => {
          if (text && text.toLowerCase().includes(searchInput.toLowerCase()) && !seen.has(text.toLowerCase())) {
            seen.add(text.toLowerCase());
            newSuggestions.push({ text, type });
          }
        };

        res.data.forEach((p: Property) => {
          addSugg(p.city, 'City');
          addSugg(p.locality, 'Locality');
          if (p.societyName) addSugg(p.societyName, 'Project');
        });

        setSuggestions(newSuggestions.slice(0, 5));
      } catch (err) {
        // ignore
      }
    };
    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // Listen to searchParams changes (e.g. when navbar city changes)
  useEffect(() => {
    const cityFromUrl = searchParams?.get('city') || undefined;
    if (cityFromUrl !== filters.city) {
      setFilters(prev => ({ ...prev, city: cityFromUrl }));
    }
  }, [searchParams?.get('city')]);

  // Sync state to URL without full reload
  useEffect(() => {
    const query = new URLSearchParams();
    if (filters.search) query.set('q', filters.search);
    if (filters.city) query.set('city', filters.city);
    if (filters.locality) query.set('locality', filters.locality);
    if (filters.listingType && filters.listingType !== 'all') query.set('type', filters.listingType);
    if (filters.sort && filters.sort !== 'newest') query.set('sort', filters.sort);
    if (filters.minPrice) query.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) query.set('maxPrice', filters.maxPrice.toString());
    if (filters.isVerified) query.set('isVerified', 'true');
    if (filters.isZeroBrokerage) query.set('isZeroBrokerage', 'true');
    
    filters.propertyTypes?.forEach(pt => query.append('propertyTypes', pt));
    filters.bedrooms?.forEach(b => query.append('bedrooms', b.toString()));

    const newUrl = `${window.location.pathname}?${query.toString()}`;
    window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
  }, [filters]);

  const fetchListingData = async (loadMore = false) => {
    if (loadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    try {
      const currentFilters = { ...filters };
      if (loadMore && nextCursor) {
        currentFilters.cursor = nextCursor;
      } else {
        delete currentFilters.cursor;
      }
      
      const res = await getProperties(currentFilters);
      
      if (loadMore) {
        setProperties(prev => [...prev, ...res.data]);
      } else {
        setProperties(res.data);
      }
      
      setTotalItems(res.pagination.total);
      setNextCursor(res.pagination.nextCursor);
    } catch (err: any) {
      setError(err.message || 'Failed to load properties');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchListingData(false);
    // Scroll to top when page changes (only on fresh fetch)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<FilterParams>) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      delete updated.cursor;
      return updated;
    });
  };

  const executeSearch = (tokens: string[], pendingInput: string = '') => {
    const finalTokens = [...tokens];
    if (pendingInput.trim()) {
      finalTokens.push(pendingInput.trim());
    }
    const searchString = finalTokens.join(',');
    
    // Update local tokens just in case it was a pending input
    setSearchTokens(finalTokens);
    setSearchInput('');
    
    handleFilterChange({ search: searchString });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (showSuggestions && suggestions.length > 0) {
        setSearchTokens([...searchTokens, suggestions[0].text]);
        setSearchInput('');
        setShowSuggestions(false);
      } else {
        executeSearch(searchTokens, searchInput);
      }
    } else if (e.key === ',' || e.key === 'Tab') {
      e.preventDefault();
      if (searchInput.trim()) {
        setSearchTokens([...searchTokens, searchInput.trim()]);
        setSearchInput('');
        setShowSuggestions(false);
      }
    } else if (e.key === 'Backspace' && searchInput === '' && searchTokens.length > 0) {
      e.preventDefault();
      setSearchTokens(searchTokens.slice(0, -1));
    }
  };

  const removeToken = (index: number) => {
    const newTokens = searchTokens.filter((_, i) => i !== index);
    setSearchTokens(newTokens);
    executeSearch(newTokens, searchInput);
  };

  const handleResetFilters = () => {
    setSearchTokens([]);
    setSearchInput('');
    setFilters({
      city: undefined,
      listingType: 'all',
      limit: 10,
      sort: 'newest',
      search: undefined,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16 pt-16">
      <SEOHead title="Search Properties | HouseHunt" description="Find your dream home with zero brokerage." />
      
      <div className="bg-rose-600 fixed top-0 left-0 right-0 z-40 py-3 px-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => router.push('/')}
            className="text-white font-black text-xl tracking-tight cursor-pointer shrink-0"
          >
            HouseHunt
          </div>

          {/* Search Input Container */}
          <div className="flex-1 bg-white rounded flex items-center px-3 min-h-[44px] py-1 max-w-4xl shadow-sm relative flex-wrap gap-y-1">
            
            {/* Listing Type Dropdown */}
            <select 
              value={filters.listingType || 'all'}
              onChange={(e) => handleFilterChange({ listingType: e.target.value as any })}
              className="bg-transparent text-[15px] text-slate-800 font-medium outline-none cursor-pointer appearance-none pr-5 py-1.5 relative shrink-0"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23334155\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', backgroundSize: '16px' }}
            >
              <option value="all">All</option>
              <option value="buy">Buy</option>
              <option value="rent">Rent</option>
            </select>

            {/* Vertical Divider */}
            <div className="w-[1px] h-6 bg-slate-300 mx-3 shrink-0"></div>

            {/* Active City Pill (From global selection) */}
            {filters.city && (
              <div className="bg-rose-50 border border-rose-200 text-slate-800 text-[15px] px-2.5 py-0.5 rounded-full flex items-center gap-1.5 mr-1.5 my-0.5 shrink-0">
                {filters.city}
                <button 
                  onClick={() => handleFilterChange({ city: undefined })}
                  className="text-rose-500 hover:text-rose-700 flex items-center justify-center cursor-pointer"
                  title="Remove global city filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* User Added Tokens */}
            {searchTokens.map((token, index) => (
              <div key={index} className="bg-rose-50 border border-rose-200 text-slate-800 text-[15px] px-2.5 py-0.5 rounded-full flex items-center gap-1.5 mr-1.5 my-0.5 shrink-0">
                {token}
                <button 
                  onClick={() => removeToken(index)}
                  className="text-rose-500 hover:text-rose-700 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Text Input */}
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={handleKeyDown}
              placeholder={searchTokens.length > 0 || filters.city ? "Add more..." : "Search locality, city, builder..."}
              className="flex-1 bg-transparent text-[15px] text-slate-800 placeholder-slate-400 outline-none h-8 min-w-[150px]"
              suppressHydrationWarning
            />

            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
                {suggestions.map((sugg, idx) => (
                  <div 
                    key={idx}
                    onClick={() => {
                      setSearchTokens([...searchTokens, sugg.text]);
                      setSearchInput('');
                      setShowSuggestions(false);
                    }}
                    className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex justify-between items-center border-b border-slate-100 last:border-0"
                  >
                    <span className="text-[14px] font-semibold text-slate-800">{sugg.text}</span>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">{sugg.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button 
            onClick={() => executeSearch(searchTokens, searchInput)}
            className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded text-[15px] font-bold transition-colors cursor-pointer shrink-0"
          >
            Search
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Sidebar */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <FilterSidebar 
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Right Content */}
          <div className="flex-1 min-w-0">
            
            {/* Results Header */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-medium text-slate-800">
                  {totalItems} results <span className="font-normal text-slate-500">| Property in {filters.city || 'India'} for {filters.listingType === 'buy' ? 'Sale' : filters.listingType === 'rent' ? 'Rent' : 'Sale/Rent'}</span>
                </h1>
              </div>
            </div>

            {/* Insights Banner */}
            {filters.city && (
              <div 
                onClick={() => router.push(`/insights/city-overview?city=${filters.city}`)}
                className="bg-orange-50/50 border border-orange-100 rounded-lg p-3 mb-6 flex items-center justify-between cursor-pointer hover:bg-orange-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 text-orange-600 p-2 rounded-full">
                    <Map className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                    Get to know more about <span className="font-bold">{filters.city}</span>
                  </span>
                </div>
                <div className="flex items-center text-rose-600 font-bold text-sm">
                  View Insights <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            )}

            {/* Quick Pills & Sort */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <button 
                  onClick={() => handleFilterChange({ readyToMove: false, listingType: 'buy' })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${filters.readyToMove === false ? 'border-orange-500 text-orange-600 bg-orange-50' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  <span className="text-orange-500"><Sparkles className="w-3 h-3 fill-orange-500" /></span>
                  NEW LAUNCH
                </button>
                <button 
                  onClick={() => handleFilterChange({ ownerType: 'Owner' })}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${filters.ownerType === 'Owner' ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  Owner
                </button>
                <button 
                  onClick={() => handleFilterChange({ isVerified: !filters.isVerified })}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${filters.isVerified ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  Verified
                </button>
                <button 
                  onClick={() => handleFilterChange({ readyToMove: false })}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${filters.readyToMove === false ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  Under construction
                </button>
                <button 
                  onClick={() => handleFilterChange({ readyToMove: true })}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${filters.readyToMove === true ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  Ready To Move
                </button>
                <button 
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors bg-white border-slate-200 text-slate-600 hover:border-slate-300`}
                >
                  With Photos
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
                  Sort By
                </span>
                <select 
                  value={filters.sort || 'newest'}
                  onChange={(e) => handleFilterChange({ sort: e.target.value as any })}
                  className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="newest">Relevance</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Error / Loading / Results */}
            {error && <ErrorState message={error} onRetry={fetchListingData} />}
            
            {isLoading ? (
              <PropertyGridSkeleton />
            ) : !error && properties.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">No properties found</h3>
                <p className="text-slate-500 mb-6">We couldn&apos;t find any properties matching your current filters.</p>
                <button 
                  onClick={handleResetFilters}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-lg font-bold transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {properties.map((property) => (
                    <PropertyCard 
                      key={property.id} 
                      property={property} 
                      layout="horizontal"
                      onSelect={(id) => router.push(`/listings/${id}`)}
                      onContactClick={(p) => setSelectedPropertyForInquiry(p)} 
                    />
                  ))}
                </div>

                {nextCursor && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => fetchListingData(true)}
                      disabled={isLoadingMore}
                      className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white px-8 py-3 rounded-lg font-bold transition-colors cursor-pointer"
                    >
                      {isLoadingMore ? 'Loading more...' : 'Load More Properties'}
                    </button>
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </div>

      {selectedPropertyForInquiry && (
        <InquiryModal
          property={selectedPropertyForInquiry}
          isOpen={true}
          onClose={() => setSelectedPropertyForInquiry(null)}
        />
      )}
    </div>
  );
};
