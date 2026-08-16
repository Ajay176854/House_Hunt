'use client';

import React, { useState, useEffect } from 'react';
import { PropertyForm } from '@/components/property/PropertyForm';
import { getPropertyById, updateProperty } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { ErrorState } from '@/components/common/ErrorState';
import { PropertyDetailSkeleton } from '@/components/common/LoadingSkeletons';
import { SEOHead } from '@/components/common/SEOHead';
import { Property } from '@/types';

interface EditListingPageProps {
  propertyId: string;
  onNavigate: (path: string) => void;
}

export const EditListingPage: React.FC<EditListingPageProps> = ({ propertyId, onNavigate }) => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setErrorStatus(null);
      try {
        const res = await getPropertyById(propertyId);
        setProperty(res.property);
      } catch (err: any) {
        setErrorStatus(err.status || 500);
        setErrorMessage(err.message || 'Failed to load property');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [propertyId]);

  if (isAuthLoading || isLoading) {
    return <PropertyDetailSkeleton />;
  }

  // 401 if unauthenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <SEOHead title="Edit Property - Login Required" />
        <ErrorState
          status={401}
          title="Sign in to Edit Listing"
          message="Please log in to your owner account to modify your property details."
          onNavigateLogin={() => onNavigate('/login')}
          onNavigateHome={() => onNavigate('/')}
        />
      </div>
    );
  }

  // Error handling
  if (errorStatus || !property) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <ErrorState
          status={errorStatus || 404}
          message={errorMessage || 'Property not found'}
          onNavigateHome={() => onNavigate('/')}
        />
      </div>
    );
  }

  // 403 Forbidden check: Not the owner!
  if (property.ownerId !== user.id) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <SEOHead title="Access Denied" />
        <ErrorState
          status={403}
          title="Not Your Property Listing"
          message={`You cannot edit "${property.title}" because it belongs to ${property.ownerName} (${property.ownerEmail}).`}
          onNavigateHome={() => onNavigate('/')}
        />
      </div>
    );
  }

  const handleUpdate = async (formData: FormData | Partial<Property>) => {
    const res = await updateProperty(propertyId, formData as any);
    setTimeout(() => {
      onNavigate(`/listings/${res.property.id}`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead title={`Edit - ${property.title}`} />
      <PropertyForm
        initialData={property}
        isEditing={true}
        onSubmit={handleUpdate}
        onCancel={() => onNavigate('/dashboard')}
      />
    </div>
  );
};
