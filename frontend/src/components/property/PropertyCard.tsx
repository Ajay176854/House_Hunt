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
  Compass,
  PhoneCall,
  BedDouble,
  Bath,
  Maximize2,
  MapPin,
  Check
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSelect?: (propertyId: string) => void;
  onContactClick?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
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

        {/* Listing Type Tag (Rent / Sale) */}
        <div className="absolute bottom-3 right-3 bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
          {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Price & Deposit */}
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

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-rose-600 transition-colors">
            {property.title}
          </h3>

          {/* Locality & Society */}
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 mb-3">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {property.societyName ? `${property.societyName}, ` : ''}{property.locality}, {property.city}
            </span>
          </div>

          {/* Key Specs Grid */}
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

        {/* Footer Actions */}
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
