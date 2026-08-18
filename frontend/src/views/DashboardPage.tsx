'use client';

import React, { useState, useEffect } from 'react';
import { Property, Inquiry } from '@/types';
import { getMyListings, getMyInquiries, deleteProperty, updateInquiryStatus } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { formatIndianPrice, timeAgo } from '@/utils/formatters';
import { DashboardSkeleton } from '@/components/common/LoadingSkeletons';
import { ErrorState } from '@/components/common/ErrorState';
import { SEOHead } from '@/components/common/SEOHead';
import {
  Building2,
  PlusCircle,
  Eye,
  MessageSquare,
  Heart,
  Edit,
  Trash2,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  UserCheck,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'listings' | 'inquiries'>('listings');
  const [myListings, setMyListings] = useState<Property[]>([]);
  const [myInquiries, setMyInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [listingsRes, inquiriesRes] = await Promise.all([
        getMyListings(),
        getMyInquiries(),
      ]);
      setMyListings(listingsRes.data || []);
      setMyInquiries(inquiriesRes.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const handleDelete = async () => {
    if (!propertyToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProperty(propertyToDelete.id);
      setMyListings((prev) => prev.filter((p) => p.id !== propertyToDelete.id));
      setPropertyToDelete(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete listing');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    try {
      await updateInquiryStatus(inquiryId, newStatus);
      setMyInquiries((prev) =>
        prev.map((inq) => (inq.id === inquiryId ? { ...inq, status: newStatus as any } : inq))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update inquiry status');
    }
  };

  if (isAuthLoading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <SEOHead title="My Listings Dashboard - Login Required" />
        <ErrorState
          status={401}
          title="Sign in to View Your Dashboard"
          message="Please log in to manage your active property listings and view incoming buyer inquiries."
          onNavigateLogin={() => onNavigate('/login')}
          onNavigateHome={() => onNavigate('/')}
        />
      </div>
    );
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-rose-600 mb-2">Error Loading Dashboard</h2>
        <p className="text-slate-600 mb-4">{error}</p>
        <button onClick={loadDashboardData} className="px-4 py-2 bg-slate-900 text-white rounded-lg">Try Again</button>
      </div>
    );
  }

  // Calculate aggregated stats
  const totalViews = myListings.reduce((acc, p) => acc + (p.viewsCount || 0), 0);
  const totalShortlists = myListings.reduce((acc, p) => acc + (p.shortlistedCount || 0), 0);
  const totalInquiries = myInquiries.length;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <SEOHead
        title="Owner Dashboard - My Listings & Inquiries | HouseHunt"
        description="Manage your verified real estate listings, inspect tenant inquiries, and schedule site visits."
      />

      {/* Dashboard Top Header */}
      <div className="bg-slate-900 text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-500 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight">{user.name}</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded uppercase">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{user.email} • {user.phone}</p>
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold mt-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Owner Account
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/listings/new')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Post Another Property
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Active Listings
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">
                {myListings.length}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Total Views
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">
                {totalViews.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Inquiries Received
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">
                {totalInquiries}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Shortlisted By
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">
                {totalShortlists}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-1.5 flex gap-2 w-fit">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'listings'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            My Listings ({myListings.length})
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'inquiries'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span>Inquiries Received</span>
            {myInquiries.length > 0 && (
              <span className="px-2 py-0.5 bg-rose-600 text-white rounded-full text-[10px] font-bold">
                {myInquiries.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: My Listings */}
        {activeTab === 'listings' && (
          <div className="space-y-4">
            {myListings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">No properties listed yet</h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">
                  List your property for free with Zero Brokerage to get direct leads from verified tenants and buyers.
                </p>
                <button
                  onClick={() => onNavigate('/listings/new')}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer"
                >
                  Post Free Listing
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myListings.map((prop) => (
                  <div
                    key={prop.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
                  >
                    <div className="flex gap-4 items-center">
                      <img
                        src={prop.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80'}
                        alt={prop.title}
                        className="w-24 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-900 text-white rounded uppercase">
                            {prop.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                          </span>
                          <span className="text-xs font-bold text-rose-600">
                            {formatIndianPrice(prop.price, prop.listingType)}
                          </span>
                        </div>
                        <h3
                          onClick={() => onNavigate(`/listings/${prop.id}`)}
                          className="font-bold text-slate-900 text-sm hover:text-rose-600 transition-colors cursor-pointer line-clamp-1"
                        >
                          {prop.title}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {prop.bedrooms} BHK • {prop.carpetAreaSqFt} sq.ft. • {prop.locality}, {prop.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
                      <div className="flex items-center gap-3 text-xs text-slate-500 mr-2 border-r border-slate-200 pr-4">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-slate-400" /> {prop.viewsCount} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-rose-500" /> {prop.shortlistedCount} saved
                        </span>
                      </div>

                      <button
                        onClick={() => onNavigate(`/listings/${prop.id}`)}
                        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="View Live Listing"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onNavigate(`/listings/${prop.id}/edit`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </button>

                      <button
                        onClick={() => setPropertyToDelete(prop)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Received Inquiries */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            {myInquiries.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">No inquiries yet</h3>
                <p className="text-xs text-slate-500 mt-1">
                  When interested tenants or buyers contact you or schedule site visits, their requests will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {myInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900">{inq.senderName}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded uppercase">
                            {inq.userType}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Inquiry for: <strong className="text-slate-800">{inq.propertyTitle}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={inq.status}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border cursor-pointer ${
                            inq.status === 'Visit Scheduled'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : inq.status === 'Contacted'
                              ? 'bg-sky-50 text-sky-700 border-sky-300'
                              : inq.status === 'Closed'
                              ? 'bg-slate-100 text-slate-600 border-slate-200'
                              : 'bg-amber-50 text-amber-700 border-amber-300'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Visit Scheduled">Visit Scheduled</option>
                          <option value="Closed">Closed</option>
                        </select>
                        <span className="text-[11px] text-slate-400">{timeAgo(inq.createdAt)}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700 border border-slate-100">
                      &quot;{inq.message}&quot;
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                      <div className="flex items-center gap-4">
                        <a
                          href={`tel:${inq.senderPhone}`}
                          className="flex items-center gap-1.5 text-rose-600 font-bold hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {inq.senderPhone}
                        </a>
                        <a
                          href={`mailto:${inq.senderEmail}`}
                          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          {inq.senderEmail}
                        </a>
                      </div>

                      {inq.visitDate && (
                        <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-semibold">
                          <Calendar className="w-3.5 h-3.5" />
                          Site Visit: {inq.visitDate} ({inq.visitTimeSlot || 'Morning'})
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {propertyToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">Delete Property Listing?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete &quot;{propertyToDelete.title}&quot;? This action cannot be undone.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setPropertyToDelete(null)}
                className="py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
