'use client';

import { useRouter } from 'next/navigation';
import { EditListingPage } from '@/views/EditListingPage';
import { use } from 'react';

export default function EditListing({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  return (
    <EditListingPage
      propertyId={id}
      onNavigate={(path: string) => router.push(path)}
    />
  );
}
