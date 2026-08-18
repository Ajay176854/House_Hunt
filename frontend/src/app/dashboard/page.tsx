'use client';

import { useRouter } from 'next/navigation';
import { DashboardPage } from '@/views/DashboardPage';

export default function Dashboard() {
  const router = useRouter();

  return (
    <DashboardPage
      onNavigate={(path: string) => router.push(path)}
    />
  );
}
