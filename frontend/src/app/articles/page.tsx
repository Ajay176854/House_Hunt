'use client';

import React from 'react';
import { Calendar, User, ArrowRight, BookOpen, TrendingUp, Sparkles } from 'lucide-react';

const ARTICLES = [
  {
    id: 1,
    category: 'Market Trends',
    title: 'Real Estate Outlook 2026: What Buyers Need to Know',
    excerpt: 'An in-depth analysis of property prices, emerging neighborhoods, and why this year might be the best time to invest in metropolitan areas.',
    author: 'Priya Sharma',
    date: 'Oct 15, 2026',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800&h=500',
    readTime: '5 min read'
  },
  {
    id: 2,
    category: 'Home Buying Guide',
    title: 'First-Time Homebuyer? Here is Your Ultimate Checklist',
    excerpt: 'From securing a pre-approved loan to identifying red flags during property visits, here is everything you need to know before making a deposit.',
    author: 'Rahul Verma',
    date: 'Oct 12, 2026',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800&h=500',
    readTime: '8 min read'
  },
  {
    id: 3,
    category: 'Investment',
    title: 'Top 5 Suburbs Experiencing Rapid Infrastructure Growth',
    excerpt: 'Looking for high ROI? These five suburban locations are currently seeing massive government infrastructure investments that will drive up property values.',
    author: 'Amit Patel',
    date: 'Oct 09, 2026',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800&h=500',
    readTime: '6 min read'
  },
  {
    id: 4,
    category: 'Legal',
    title: 'Understanding Your Rental Agreement: Clauses to Watch Out For',
    excerpt: 'A comprehensive guide on lock-in periods, maintenance charges, and eviction clauses to ensure you are protected as a tenant.',
    author: 'Sneha Gupta',
    date: 'Oct 05, 2026',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66cb85?auto=format&fit=crop&q=80&w=800&h=500',
    readTime: '4 min read'
  },
  {
    id: 5,
    category: 'Interior Design',
    title: 'Maximize Your Space: Smart Storage Ideas for Small Apartments',
    excerpt: 'Discover clever interior design hacks to make your 1BHK or studio apartment feel incredibly spacious and organized.',
    author: 'Karan Singh',
    date: 'Oct 01, 2026',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800&h=500',
    readTime: '3 min read'
  },
  {
    id: 6,
    category: 'Market Trends',
    title: 'Why Co-Living Spaces Are the New Normal for Millennials',
    excerpt: 'The rise of fully-furnished, managed co-living spaces and how they are disrupting the traditional rental market.',
    author: 'Priya Sharma',
    date: 'Sep 28, 2026',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800&h=500',
    readTime: '5 min read'
  }
];

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
            <BookOpen className="w-4 h-4" />
            HouseHunt Insights
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
            Articles & Market News
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Stay updated with the latest real estate trends, expert property buying guides, and crucial market insights.
          </p>
        </div>

        {/* Featured Article (First one) */}
        <div className="mb-12 cursor-pointer group rounded-3xl overflow-hidden bg-white shadow-sm border border-slate-200 grid grid-cols-1 lg:grid-cols-2 hover:shadow-xl transition-all duration-500">
          <div className="relative overflow-hidden h-64 lg:h-auto">
            <img 
              src={ARTICLES[0].image} 
              alt={ARTICLES[0].title} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                {ARTICLES[0].category}
              </span>
            </div>
          </div>
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-4 uppercase tracking-wider">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {ARTICLES[0].date}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="text-rose-500">{ARTICLES[0].readTime}</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-slate-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors">
              {ARTICLES[0].title}
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed text-lg">
              {ARTICLES[0].excerpt}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{ARTICLES[0].author}</div>
                  <div className="text-xs text-slate-500">Senior Editor</div>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ARTICLES.slice(1).map((article) => (
            <div key={article.id} className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 flex flex-col">
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 mb-3">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {article.date}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-slate-600 text-sm mb-6 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                      <User className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{article.author}</span>
                  </div>
                  <span className="text-xs font-bold text-rose-500 flex items-center gap-1">
                    Read <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Newsletter / Stay Updated */}
        <div className="mt-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 text-slate-700/30">
            <TrendingUp className="w-64 h-64" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-500/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-black mb-4">Never Miss an Update</h3>
            <p className="text-slate-300 mb-8 text-lg">
              Get the latest real estate market analysis, guides, and investment opportunities delivered straight to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 px-5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                required
              />
              <button type="submit" className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-colors whitespace-nowrap cursor-pointer">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
