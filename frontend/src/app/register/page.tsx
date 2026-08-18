'use client';

import { useRouter } from 'next/navigation';
import { RegisterPage } from '@/views/RegisterPage';

export default function Register() {
  const router = useRouter();

  return (
    <RegisterPage
      onNavigate={(path: string) => router.push(path)}
    />
  );
}
