'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockCourses } from '@/lib/mock-data';

const regions = [
  'Cape Cod',
  'Boston Area',
  'South Shore',
  'Maine',
  'New Hampshire',
  'Vermont',
  'Other',
];

export default function ShareStayPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    lodgingName: '',
    city: '',
    state: '',
    region: '',
    lodgingType: '',
    sleeps: '',
    linkUrl: '',
    recommend: true,
    tips: '',
    nearbyCourses: [] as string[],
    canFeature: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/lodging-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseToggle = (courseId: string) => {
    setFormData(prev => ({
      ...prev,
      nearbyCourses: prev.nearbyCourses.includes(courseId)
        ? prev.nearbyCourses.filter(id => id !== courseId)
        : [...prev.nearbyCourses, courseId],
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-masters-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-masters-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Thanks for Sharing!</h1>
          <p className="text-gray-600 mb-6">
            Your lodging recommendation will help other golfers plan their perfect trip.
          </p>
          <div className="space-y-3">
            <Link
              href="/share-trip"
              className="block w-full bg-masters-yellow hover:bg-masters-yellow-dark text-masters-green-dark py-3 rounded-xl font-semibold transition-colors"
            >
              Share a Trip Review (Win $3K!)
            </Link>
            <Link
              href="/"
              className="block w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-4xl font-bold mb-2">Share Your Stay</h1>
          <p className="text-masters-green-light text-lg">
            Help fellow golfers find great places to stay
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-masters-green focus:border-transparent"
                />
                <p className="text-gray-500 text-xs mt-1">In case we need to follow up</p>
              </div>

              {/* Lodging Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lodging Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.lodgingName}
                  onChange={(e) => setFormData({ ...formData, lodgingName: e.target.value })}
                  placeholder="e.g., Beach House on Main St"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-masters-green focus:border-transparent"
                />
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g., Brewster"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-masters-green focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-masters-green focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    <option value="MA">Massachusetts</option>
                    <option value="ME">Maine</option>
                    <option value="NH">New Hampshire</option>
                    <option value="VT">Vermont</option>
                    <option value="RI">Rhode Island</option>
                    <option value="CT">Connecticut</option>
                  </select>
                </div>
              </div>

              {/* Region */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Region <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-masters-green focus:border-transparent"
                >
                  <option value="">Select region...</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              {/* Type & Sleeps */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.lodgingType}
                    onChange={(e) => setFormData({ ...formData, lodgingType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-masters-green focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    <option value="airbnb">Airbnb</option>
                    <option value="vrbo">VRBO</option>
                    <option value="hotel">Hotel</option>
                    <option value="house_rental">House Rental</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sleeps <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="50"
                    value={formData.sleeps}
                    onChange={(e) => setFormData({ ...formData, sleeps: e.target.value })}
                    placeholder="e.g., 8"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-masters-green focus:border-transparent"
                  />
                </div>
              </div>

              {/* Link URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Listing Link
                </label>
                <input
                  type="url"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                  placeholder="Paste Airbnb, VRBO, or hotel website URL"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-masters-green focus:border-transparent"
                />
                <p className="text-gray-500 text-xs mt-1">Optional - helps other golfers find the same spot</p>
              </div>

              {/* Recommend */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Would you recommend for a golf trip?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="recommend"
                      checked={formData.recommend === true}
                      onChange={() => setFormData({ ...formData, recommend: true })}
                      className="w-4 h-4 text-masters-green focus:ring-masters-green"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="recommend"
                      checked={formData.recommend === false}
                      onChange={() => setFormData({ ...formData, recommend: false })}
                      className="w-4 h-4 text-masters-green focus:ring-masters-green"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {/* Nearby Courses */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Which courses did you play nearby?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {mockCourses.map((course) => (
                    <label
                      key={course.id}
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.nearbyCourses.includes(course.id)
                          ? 'bg-masters-green/10 border-masters-green'
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.nearbyCourses.includes(course.id)}
                        onChange={() => handleCourseToggle(course.id)}
                        className="w-4 h-4 text-masters-green focus:ring-masters-green rounded"
                      />
                      <span className="text-sm">{course.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tips or Notes for Other Golfers
                </label>
                <textarea
                  value={formData.tips}
                  onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
                  rows={4}
                  placeholder="e.g., Great for groups, 5 min from the course, has a putting green in the backyard..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-masters-green focus:border-transparent"
                />
              </div>

              {/* Can Feature */}
              <div className="bg-masters-green/5 border border-masters-green/20 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.canFeature}
                    onChange={(e) => setFormData({ ...formData, canFeature: e.target.checked })}
                    className="w-5 h-5 text-masters-green focus:ring-masters-green rounded mt-0.5"
                  />
                  <div>
                    <span className="font-semibold text-gray-900">Can we feature this on Breakfast Ball?</span>
                    <p className="text-gray-500 text-sm mt-1">
                      If checked, your lodging recommendation may be shown to other golfers planning trips.
                      Your email will never be shared.
                    </p>
                  </div>
                </label>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-masters-green hover:bg-masters-green-dark disabled:bg-gray-400 text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Share This Stay
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
