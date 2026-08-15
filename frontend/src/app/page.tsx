'use client';

import { useRouter } from 'next/navigation';
import { HomePage } from '@/pages/HomePage';

export default function Home() {
  const router = useRouter();

  return (
    <HomePage
      initialCity="All Cities"
      onNavigate={(path: string) => router.push(path)}
    />
  );
}
