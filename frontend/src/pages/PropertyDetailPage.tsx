'use client';

import React, { useState, useEffect } from 'react';
import { Property } from '@/types';
import { getPropertyById } from '@/services/api';
import { formatIndianPrice, formatIndianNumber, timeAgo } from '@/utils/formatters';
import { useAuth } from '@/context/AuthContext';
import { PropertyDetailSkeleton } from '@/components/common/LoadingSkeletons';
import { ErrorState } from '@/components/common/ErrorState';
import { InquiryModal } from '@/components/property/InquiryModal';
import { EmiCalculator } from '@/components/property/EmiCalculator';
import { NeighborhoodInsights } from '@/components/property/NeighborhoodInsights';
import { PropertyCard } from '@/components/property/PropertyCard';
import { SEOHead } from '@/components/common/SEOHead';
import {
  MapPin,
  Heart,
  Share2,
  ShieldCheck,
  Sparkles,
  Building2,
  Calendar,
  Layers,
  Compass,
  CheckCircle,
  Phone,
  Mail,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ArrowLeft,
  Check,
  Edit,
  Car,
  Trees,
  Flame,
  Zap,
} from 'lucide-react';

interface PropertyDetailPageProps {
  propertyId: string;
  onNavigate: (path: string) => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  propertyId,
  onNavigate,
}) => {
  const { user, isSaved, toggleSave } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Inquiry modal state
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryIntent, setInquiryIntent] = useState<'contact' | 'visit'>('contact');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const fetchDetail = async () => {
    setIsLoading(true);
    setErrorStatus(null);
    setErrorMessage(null);
    try {
      const res = await getPropertyById(propertyId);
      setProperty(res.property);
      setSimilarProperties(res.similar || []);
      setActiveImageIndex(0);
    } catch (err: any) {
      setErrorStatus(err.status || 500);
      setErrorMessage(err.message || 'Failed to load property details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [propertyId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (isLoading) {
    return <PropertyDetailSkeleton />;
  }

  if (errorStatus || !property) {
    return (
      <ErrorState
        status={errorStatus || 404}
        message={errorMessage || 'Property not found.'}
        onNavigateHome={() => onNavigate('/')}
        onRetry={fetchDetail}
      />
    );
  }

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'];

  const saved = isSaved(property.id);
  const isOwner = user && user.id === property.ownerId;

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Dynamic SEO Meta */}
      <SEOHead property={property} />

      {/* Top Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all properties</span>
          </button>

          <div className="flex items-center gap-2">
            {isOwner && (
              <button
                onClick={() => onNavigate(`/listings/${property.id}/edit`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit My Listing
              </button>
            )}

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
            </button>

            <button
              onClick={() => toggleSave(property.id)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                saved
                  ? 'bg-rose-50 border-rose-400 text-rose-600'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>{saved ? 'Shortlisted' : 'Shortlist'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* Main Title & Price Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase">
                {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
              </span>
              {property.isZeroBrokerage && (
                <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  0 Brokerage
                </span>
              )}
              {property.isVerified && (
                <span className="bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  Verified Property
                </span>
              )}
              <span className="text-xs text-slate-400">
                ID: {property.id} • Posted {timeAgo(property.createdAt)}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {property.title}
            </h1>

            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{property.address}</span>
            </div>
          </div>

          <div className="flex md:flex-col items-baseline md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {formatIndianPrice(property.price, property.listingType)}
            </div>
            {property.depositAmount && property.listingType === 'rent' && (
              <span className="text-xs text-slate-500 font-medium">
                Security Deposit: ₹{formatIndianNumber(property.depositAmount)}
              </span>
            )}
            {property.listingType === 'buy' && (
              <span className="text-xs text-slate-500 font-medium">
                ₹{formatIndianNumber(property.pricePerSqFt || Math.round(property.price / property.carpetAreaSqFt))} / sq.ft.
              </span>
            )}
          </div>
        </div>

        {/* High-Resolution Photo Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main Large Image */}
          <div className="lg:col-span-3 relative rounded-2xl overflow-hidden bg-slate-900 aspect-16/10 shadow-sm group">
            <img
              src={images[activeImageIndex]}
              alt={property.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setLightboxOpen(true)}
            />

            {/* Lightbox trigger button */}
            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute bottom-4 right-4 bg-slate-900/80 hover:bg-slate-900 backdrop-blur-xs text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
              <span>View All {images.length} Photos</span>
            </button>

            {/* Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition-all cursor-pointer opacity-80 hover:opacity-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition-all cursor-pointer opacity-80 hover:opacity-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail list */}
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[460px] pb-2 lg:pb-0">
            {images.map((img, index) => (
              <div
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`relative rounded-xl overflow-hidden shrink-0 w-24 lg:w-full aspect-16/10 cursor-pointer border-2 transition-all ${
                  index === activeImageIndex
                    ? 'border-rose-600 ring-2 ring-rose-200'
                    : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`thumb ${index}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Content Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Details & Specs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Specs Highlight Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Key Property Specifications
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 font-medium block">Carpet Area</span>
                  <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                    {property.carpetAreaSqFt} sq.ft.
                  </span>
                  <span className="text-[10px] text-slate-500">Super: {property.superBuiltUpAreaSqFt} sq.ft.</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 font-medium block">Configuration</span>
                  <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                    {property.bedrooms} BHK, {property.bathrooms} Bath
                  </span>
                  <span className="text-[10px] text-slate-500">{property.balconies} Balconies</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 font-medium block">Furnishing</span>
                  <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                    {property.furnishing}
                  </span>
                  <span className="text-[10px] text-slate-500">Ready to move</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 font-medium block">Floor Level</span>
                  <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                    {property.floorNo} of {property.totalFloors}
                  </span>
                  <span className="text-[10px] text-slate-500">{property.facing} Facing</span>
                </div>
              </div>

              {/* Extended Specs Table */}
              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 text-xs">
                <div>
                  <span className="text-slate-400">Property Type:</span>
                  <span className="font-semibold text-slate-800 ml-1.5">{property.propertyType}</span>
                </div>
                <div>
                  <span className="text-slate-400">Society Name:</span>
                  <span className="font-semibold text-slate-800 ml-1.5">{property.societyName || 'Independent'}</span>
                </div>
                <div>
                  <span className="text-slate-400">Property Age:</span>
                  <span className="font-semibold text-slate-800 ml-1.5">{property.ageOfProperty}</span>
                </div>
                <div>
                  <span className="text-slate-400">Availability:</span>
                  <span className="font-semibold text-slate-800 ml-1.5">{property.availableFrom}</span>
                </div>
                <div>
                  <span className="text-slate-400">Maintenance:</span>
                  <span className="font-semibold text-slate-800 ml-1.5">
                    {property.maintenanceCharges ? `₹${formatIndianNumber(property.maintenanceCharges)}/mo` : 'Included'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Gated Society:</span>
                  <span className="font-semibold text-slate-800 ml-1.5">
                    {property.gatedSecurity ? 'Yes (24x7 Security)' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Description Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <h2 className="text-base font-bold text-slate-900">About the Property</h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900">Amenities & Features</h2>
                <span className="text-xs text-slate-500 font-semibold">
                  {property.amenities.length} Features available
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5 text-xs text-slate-800 font-medium"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Locality & Commute Score */}
            <NeighborhoodInsights locality={property.locality} city={property.city} />

            {/* EMI & Affordability Calculator */}
            <EmiCalculator propertyPrice={property.price} listingType={property.listingType} />
          </div>

          {/* Right Column: Sticky Contact Owner Widget */}
          <div className="space-y-6 lg:sticky lg:top-24">
            {/* Owner Contact Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 text-white flex items-center justify-center font-black text-lg">
                  {property.ownerName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-slate-900">{property.ownerName}</h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-rose-50 text-rose-700 rounded uppercase">
                      {property.ownerType}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-700 flex items-center gap-1 mt-0.5 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Property Owner
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs space-y-1">
                  <span className="text-slate-500 block text-[11px] font-medium">Zero Brokerage Guarantee</span>
                  <p className="text-slate-800 font-semibold">
                    Connect directly without paying 1 month rent or 2% broker commissions.
                  </p>
                </div>

                {!showPhone ? (
                  <button
                    onClick={() => setShowPhone(true)}
                    className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    Contact Owner Directly
                  </button>
                ) : (
                  <a
                    href={`tel:${property.ownerPhone || '9876543210'}`}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-lg tracking-wide rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Phone className="w-5 h-5" />
                    {property.ownerPhone || '+91 98765 43210'}
                  </a>
                )}

                <button
                  onClick={() => {
                    setInquiryIntent('visit');
                    setInquiryModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-slate-600" />
                  Schedule Free Physical / Virtual Visit
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                <p className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Real-time inquiry delivery
                </p>
                <p className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Direct WhatsApp & phone alert sent to owner
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="pt-10 border-t border-slate-200 space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Similar Properties in {property.city}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Handpicked verified listings with zero brokerage matching this configuration
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProperties.map((simProp) => (
                <PropertyCard
                  key={simProp.id}
                  property={simProp}
                  onSelect={(id) => onNavigate(`/listings/${id}`)}
                  onContactClick={() => {
                    setProperty(simProp);
                    setInquiryModalOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between p-4">
          <div className="w-full max-w-7xl flex items-center justify-between text-white py-2">
            <span className="text-sm font-semibold">
              Photo {activeImageIndex + 1} of {images.length}
            </span>
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 hover:bg-white/20 rounded-full text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative max-w-5xl max-h-[75vh] flex items-center justify-center">
            <img
              src={images[activeImageIndex]}
              alt="fullscreen"
              className="max-w-full max-h-[75vh] object-contain rounded-lg"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-black/60 text-white rounded-full hover:bg-black cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-black/60 text-white rounded-full hover:bg-black cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto max-w-4xl py-2">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="thumb"
                onClick={() => setActiveImageIndex(i)}
                className={`w-16 h-12 object-cover rounded-lg cursor-pointer border-2 ${
                  i === activeImageIndex ? 'border-rose-500' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      {inquiryModalOpen && (
        <InquiryModal
          property={property}
          isOpen={inquiryModalOpen}
          intent={inquiryIntent}
          onClose={() => setInquiryModalOpen(false)}
        />
      )}
    </div>
  );
};
