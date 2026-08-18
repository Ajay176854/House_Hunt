import { SearchPage } from '@/views/SearchPage';
import { Suspense } from 'react';

export default function SearchRoute() {
  return (
    <Suspense fallback={null}>
      <SearchPage />
    </Suspense>
  );
}
