'use client';

import { useRouter } from 'next/navigation';
import { LoginPage } from '@/pages/LoginPage';

export default function Login() {
  const router = useRouter();

  return (
    <LoginPage
      onNavigate={(path: string) => router.push(path)}
    />
  );
}
