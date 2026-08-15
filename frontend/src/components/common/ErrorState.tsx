'use client';

import React from 'react';
import { AlertCircle, Lock, ShieldAlert, FileQuestion, RefreshCw, Home, LogIn } from 'lucide-react';

interface ErrorStateProps {
  status?: number;
  title?: string;
  message?: string;
  onRetry?: () => void;
  onNavigateHome?: () => void;
  onNavigateLogin?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  status = 500,
  title,
  message,
  onRetry,
  onNavigateHome,
  onNavigateLogin,
}) => {
  if (status === 401) {
    return (
      <div className="min-h-[450px] flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-amber-200 shadow-sm max-w-lg mx-auto my-12">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-4 ring-8 ring-amber-50">
          <Lock className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          {title || 'Authentication Required'}
        </h3>
        <p className="text-slate-600 text-sm mb-6 max-w-sm">
          {message || 'You must be logged in to post, edit, or manage property listings and direct inquiries.'}
        </p>
        <div className="flex gap-3">
          {onNavigateLogin && (
            <button
              onClick={onNavigateLogin}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              Log In / Register
            </button>
          )}
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </button>
          )}
        </div>
      </div>
    );
  }

  if (status === 403) {
    return (
      <div className="min-h-[450px] flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-rose-200 shadow-sm max-w-lg mx-auto my-12">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-4 ring-8 ring-rose-50">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          {title || 'Unauthorized Action'}
        </h3>
        <p className="text-slate-600 text-sm mb-6 max-w-sm">
          {message || 'Access Denied: You do not have permission to edit or delete this listing because it belongs to another owner.'}
        </p>
        <div className="flex gap-3">
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" />
              Browse Listings
            </button>
          )}
        </div>
      </div>
    );
  }

  if (status === 404) {
    return (
      <div className="min-h-[450px] flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto my-12">
        <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mb-4">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          {title || 'Listing Not Found'}
        </h3>
        <p className="text-slate-600 text-sm mb-6 max-w-sm">
          {message || 'The property you are looking for might have been sold, rented, or removed by the owner.'}
        </p>
        <div className="flex gap-3">
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" />
              Explore Other Properties
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[350px] flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto my-12">
      <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        {title || 'Something went wrong'}
      </h3>
      <p className="text-slate-600 text-sm mb-6 max-w-sm">
        {message || 'We encountered an issue fetching property listings. Please try again.'}
      </p>
      <div className="flex gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
        )}
      </div>
    </div>
  );
};
