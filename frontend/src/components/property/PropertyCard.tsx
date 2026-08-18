'use client';

import React, { useState } from 'react';
import { Property } from '@/types';
import { formatIndianPrice, formatArea, timeAgo } from '@/utils/formatters';
import { useAuth } from '@/context/AuthContext';
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Sparkles,
  MapPin,
  PhoneCall,
  BedDouble,
  Bath,
  Check,
  Images,
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  layout?: 'vertical' | 'horizontal';
  onSelect?: (propertyId: string) => void;
  onContactClick?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  layout = 'vertical',
  onSelect,
  onContactClick,
}) => {
  const { isSaved, toggleSave } = useAuth();
  const saved = isSaved(property.id);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSave(property.id);
  };

  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onContactClick) {
      onContactClick(property);
    }
  };

  // ----------------------------------------------------
  // HORIZONTAL LAYOUT (99acres style)
  // ----------------------------------------------------
  if (layout === 'horizontal') {
    return (
      <div 
        onClick={() => onSelect && onSelect(property.id)}
        className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-200 transition-shadow overflow-hidden flex flex-col md:flex-row cursor-pointer"
      >
        {/* Left Side: Images */}
        <div className="w-full md:w-[320px] shrink-0 p-3 flex flex-col gap-1.5">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
            <img
              src={images[currentImgIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop&q=80';
              }}
            />
            {/* Top Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              <span className="bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider backdrop-blur-sm">FEATURED</span>
              {property.isVerified && (
                <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider flex items-center gap-0.5">
                  <ShieldCheck className="w-2.5 h-2.5" /> VERIFIED
                </span>
              )}
            </div>
            
            {/* Save Button */}
            <button
              onClick={handleSaveClick}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          {/* Thumbnails Row */}
          <div className="grid grid-cols-3 gap-1.5 h-[60px]">
            {images.slice(0, 3).map((img, idx) => (
              <div key={idx} className="relative rounded overflow-hidden bg-slate-100 cursor-pointer" onClick={(e) => { e.stopPropagation(); setCurrentImgIndex(idx); }}>
                <img src={img} className="w-full h-full object-cover opacity-90 hover:opacity-100" />
                {idx === 2 && images.length > 3 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold">
                    +{images.length - 3} more
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Contact Banner */}
          <div className="bg-slate-800 text-amber-400 text-[10px] font-bold px-2 py-1.5 rounded flex items-center gap-1.5 mt-1">
            <Sparkles className="w-3 h-3" />
            2 people already contacted since last week
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex justify-between items-start mb-1">
              <div>
                <h2 className="text-base font-bold text-slate-900 leading-tight group-hover:text-rose-600 transition-colors line-clamp-1">
                  {property.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  {property.propertyType} in {property.locality}, {property.city}
                </p>
              </div>
              <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded tracking-wider whitespace-nowrap ml-2">
                {property.readyToMove ? 'RESALE' : 'NEW'}
              </span>
            </div>

            <div className="flex items-start gap-8 mt-4 pb-4 border-b border-slate-100">
              <div>
                <div className="text-[22px] font-black text-slate-900 leading-none">
                  {formatIndianPrice(property.price, property.listingType)}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {property.listingType === 'buy' && property.pricePerSqFt ? `₹${property.pricePerSqFt.toLocaleString('en-IN')} /sqft` : ''}
                </div>
              </div>
              
              <div>
                <div className="text-[15px] font-bold text-slate-800 leading-none">
                  {property.carpetAreaSqFt.toLocaleString('en-IN')} sqft
                </div>
                <div className="text-xs text-slate-500 mt-1.5">
                  Area
                </div>
              </div>

              <div>
                <div className="text-[15px] font-bold text-slate-800 leading-none">
                  {property.bedrooms} BHK
                </div>
                <div className="text-xs text-slate-500 mt-1.5">
                  {property.readyToMove ? 'Ready To Move' : 'Under Construction'}
                </div>
              </div>
            </div>

            {/* Quick badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-semibold px-2.5 py-1 rounded-full">Gated Society</span>
              <span className="bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-semibold px-2.5 py-1 rounded-full">2 side open</span>
              <span className="bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-semibold px-2.5 py-1 rounded-full">{property.bathrooms} Baths</span>
            </div>

            <p className="text-xs text-slate-500 mt-3 line-clamp-1">
              This prime property located in {property.locality}, {property.city}. Enjoy excellent connectivity to markets, schools, and transportation networks...
            </p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-400 font-medium">{timeAgo(property.createdAt)}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="bg-orange-100 text-orange-700 text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider">FEATURED</span>
                <span className="text-xs font-bold text-slate-700">{property.ownerType === 'Builder' ? 'Builder' : property.ownerType === 'Agent' ? 'Agent' : 'Owner'}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={handleContact}
                className="px-4 py-2 border border-rose-600 text-rose-600 font-bold text-[13px] rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
              >
                View Number
              </button>
              <button 
                onClick={handleContact}
                className="px-4 py-2 bg-rose-600 text-white font-bold text-[13px] rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VERTICAL LAYOUT (Original Grid Style)
  // ----------------------------------------------------
  return (
    <div
      onClick={() => onSelect && onSelect(property.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-rose-300 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Media Box */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        <img
          src={images[currentImgIndex]}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Carousel controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              aria-label="Previous image"
              className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-opacity cursor-pointer ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              aria-label="Next image"
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-opacity cursor-pointer ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentImgIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          {property.isZeroBrokerage && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-600 text-white shadow-sm">
              <Sparkles className="w-3 h-3" />
              0 Brokerage
            </span>
          )}
          {property.isVerified && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-slate-900/80 backdrop-blur-xs text-white">
              <ShieldCheck className="w-3 h-3 text-sky-400" />
              Verified
            </span>
          )}
        </div>

        {/* Shortlist Heart Button */}
        <button
          onClick={handleSaveClick}
          aria-label={saved ? 'Remove from shortlist' : 'Add to shortlist'}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-90 cursor-pointer ${
            saved
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/90 text-slate-700 hover:bg-white hover:text-rose-600'
          }`}
        >
          <Heart className={`w-5 h-5 ${saved ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* Listing Type Tag */}
        <div className="absolute bottom-3 right-3 bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
          {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <div className="text-xl font-extrabold text-slate-900 tracking-tight">
              {formatIndianPrice(property.price, property.listingType)}
            </div>
            {property.depositAmount && property.listingType === 'rent' && (
              <span className="text-xs text-slate-500">
                Deposit: ₹{(property.depositAmount / 1000).toFixed(0)}k
              </span>
            )}
            {property.listingType === 'buy' && (
              <span className="text-xs text-slate-500 font-medium">
                ₹{property.pricePerSqFt?.toLocaleString('en-IN') || Math.round(property.price / property.carpetAreaSqFt)}/sq.ft.
              </span>
            )}
          </div>

          <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-rose-600 transition-colors">
            {property.title}
          </h3>

          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 mb-3">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {property.societyName ? `${property.societyName}, ` : ''}{property.locality}, {property.city}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 py-2.5 px-2 bg-slate-50 rounded-xl text-center text-xs text-slate-700 border border-slate-100 mb-3">
            <div className="flex flex-col items-center justify-center p-1">
              <span className="text-[10px] text-slate-400 font-medium uppercase">Carpet Area</span>
              <span className="font-semibold text-slate-900 mt-0.5">
                {property.carpetAreaSqFt} sq.ft.
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-1 border-x border-slate-200">
              <span className="text-[10px] text-slate-400 font-medium uppercase">Configuration</span>
              <span className="font-semibold text-slate-900 mt-0.5">
                {property.bedrooms} BHK, {property.bathrooms} Bath
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-1">
              <span className="text-[10px] text-slate-400 font-medium uppercase">Furnishing</span>
              <span className="font-semibold text-slate-900 mt-0.5 truncate max-w-full px-1">
                {property.furnishing.replace('-Furnished', '')}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex flex-col text-[11px] text-slate-500">
            <span>Posted by <strong className="text-slate-800">{property.ownerType}</strong></span>
            <span className="text-[10px] text-slate-400">{timeAgo(property.createdAt)}</span>
          </div>

          <button
            onClick={handleContact}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Contact Owner
          </button>
        </div>
      </div>
    </div>
  );
};
