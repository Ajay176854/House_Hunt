'use client';

import { useRouter } from 'next/navigation';
import { LoginPage } from '@/views/LoginPage';

export default function Login() {
  const router = useRouter();

  return (
    <LoginPage
      onNavigate={(path: string) => router.push(path)}
    />
  );
}
