'use client';

import React from 'react';

export const PropertyCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-pulse flex flex-col h-full">
      <div className="h-56 bg-slate-200 relative w-full" />
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="h-6 bg-slate-200 rounded w-1/3" />
            <div className="h-5 bg-slate-200 rounded-full w-20" />
          </div>
          <div className="h-4 bg-slate-200 rounded w-4/5 mb-2" />
          <div className="h-3 bg-slate-200 rounded w-1/2" />
        </div>
        <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100">
          <div className="h-8 bg-slate-100 rounded" />
          <div className="h-8 bg-slate-100 rounded" />
          <div className="h-8 bg-slate-100 rounded" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-4 bg-slate-200 rounded w-24" />
          <div className="h-9 bg-slate-200 rounded-lg w-28" />
        </div>
      </div>
    </div>
  );
};

export const PropertyGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const PropertyDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-8">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-2 w-2/3">
          <div className="h-8 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
        </div>
        <div className="h-10 bg-slate-200 rounded w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-96">
        <div className="lg:col-span-2 bg-slate-200 rounded-xl h-full" />
        <div className="grid grid-rows-2 gap-4 h-full">
          <div className="bg-slate-200 rounded-xl" />
          <div className="bg-slate-200 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-32 bg-slate-100 rounded-xl p-4 border border-slate-200" />
          <div className="h-48 bg-slate-100 rounded-xl p-4 border border-slate-200" />
        </div>
        <div className="h-96 bg-slate-100 rounded-xl p-4 border border-slate-200" />
      </div>
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-8 bg-slate-200 rounded w-48" />
        <div className="h-10 bg-slate-200 rounded-lg w-36" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-24 bg-slate-100 rounded-xl" />
        <div className="h-24 bg-slate-100 rounded-xl" />
        <div className="h-24 bg-slate-100 rounded-xl" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 bg-slate-100 rounded-xl border border-slate-200" />
        ))}
      </div>
    </div>
  );
};
