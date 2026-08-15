'use client';

import { useRouter } from 'next/navigation';
import { SavedPage } from '@/pages/SavedPage';

export default function Saved() {
  const router = useRouter();

  return (
    <SavedPage
      onNavigate={(path: string) => router.push(path)}
    />
  );
}
