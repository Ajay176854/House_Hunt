'use client';

import React, { useState } from 'react';
import { Property, Inquiry } from '@/types';
import { sendInquiry } from '@/services/api';
import { formatIndianPrice } from '@/utils/formatters';
import { useAuth } from '@/context/AuthContext';
import { X, Calendar, Clock, User as UserIcon, Phone, Mail, MessageSquare, CheckCircle, ShieldCheck, Sparkles, Home } from 'lucide-react';
import confetti from 'canvas-confetti';

interface InquiryModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (inquiry: Inquiry) => void;
  intent?: 'contact' | 'visit';
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  property,
  isOpen,
  onClose,
  onSuccess,
  intent = 'contact',
}) => {
  const { user } = useAuth();
  const [senderName, setSenderName] = useState(user?.name || '');
  const [senderEmail, setSenderEmail] = useState(user?.email || '');
  const [senderPhone, setSenderPhone] = useState(user?.phone || '');
  const [message, setMessage] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitTimeSlot, setVisitTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [userType, setUserType] = useState<'Buyer' | 'Tenant' | 'Investor'>(
    property.listingType === 'rent' ? 'Tenant' : 'Buyer'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    ownerContact: { name: string; phone: string; email: string };
  } | null>(null);

  if (!isOpen) return null;

  const quickQuestions = [
    'Is the price negotiable?',
    'When is it available for move-in?',
    'Are pets allowed?',
    'Can you share a recent video walkthrough?',
    'Is car parking included?'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!senderName.trim()) {
      setError('Please provide your full name');
      return;
    }
    if (!senderEmail.trim() || !senderEmail.includes('@')) {
      setError('Please provide a valid email address');
      return;
    }
    if (!senderPhone.trim() || senderPhone.length < 8) {
      setError('Please provide a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await sendInquiry({
        propertyId: property.id,
        senderName,
        senderEmail,
        senderPhone,
        message: message || `Hi ${property.ownerName}, I am interested in your ${property.bedrooms} BHK in ${property.societyName || property.locality}. Please contact me.`,
        visitDate: visitDate || undefined,
        visitTimeSlot: visitDate ? visitTimeSlot : undefined,
        userType,
      });

      setSubmittedData({ ownerContact: res.ownerContact });
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      if (onSuccess) {
        onSuccess(res.inquiry);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 my-8">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {intent === 'visit' ? 'Schedule a Visit' : 'Contact Property Owner'}
              </h3>
              <p className="text-xs text-slate-300">100% Zero Brokerage direct connection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Property Mini Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-600">
          <div className="truncate pr-2">
            <span className="font-semibold text-slate-900 block truncate">{property.title}</span>
            <span>{property.locality}, {property.city}</span>
          </div>
          <div className="text-right shrink-0">
            <span className="text-rose-600 font-bold text-sm block">
              {formatIndianPrice(property.price, property.listingType)}
            </span>
            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium border border-emerald-200">
              Zero Brokerage
            </span>
          </div>
        </div>

        {submittedData ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">Inquiry Sent Successfully!</h4>
              <p className="text-slate-600 text-sm mt-1">
                Your request has been delivered directly to the owner.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified Owner Contact
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Name:</span>
                  <span className="font-semibold text-slate-800">{submittedData.ownerContact.name} ({property.ownerType})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <a href={`tel:${submittedData.ownerContact.phone}`} className="font-bold text-rose-600 hover:underline">
                    {submittedData.ownerContact.phone}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Email:</span>
                  <a href={`mailto:${submittedData.ownerContact.email}`} className="text-slate-700 hover:underline">
                    {submittedData.ownerContact.email}
                  </a>
                </div>
              </div>
            </div>

            {visitDate && (
              <div className="text-xs text-slate-500 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                📅 Site Visit requested for <strong>{visitDate}</strong> during <strong>{visitTimeSlot}</strong>.
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {error && (
              <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            {/* User Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                I am a
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Buyer', 'Tenant', 'Investor'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setUserType(type)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      userType === type
                        ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Anand Kumar"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="anand@example.com"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule a Visit Section */}
            <div className={`p-3 rounded-xl border space-y-2 transition-colors ${intent === 'visit' ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                <Calendar className={`w-4 h-4 ${intent === 'visit' ? 'text-rose-600' : 'text-slate-500'}`} />
                Schedule Physical / Virtual Site Visit {intent !== 'visit' && '(Optional)'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="date"
                  value={visitDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-rose-500"
                />
                <select
                  value={visitTimeSlot}
                  onChange={(e) => setVisitTimeSlot(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-rose-500"
                >
                  <option>10:00 AM - 12:00 PM</option>
                  <option>12:00 PM - 03:00 PM</option>
                  <option>03:00 PM - 06:00 PM</option>
                  <option>06:00 PM - 08:00 PM</option>
                </select>
              </div>
            </div>

            {/* Quick Question Badges */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Quick Prompts
              </label>
              <div className="flex flex-wrap gap-1.5">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMessage((prev) => (prev ? `${prev} ${q}` : q))}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                  >
                    + {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Message */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Message for Owner
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about lease duration, maintenance charges, or move-in dates..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Sending inquiry...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Get Owner Contact Details Instantly
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-slate-500 mt-2 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Zero Spam Assurance • Your phone is shared only with this verified owner
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};


