'use client';

import { useRouter } from 'next/navigation';
import { CreateListingPage } from '@/views/CreateListingPage';

export default function NewListing() {
  const router = useRouter();

  return (
    <CreateListingPage
      onNavigate={(path: string) => router.push(path)}
    />
  );
}
