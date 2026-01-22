'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Lodging {
  id: string;
  lodgingName: string;
  city: string;
  state: string;
  region: string;
  lodgingType: string;
  sleeps: number;
  linkUrl: string;
  tips: string;
  recommend: boolean;
  createdAt: string;
}

const regions = ['all', 'Cape Cod', 'Boston Area', 'South Shore', 'Maine', 'New Hampshire', 'Vermont'];
const groupSizes = ['all', '4-8', '8-12', '12+'];
const types = ['all', 'airbnb', 'vrbo', 'hotel', 'house_rental', 'other'];

const typeLabels: Record<string, string> = {
  airbnb: 'Airbnb',
  vrbo: 'VRBO',
  hotel: 'Hotel',
  house_rental: 'House Rental',
  other: 'Other',
};

export default function WhereToStayPage() {
  const [lodgings, setLodgings] = useState<Lodging[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    region: 'all',
    groupSize: 'all',
    type: 'all',
  });

  useEffect(() => {
    async function fetchLodgings() {
      try {
        const params = new URLSearchParams();
        if (filters.region !== 'all') params.set('region', filters.region);
        if (filters.groupSize !== 'all') params.set('groupSize', filters.groupSize);
        if (filters.type !== 'all') params.set('type', filters.type);
        params.set('recommended', 'true');

        const res = await fetch(`/api/lodging-submissions?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setLodgings(data);
        }
      } catch (error) {
        console.error('Failed to fetch lodgings:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLodgings();
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-masters-green to-masters-green-dark text-white py-12">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center text-masters-yellow hover:text-white mb-4 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <h1 className="text-4xl font-bold mb-2">Where to Stay</h1>
          <p className="text-masters-green-light text-lg">
            Lodging recommendations from real golfers
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-wrap gap-4">
            {/* Region Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
              <select
                value={filters.region}
                onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-masters-green focus:border-transparent"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region === 'all' ? 'All Regions' : region}
                  </option>
                ))}
              </select>
            </div>

            {/* Group Size Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Group Size</label>
              <select
                value={filters.groupSize}
                onChange={(e) => setFilters({ ...filters, groupSize: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-masters-green focus:border-transparent"
              >
                {groupSizes.map((size) => (
                  <option key={size} value={size}>
                    {size === 'all' ? 'Any Size' : `${size} people`}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-masters-green focus:border-transparent"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : typeLabels[type] || type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-masters-green border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading lodging options...</p>
          </div>
        ) : lodgings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Lodging Found</h2>
            <p className="text-gray-600 mb-6">
              We don&apos;t have any lodging recommendations matching your filters yet.
            </p>
            <Link
              href="/share-stay"
              className="inline-flex items-center gap-2 bg-masters-green hover:bg-masters-green-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Share a Place You&apos;ve Stayed
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lodgings.map((lodging) => (
              <div key={lodging.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Badge */}
                  {lodging.recommend && (
                    <div className="flex items-center gap-1 text-masters-green text-xs font-medium mb-3">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Recommended by golfers
                    </div>
                  )}

                  {/* Name & Location */}
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{lodging.lodgingName}</h3>
                  <p className="text-gray-500 text-sm mb-3">
                    {lodging.city}, {lodging.state} • {lodging.region}
                  </p>

                  {/* Type & Sleeps */}
                  <div className="flex gap-2 mb-4">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                      {typeLabels[lodging.lodgingType] || lodging.lodgingType}
                    </span>
                    <span className="bg-masters-green/10 text-masters-green px-2 py-1 rounded text-xs font-medium">
                      Sleeps {lodging.sleeps}
                    </span>
                  </div>

                  {/* Tips */}
                  {lodging.tips && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      &ldquo;{lodging.tips}&rdquo;
                    </p>
                  )}

                  {/* View Listing Button */}
                  {lodging.linkUrl ? (
                    <a
                      href={lodging.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-masters-yellow hover:bg-masters-yellow-dark text-masters-green-dark py-2 px-4 rounded-lg font-semibold text-sm transition-colors"
                    >
                      View Listing
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <div className="text-gray-400 text-sm text-center py-2">
                      No listing link provided
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA to share */}
        <div className="mt-12 bg-gradient-to-r from-masters-green to-masters-green-dark rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Know a Great Place to Stay?</h2>
          <p className="text-masters-green-light mb-6">
            Help other golfers by sharing your lodging recommendations.
          </p>
          <Link
            href="/share-stay"
            className="inline-flex items-center gap-2 bg-masters-yellow hover:bg-masters-yellow-dark text-masters-green-dark px-6 py-3 rounded-lg font-bold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Share Your Stay
          </Link>
        </div>
      </div>
    </div>
  );
}
