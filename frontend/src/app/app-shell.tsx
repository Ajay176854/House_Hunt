'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

/**
 * App shell — wraps all pages with Navbar and Footer.
 * Uses Next.js router for navigation instead of window.history.pushState.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');

  const navigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        currentPath={pathname || ''}
        onNavigate={navigate}
        selectedCity={selectedCity}
        onCityChange={(city) => {
          setSelectedCity(city);
          if (pathname !== '/') router.push('/');
        }}
      />

      <div className="flex-1">{children}</div>

      <Footer
        onNavigate={navigate}
        onSelectCity={(city: string) => {
          setSelectedCity(city);
          router.push('/');
        }}
      />
    </div>
  );
}
