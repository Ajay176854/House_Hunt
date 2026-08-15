'use client';

import { useRouter } from 'next/navigation';
import { DashboardPage } from '@/pages/DashboardPage';

export default function Dashboard() {
  const router = useRouter();

  return (
    <DashboardPage
      onNavigate={(path: string) => router.push(path)}
    />
  );
}
