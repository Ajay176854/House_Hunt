'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

/**
 * App shell — wraps all pages with Navbar and Footer.
 * Uses Next.js router for navigation instead of window.history.pushState.
 */
import { Suspense } from 'react';

function AppShellContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');

  useEffect(() => {
    const cityFromUrl = searchParams?.get('city');
    if (cityFromUrl) {
      setSelectedCity(cityFromUrl);
    } else {
      setSelectedCity('All Cities');
    }
  }, [searchParams]);

  const navigate = (path: string) => {
    router.push(path);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (city && city !== 'All Cities') {
      params.set('city', city);
    } else {
      params.delete('city');
    }
    
    // Always navigate to the current page but with updated city param
    // Unless we are not on / or /search, then just go to /
    const targetPath = (pathname === '/' || pathname === '/search') ? pathname : '/';
    router.push(`${targetPath}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        currentPath={pathname || ''}
        onNavigate={navigate}
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
      />

      <div className="flex-1">{children}</div>

      <Footer
        onNavigate={navigate}
        onSelectCity={handleCityChange}
      />
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50">{children}</div>}>
      <AppShellContent>{children}</AppShellContent>
    </Suspense>
  );
}
