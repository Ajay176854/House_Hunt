import { ErrorState } from '@/components/common/ErrorState';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <ErrorState
        status={404}
        title="Page Not Found"
        message="The page or listing route you requested does not exist."
      />
    </div>
  );
}
