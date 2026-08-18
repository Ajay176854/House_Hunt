'use client';

import React from 'react';
import { FilterParams, ListingType, PropertyType, FurnishingStatus } from '@/types';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Building,
  Home,
  IndianRupee,
  X,
} from 'lucide-react';
import { useMetadata } from '@/context/MetadataContext';

interface FilterBarProps {
  filters: FilterParams;
  onFilterChange: (newFilters: Partial<FilterParams>) => void;
  onReset: () => void;
  totalResults: number;
}

export const CITIES = ['All Cities', 'Bengaluru', 'Mumbai', 'Delhi-NCR', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad'];

export const PROPERTY_TYPES: PropertyType[] = [
  'Apartment',
  'Villa',
  'Independent House',
  'Builder Floor',
  'Studio',
  'Penthouse',
  'Commercial',
  'Plot',
  'Land'
];

export const BHK_OPTIONS = [1, 2, 3, 4, 5];

export const FURNISHING_OPTIONS: FurnishingStatus[] = ['Furnished', 'Semi-Furnished', 'Unfurnished'];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  totalResults,
}) => {
  const { cities: dynamicCities } = useMetadata();
  const displayCities = ['All Cities', ...(dynamicCities?.length > 0 ? dynamicCities : CITIES.filter(c => c !== 'All Cities'))];

  const currentCity = filters.city || 'All Cities';
  const currentListingType = filters.listingType || 'all';

  const handleBhkToggle = (bhk: number) => {
    const currentBhk = filters.bedrooms || [];
    const nextBhk = currentBhk.includes(bhk)
      ? currentBhk.filter((b) => b !== bhk)
      : [...currentBhk, bhk];
    onFilterChange({ bedrooms: nextBhk, page: 1 });
  };

  const handleTypeToggle = (type: PropertyType) => {
    const currentTypes = filters.propertyTypes || [];
    const nextTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];
    onFilterChange({ propertyTypes: nextTypes, page: 1 });
  };

  const handleFurnishingToggle = (f: FurnishingStatus) => {
    const currentF = filters.furnishing || [];
    const nextF = currentF.includes(f)
      ? currentF.filter((item) => item !== f)
      : [...currentF, f];
    onFilterChange({ furnishing: nextF, page: 1 });
  };

  const hasActiveFilters = Boolean(
    (filters.search && filters.search.trim()) ||
    (filters.city && filters.city !== 'All Cities') ||
    (filters.listingType && filters.listingType !== 'all') ||
    (filters.bedrooms && filters.bedrooms.length > 0) ||
    (filters.propertyTypes && filters.propertyTypes.length > 0) ||
    (filters.furnishing && filters.furnishing.length > 0) ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.isZeroBrokerage ||
    filters.isVerified
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5 space-y-4">
      {/* Top Main Row: Rent/Buy toggle, City select, Keyword Search */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Rent / Buy Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 self-start lg:self-auto">
          {(['all', 'rent', 'buy'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onFilterChange({ listingType: mode, page: 1 })}
              className={`px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                currentListingType === mode
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {mode === 'all' ? 'All Listings' : mode === 'rent' ? 'For Rent' : 'For Sale'}
            </button>
          ))}
        </div>

        {/* City Dropdown */}
        <div className="flex items-center gap-2">
            <select
              value={currentCity}
              onChange={(e) => onFilterChange({ city: e.target.value === 'All Cities' ? undefined : e.target.value, page: 1 })}
              className="px-3.5 py-2.5 text-xs md:text-sm font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 cursor-pointer"
            >
              {displayCities.map((city) => (
                <option key={city} value={city}>
                  {city === 'All Cities' ? '📍 All Major Cities' : `📍 ${city}`}
                </option>
              ))}
            </select>

          {/* Search bar */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
              placeholder="Search by locality, society, or landmark (e.g. Indiranagar, DLF)..."
              className="w-full pl-10 pr-4 py-2 text-xs md:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
              suppressHydrationWarning
            />
            {filters.search && (
              <button
                onClick={() => onFilterChange({ search: '', page: 1 })}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sort by:</span>
          <select
            value={filters.sort || 'newest'}
            onChange={(e) => onFilterChange({ sort: e.target.value as any, page: 1 })}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 cursor-pointer"
          >
            <option value="newest">✨ Newest Listed</option>
            <option value="popular">🔥 Most Popular</option>
            <option value="price_asc">💰 Price: Low to High</option>
            <option value="price_desc">💎 Price: High to Low</option>
            <option value="area_desc">📐 Carpet Area: High to Low</option>
          </select>
        </div>
      </div>

      {/* Secondary Row: Quick Filters & BHK pills */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 items-center justify-between">
        {/* BHK Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 mr-1">BHK:</span>
          {BHK_OPTIONS.map((bhk) => {
            const isSelected = (filters.bedrooms || []).includes(bhk);
            return (
              <button
                key={bhk}
                onClick={() => handleBhkToggle(bhk)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {bhk === 5 ? '5+ BHK' : `${bhk} BHK`}
              </button>
            );
          })}
        </div>

        {/* Quick zero brokerage & verified toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onFilterChange({ isZeroBrokerage: !filters.isZeroBrokerage, page: 1 })}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              filters.isZeroBrokerage
                ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Zero Brokerage Only
          </button>

          <button
            onClick={() => onFilterChange({ isVerified: !filters.isVerified, page: 1 })}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              filters.isVerified
                ? 'bg-sky-50 border-sky-500 text-sky-700'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            Verified Owner Only
          </button>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Property Type and Furnishing tags */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-3 items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-slate-500 mr-1">Type:</span>
          {PROPERTY_TYPES.map((type) => {
            const isSelected = (filters.propertyTypes || []).includes(type);
            return (
              <button
                key={type}
                onClick={() => handleTypeToggle(type)}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-slate-500 mr-1">Furnishing:</span>
          {FURNISHING_OPTIONS.map((furn) => {
            const isSelected = (filters.furnishing || []).includes(furn);
            return (
              <button
                key={furn}
                onClick={() => handleFurnishingToggle(furn)}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {furn}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
