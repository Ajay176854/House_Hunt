'use client';

import { useRouter } from 'next/navigation';
import { PropertyDetailPage as PropertyDetailPageComponent } from '@/pages/PropertyDetailPage';
import { Property } from '@/types';

interface Props {
  propertyId: string;
  initialProperty: Property | null;
  initialSimilar: Property[];
}

/**
 * Client component for interactive property detail page.
 * Receives server-side fetched data as initial props.
 */
export function PropertyDetailClient({ propertyId, initialProperty, initialSimilar }: Props) {
  const router = useRouter();

  return (
    <PropertyDetailPageComponent
      propertyId={propertyId}
      onNavigate={(path: string) => router.push(path)}
    />
  );
}
