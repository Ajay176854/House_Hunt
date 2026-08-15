'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getMetadata, MetadataResponse } from '@/services/api';

interface MetadataContextType {
  cities: string[];
  cityCounts: Record<string, number>;
  heroProperty: MetadataResponse['heroProperty'] | null;
  stats: MetadataResponse['stats'] | null;
  isLoading: boolean;
  error: string | null;
}

const MetadataContext = createContext<MetadataContextType>({
  cities: [],
  cityCounts: {},
  heroProperty: null,
  stats: null,
  isLoading: true,
  error: null,
});

export const useMetadata = () => useContext(MetadataContext);

export const MetadataProvider = ({ children }: { children: React.ReactNode }) => {
  const [cities, setCities] = useState<string[]>([]);
  const [cityCounts, setCityCounts] = useState<Record<string, number>>({});
  const [heroProperty, setHeroProperty] = useState<MetadataResponse['heroProperty'] | null>(null);
  const [stats, setStats] = useState<MetadataResponse['stats'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setIsLoading(true);
        const data = await getMetadata();
        if (data.success) {
          setCities(data.cities || []);
          setCityCounts(data.cityCounts || {});
          setHeroProperty(data.heroProperty || null);
          setStats(data.stats || null);
        }
      } catch (err: any) {
        console.error('Failed to fetch metadata:', err);
        setError(err.message || 'Failed to fetch metadata');
        // Fallback cities if API fails
        setCities(['Bengaluru', 'Mumbai', 'Delhi-NCR', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad']);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  return (
    <MetadataContext.Provider value={{ cities, cityCounts, heroProperty, stats, isLoading, error }}>
      {children}
    </MetadataContext.Provider>
  );
};
