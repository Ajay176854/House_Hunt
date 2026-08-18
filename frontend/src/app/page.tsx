'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { HomePage } from '@/views/HomePage';
import { Suspense } from 'react';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const city = searchParams?.get('city') || 'All Cities';

  return (
    <HomePage
      initialCity={city}
      onNavigate={(path: string) => router.push(path)}
    />
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
