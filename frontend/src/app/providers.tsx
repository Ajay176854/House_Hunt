'use client';

import { AuthProvider } from '@/context/AuthContext';
import { MetadataProvider } from '@/context/MetadataContext';
import { AppShell } from './app-shell';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <MetadataProvider>
        <AppShell>{children}</AppShell>
      </MetadataProvider>
    </AuthProvider>
  );
}
