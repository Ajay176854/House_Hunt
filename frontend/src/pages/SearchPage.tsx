'use client';

import React, { useState, useEffect } from 'react';
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
import { Sparkles, MapPin, Search } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize filters from URL
  const initialFilters: FilterParams = {
    city: searchParams?.get('city') || undefined,
    listingType: (searchParams?.get('listingType') as any) || 'all',
    search: searchParams?.get('search') || undefined,
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

  const [filters, setFilters] = useState<FilterParams>(initialFilters);
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPropertyForInquiry, setSelectedPropertyForInquiry] = useState<Property | null>(null);

  // Sync state to URL without full reload
  useEffect(() => {
    const query = new URLSearchParams();
    if (filters.city) query.set('city', filters.city);
    if (filters.listingType && filters.listingType !== 'all') query.set('listingType', filters.listingType);
    if (filters.search) query.set('search', filters.search);
    if (filters.page && filters.page > 1) query.set('page', filters.page.toString());
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

  const fetchListingData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getProperties(filters);
      setProperties(res.data);
      setTotalItems(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch (err: any) {
      setError(err.message || 'Failed to load properties');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListingData();
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<FilterParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      city: undefined,
      listingType: 'all',
      page: 1,
      limit: 10,
      sort: 'newest',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16 pt-24 md:pt-28">
      <SEOHead title="Search Properties | HouseHunt" description="Find your dream home with zero brokerage." />
      
      {/* Top Search Bar (replaces Hero) */}
      <div className="bg-slate-900 fixed top-16 left-0 right-0 z-40 py-3 px-4 shadow-md">
        <div className="max-w-7xl mx-auto flex gap-2">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              value={filters.search || ''}
              onChange={(e) => handleFilterChange({ search: e.target.value, page: 1 })}
              placeholder="Search by locality, society, or landmark..." 
              className="w-full bg-white text-[13px] font-medium text-slate-800 placeholder-slate-400 rounded-lg pl-9 pr-4 py-2 outline-none"
            />
          </div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer"
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
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  {totalItems} results <span className="font-normal text-slate-500">| Properties {filters.city ? `in ${filters.city}` : ''} {filters.listingType !== 'all' ? `for ${filters.listingType}` : ''}</span>
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sort By</span>
                <select 
                  value={filters.sort || 'newest'}
                  onChange={(e) => handleFilterChange({ sort: e.target.value as any, page: 1 })}
                  className="bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 rounded-lg px-3 py-1.5 outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="area_desc">Area: Largest First</option>
                </select>
              </div>
            </div>

            {/* Quick Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button 
                onClick={() => handleFilterChange({ isVerified: !filters.isVerified, page: 1 })}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${filters.isVerified ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                Verified
              </button>
              <button 
                onClick={() => handleFilterChange({ isZeroBrokerage: !filters.isZeroBrokerage, page: 1 })}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${filters.isZeroBrokerage ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                Zero Brokerage
              </button>
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
                <p className="text-slate-500 mb-6">We couldn't find any properties matching your current filters.</p>
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
                      onSelect={(id) => router.push(`/listings/${id}`)}
                      onContactClick={(p) => setSelectedPropertyForInquiry(p)} 
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={filters.page || 1}
                      totalPages={totalPages}
                      totalItems={totalItems}
                      itemsPerPage={filters.limit || 10}
                      onPageChange={(p) => handleFilterChange({ page: p })}
                    />
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
