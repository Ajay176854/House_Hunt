'use client';

import React from 'react';
import { PropertyForm } from '@/components/property/PropertyForm';
import { createProperty } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { ErrorState } from '@/components/common/ErrorState';
import { SEOHead } from '@/components/common/SEOHead';
import { Property } from '@/types';

interface CreateListingPageProps {
  onNavigate: (path: string) => void;
}

export const CreateListingPage: React.FC<CreateListingPageProps> = ({ onNavigate }) => {
  const { user, isLoading } = useAuth();

  if (!isLoading && !user) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <SEOHead title="Post Property - Login Required" />
        <ErrorState
          status={401}
          title="Sign in to Post a Property"
          message="You need an active owner or builder account to publish verified 0-brokerage listings."
          onNavigateLogin={() => onNavigate('/login')}
          onNavigateHome={() => onNavigate('/')}
        />
      </div>
    );
  }

  const handleCreate = async (formData: FormData | Partial<Property>) => {
    // Note: createProperty expects a FormData or Partial<Property>. 
    // We are passing it directly to createProperty.
    const res = await createProperty(formData as any);
    setTimeout(() => {
      onNavigate(`/listings/${res.property.id}`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead
        title="Post Free Property Advertisement | Zero Brokerage"
        description="List your flat, apartment, or house for rent or sale for free on HouseHunt with zero brokerage fees."
      />
      <PropertyForm
        onSubmit={handleCreate}
        onCancel={() => onNavigate('/dashboard')}
      />
    </div>
  );
};
