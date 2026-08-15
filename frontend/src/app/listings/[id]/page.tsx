import type { Metadata } from 'next';
import { PropertyDetailClient } from './property-detail-client';

// =================== SSR + ISR for SEO ===================

// ISR: Revalidate every 5 minutes for fresh data
export const revalidate = 300;

// Generate dynamic metadata for SEO (runs on the server)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await fetch(`http://localhost:5000/api/listings/${id}`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return {
        title: 'Property Not Found',
        description: 'The requested property listing could not be found.',
      };
    }

    const data = await res.json();
    const property = data.property;

    return {
      title: `${property.title} — ${property.bedrooms} BHK ${property.propertyType} in ${property.locality}, ${property.city}`,
      description: property.description?.slice(0, 160) || `${property.bedrooms} BHK ${property.propertyType} available for ${property.listingType} in ${property.locality}, ${property.city}.`,
      openGraph: {
        title: property.title,
        description: property.description?.slice(0, 160),
        images: property.images?.[0] ? [{ url: property.images[0] }] : [],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: property.title,
        description: property.description?.slice(0, 160),
        images: property.images?.[0] ? [property.images[0]] : [],
      },
    };
  } catch {
    return {
      title: 'Property Details',
      description: 'View property details on HouseHunt.',
    };
  }
}

/**
 * Property Detail Page — Server Component with ISR.
 * 
 * SEO Strategy:
 * - generateMetadata runs on the server to produce <title>, <meta>, OpenGraph tags
 * - Page content is server-rendered for search engine crawlability
 * - ISR revalidates every 5 minutes for fresh data without full rebuild
 * - Interactive elements (inquiry modal, shortlist) are client components
 */
export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Server-side data fetch for initial SSR
  let property = null;
  let similar: any[] = [];

  try {
    const res = await fetch(`http://localhost:5000/api/listings/${id}`, {
      next: { revalidate: 300 },
    });

    if (res.ok) {
      const data = await res.json();
      property = data.property;
      similar = data.similar || [];
    }
  } catch (err) {
    console.error('Failed to fetch property for SSR:', err);
  }

  return (
    <PropertyDetailClient
      propertyId={id}
      initialProperty={property}
      initialSimilar={similar}
    />
  );
}
