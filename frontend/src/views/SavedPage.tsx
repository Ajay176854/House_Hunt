'use client';

import React, { useState, useEffect } from 'react';
import { Property } from '@/types';
import { getProperties } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { PropertyCard } from '@/components/property/PropertyCard';
import { PropertyGridSkeleton } from '@/components/common/LoadingSkeletons';
import { InquiryModal } from '@/components/property/InquiryModal';
import { SEOHead } from '@/components/common/SEOHead';
import { Heart, Search, Home, Building2 } from 'lucide-react';

interface SavedPageProps {
  onNavigate: (path: string) => void;
}

export const SavedPage: React.FC<SavedPageProps> = ({ onNavigate }) => {
  const { savedPropertyIds } = useAuth();
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPropertyForInquiry, setSelectedPropertyForInquiry] = useState<Property | null>(null);

  useEffect(() => {
    async function loadSaved() {
      setIsLoading(true);
      try {
        const res = await getProperties({ limit: 50 });
        const filtered = res.data.filter((p) => savedPropertyIds.includes(p.id));
        setSavedProperties(filtered);
      } catch (err) {
        console.error('Failed to load saved properties', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadSaved();
  }, [savedPropertyIds]);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      <SEOHead title="Shortlisted Properties | HouseHunt" />

      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-rose-600" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                My Shortlisted Properties
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              You have saved <strong className="text-slate-800">{savedProperties.length}</strong> properties for easy comparison
            </p>
          </div>

          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Explore More
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {isLoading ? (
          <PropertyGridSkeleton count={3} />
        ) : savedProperties.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
            <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No properties saved yet</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Click the heart icon on any listing to save it here for quick access later.
            </p>
            <button
              onClick={() => onNavigate('/')}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
            >
              Browse Properties
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={(id) => onNavigate(`/listings/${id}`)}
                onContactClick={(prop) => setSelectedPropertyForInquiry(prop)}
              />
            ))}
          </div>
        )}
      </main>

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
