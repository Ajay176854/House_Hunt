'use client';

import React, { useEffect } from 'react';
import { Property } from '@/types';
import { formatIndianPrice } from '@/utils/formatters';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  property?: Property;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  image,
  url,
  type = 'website',
  property,
}) => {
  useEffect(() => {
    let finalTitle = 'HouseHunt | Zero Brokerage Real Estate Portal';
    let finalDesc =
      'Discover verified apartments, villas, and flats for rent and sale with zero brokerage across Bangalore, Mumbai, Delhi-NCR, Hyderabad, and Pune.';
    let finalImg =
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80';

    if (property) {
      const priceStr = formatIndianPrice(property.price, property.listingType);
      finalTitle = `${property.bedrooms} BHK ${property.propertyType} in ${property.locality}, ${property.city} - ${priceStr} | HouseHunt`;
      finalDesc = `${property.title}. ${property.carpetAreaSqFt} sq.ft. ${property.furnishing} ${property.propertyType} located in ${property.locality}, ${property.city}. Zero Brokerage verified listing.`;
      if (property.images && property.images.length > 0) {
        finalImg = property.images[0];
      }
    } else if (title) {
      finalTitle = `${title} | HouseHunt`;
      if (description) finalDesc = description;
      if (image) finalImg = image;
    }

    // Update document title
    document.title = finalTitle;

    // Helper to update or create meta tag
    const setMetaTag = (selector: string, attrName: string, attrVal: string, contentVal: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentVal);
    };

    setMetaTag('meta[name="description"]', 'name', 'description', finalDesc);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', finalTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', finalDesc);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', finalImg);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', type);
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', finalTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', finalDesc);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', finalImg);

    if (url) {
      setMetaTag('meta[property="og:url"]', 'property', 'og:url', url);
    }
  }, [title, description, image, url, type, property]);

  return null;
};
