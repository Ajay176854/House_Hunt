'use client';

import React, { useState } from 'react';
import { Property, ListingType, PropertyType, FurnishingStatus, PropertyAge } from '@/types';
import { PROPERTY_TYPES, FURNISHING_OPTIONS, CITIES } from '@/components/property/FilterBar';
import { formatIndianPrice } from '@/utils/formatters';
import {
  Building2,
  MapPin,
  IndianRupee,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Plus,
  Trash2,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PropertyFormProps {
  initialData?: Partial<Property>;
  isEditing?: boolean;
  onSubmit: (data: FormData | Partial<Property>) => Promise<void>;
  onCancel?: () => void;
}

const AVAILABLE_AMENITIES = [
  'Swimming Pool',
  'Gymnasium',
  '24x7 Security & CCTV',
  'Clubhouse',
  'Power Backup (100%)',
  'Covered Car Parking',
  "Children's Play Area",
  'Jogging Track',
  'Intercom',
  'Piped Gas',
  'EV Charging Station',
  'Private Garden Lawn',
  'Badminton Court',
  'Lift',
  'Rainwater Harvesting',
  'Servant Room',
];

const PRESET_GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80',
];

export const PropertyForm: React.FC<PropertyFormProps> = ({
  initialData,
  isEditing = false,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Property>>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    listingType: initialData?.listingType || 'rent',
    propertyType: initialData?.propertyType || 'Apartment',
    price: initialData?.price || 35000,
    maintenanceCharges: initialData?.maintenanceCharges || 3500,
    depositAmount: initialData?.depositAmount || 150000,
    bedrooms: initialData?.bedrooms || 2,
    bathrooms: initialData?.bathrooms || 2,
    balconies: initialData?.balconies || 1,
    carpetAreaSqFt: initialData?.carpetAreaSqFt || 1150,
    superBuiltUpAreaSqFt: initialData?.superBuiltUpAreaSqFt || 1400,
    furnishing: initialData?.furnishing || 'Semi-Furnished',
    facing: initialData?.facing || 'East',
    floorNo: initialData?.floorNo || 5,
    totalFloors: initialData?.totalFloors || 14,
    ageOfProperty: initialData?.ageOfProperty || '1-5 years',
    availableFrom: initialData?.availableFrom || 'Immediate',
    address: initialData?.address || '',
    locality: initialData?.locality || '',
    city: initialData?.city || 'Bengaluru',
    pinCode: initialData?.pinCode || '',
    landmark: initialData?.landmark || '',
    societyName: initialData?.societyName || '',
    images: initialData?.images && initialData.images.length > 0 ? initialData.images : [PRESET_GALLERY_IMAGES[0], PRESET_GALLERY_IMAGES[1]],
    amenities: initialData?.amenities || ['24x7 Security & CCTV', 'Lift', 'Power Backup (100%)', 'Covered Car Parking'],
    isZeroBrokerage: initialData?.isZeroBrokerage !== undefined ? initialData.isZeroBrokerage : true,
    petFriendly: initialData?.petFriendly !== undefined ? initialData.petFriendly : true,
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);

  const [customImageUrl, setCustomImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) newErrors.title = 'Title is required (e.g. 3 BHK in Prestige Falcon City)';
    if (!formData.locality?.trim()) newErrors.locality = 'Locality / Area is required';
    if (!formData.city?.trim()) newErrors.city = 'City is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Please enter a valid price';
    if (!formData.carpetAreaSqFt || formData.carpetAreaSqFt <= 0) newErrors.carpetAreaSqFt = 'Carpet area is required';
    if (!formData.bedrooms || formData.bedrooms <= 0) newErrors.bedrooms = 'Bedrooms count is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAmenityToggle = (amenity: string) => {
    const current = formData.amenities || [];
    const next = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    setFormData({ ...formData, amenities: next });
  };

  const handleAddPresetImage = (url: string) => {
    const current = formData.images || [];
    if (!current.includes(url)) {
      setFormData({ ...formData, images: [...current, url] });
    }
  };

  const handleAddCustomImage = () => {
    if (customImageUrl.trim()) {
      const current = formData.images || [];
      setFormData({ ...formData, images: [...current, customImageUrl.trim()] });
      setCustomImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    const current = formData.images || [];
    setFormData({ ...formData, images: current.filter((_, i) => i !== index) });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
      
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setFilePreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviewUrls((prev) => {
      const newUrls = [...prev];
      URL.revokeObjectURL(newUrls[index]);
      newUrls.splice(index, 1);
      return newUrls;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value) || typeof value === 'object') {
            submitData.append(key, JSON.stringify(value));
          } else {
            submitData.append(key, String(value));
          }
        }
      });
      
      selectedFiles.forEach((file) => {
        submitData.append('images', file);
      });

      await onSubmit(submitData);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to submit property' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {isEditing ? 'Edit Property Listing' : 'Post Free Property Advertisement'}
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Zero Brokerage verified listing • Connect directly with millions of genuine buyers and tenants.
        </p>
      </div>

      {errors.form && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-medium">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Basic Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="w-5 h-5 text-rose-600" />
              1. Basic Property Details
            </h2>

            {/* Listing Type: Rent vs Buy */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Listing Type <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['rent', 'buy'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, listingType: type })}
                    className={`py-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                      formData.listingType === type
                        ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {type === 'rent' ? 'For Rent' : 'For Sale'}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Title */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Property Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Spacious 3 BHK East Facing Apartment in Prestige Falcon City"
                className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-rose-500 ${
                  errors.title ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
            </div>

            {/* Property Type & Society */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Property Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as PropertyType })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                >
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Society / Project Name
                </label>
                <input
                  type="text"
                  value={formData.societyName || ''}
                  onChange={(e) => setFormData({ ...formData, societyName: e.target.value })}
                  placeholder="e.g. Prestige Falcon City, Lodha Park"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Description & Highlights
              </label>
              <textarea
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detail the natural lighting, ventilation, proximity to schools/metro, recently renovated interiors..."
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Section 2: Location Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-5 h-5 text-rose-600" />
              2. Location & Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  City <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                >
                  {CITIES.filter((c) => c !== 'All Cities').map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Locality / Neighborhood <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.locality || ''}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                  placeholder="e.g. Indiranagar, Bandra West, Golf Course Rd"
                  className={`w-full px-3 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-rose-500 ${
                    errors.locality ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300'
                  }`}
                />
                {errors.locality && <p className="text-xs text-rose-600 mt-1">{errors.locality}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Street Address
                </label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Flat No, Building, Street, Landmark"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Pin Code
                </label>
                <input
                  type="text"
                  value={formData.pinCode || ''}
                  onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                  placeholder="560001"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Specs & Pricing */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <IndianRupee className="w-5 h-5 text-rose-600" />
              3. Pricing, Area & Dimensions
            </h2>

            {/* Price & Maintenance */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {formData.listingType === 'rent' ? 'Monthly Rent (₹)' : 'Expected Sale Price (₹)'}{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  placeholder={formData.listingType === 'rent' ? '45000' : '15000000'}
                  className={`w-full px-3 py-2 text-sm border rounded-xl focus:ring-2 focus:ring-rose-500 ${
                    errors.price ? 'border-rose-500 bg-rose-50/30' : 'border-slate-300'
                  }`}
                />
                <span className="text-[11px] font-semibold text-rose-600 mt-1 block">
                  {formatIndianPrice(Number(formData.price || 0), formData.listingType)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Maintenance (₹/mo)
                </label>
                <input
                  type="number"
                  value={formData.maintenanceCharges || ''}
                  onChange={(e) => setFormData({ ...formData, maintenanceCharges: Number(e.target.value) })}
                  placeholder="3000"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {formData.listingType === 'rent' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Security Deposit (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.depositAmount || ''}
                    onChange={(e) => setFormData({ ...formData, depositAmount: Number(e.target.value) })}
                    placeholder="150000"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              )}
            </div>

            {/* BHK, Baths, Balconies */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Bedrooms (BHK) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>{num} BHK</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Bathrooms
                </label>
                <select
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>{num} Bath</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Carpet Area (sq.ft.) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.carpetAreaSqFt || ''}
                  onChange={(e) => setFormData({ ...formData, carpetAreaSqFt: Number(e.target.value) })}
                  placeholder="1200"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Furnishing Status
                </label>
                <select
                  value={formData.furnishing}
                  onChange={(e) => setFormData({ ...formData, furnishing: e.target.value as FurnishingStatus })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                >
                  {FURNISHING_OPTIONS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Floor and Facing */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Floor No
                </label>
                <input
                  type="number"
                  value={formData.floorNo || ''}
                  onChange={(e) => setFormData({ ...formData, floorNo: Number(e.target.value) })}
                  placeholder="4"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Total Floors
                </label>
                <input
                  type="number"
                  value={formData.totalFloors || ''}
                  onChange={(e) => setFormData({ ...formData, totalFloors: Number(e.target.value) })}
                  placeholder="12"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Facing
                </label>
                <select
                  value={formData.facing}
                  onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                >
                  {['East', 'North', 'North-East', 'West', 'South', 'North-West', 'South-East'].map((dir) => (
                    <option key={dir} value={dir}>{dir}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Available From
                </label>
                <input
                  type="text"
                  value={formData.availableFrom || ''}
                  onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                  placeholder="Immediate / Within 15 Days"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Amenities Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layers className="w-5 h-5 text-rose-600" />
              4. Amenities & Features
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {AVAILABLE_AMENITIES.map((amenity) => {
                const isChecked = (formData.amenities || []).includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-rose-50 border-rose-400 text-rose-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{amenity}</span>
                    {isChecked && <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Photos */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ImageIcon className="w-5 h-5 text-rose-600" />
              5. Property Photographs
            </h2>

            {/* Preset quick picker */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">
                Select high-quality images from your device:
              </label>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
              />
            </div>

            {/* Selected Images List */}
            {(formData.images?.length! > 0 || filePreviewUrls.length > 0) && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {/* Existing Images */}
                {(formData.images || []).map((img, idx) => (
                  <div key={`exist-${idx}`} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-16/10">
                    <img src={img} alt={`selected ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-rose-600/90 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                
                {/* New Files */}
                {filePreviewUrls.map((img, idx) => (
                  <div key={`new-${idx}`} className="relative group rounded-xl overflow-hidden border border-rose-200 aspect-16/10">
                    <img src={img} alt={`new preview ${idx}`} className="w-full h-full object-cover opacity-80" />
                    <div className="absolute top-1 left-1 bg-rose-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">NEW</div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      className="absolute top-1 right-1 bg-rose-600/90 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Saving Property...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {isEditing ? 'Save Changes' : 'Publish Free Listing'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Preview Sidebar */}
        <div className="hidden lg:block space-y-4">
          <div className="sticky top-24">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <Eye className="w-4 h-4 text-rose-600" />
              Live Listing Preview
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
              <div className="relative aspect-16/10 bg-slate-100">
                <img
                  src={formData.images?.[0] || PRESET_GALLERY_IMAGES[0]}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  0% Brokerage
                </div>
                <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                  {formData.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="text-xl font-black text-slate-900">
                  {formatIndianPrice(Number(formData.price || 0), formData.listingType)}
                </div>
                <h4 className="font-bold text-slate-800 text-sm line-clamp-2">
                  {formData.title || 'Your Property Title Preview'}
                </h4>
                <p className="text-xs text-slate-500">
                  📍 {formData.locality || 'Locality'}, {formData.city}
                </p>

                <div className="grid grid-cols-3 gap-1 py-2 bg-slate-50 rounded-lg text-center text-xs text-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Area</span>
                    <span className="font-bold">{formData.carpetAreaSqFt || 0} sqft</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">BHK</span>
                    <span className="font-bold">{formData.bedrooms || 1} BHK</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Furnishing</span>
                    <span className="font-bold truncate px-1">
                      {formData.furnishing?.replace('-Furnished', '')}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Owner
                  </span>
                  <span className="text-[10px]">Just now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
