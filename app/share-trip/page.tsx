'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockCourses } from '@/lib/mock-data';

export default function ShareTripPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    destination: '',
    tripDate: '',
    groupSize: '',
    overallRating: 0,
    wouldBookAgain: '',
    whatWorked: '',
    whatDidntWork: '',
    suggestedCourses: '',
    coursesPlayed: [] as string[],
    lodgingUsed: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/trip-reviews', {
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
      coursesPlayed: prev.coursesPlayed.includes(courseId)
        ? prev.coursesPlayed.filter(id => id !== courseId)
        : [...prev.coursesPlayed, courseId],
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-masters-green to-masters-green-dark flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Confetti effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/4 w-2 h-2 bg-masters-yellow rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-masters-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="absolute top-0 left-3/4 w-2 h-2 bg-masters-yellow rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>

          <div className="w-20 h-20 bg-masters-yellow rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-10 h-10 text-masters-green-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">You&apos;re Entered!</h1>
          <div className="bg-masters-yellow/20 rounded-xl p-4 mb-6">
            <p className="text-xl font-bold text-masters-green-dark mb-1">
              Win a $3,000 Golf Trip!
            </p>
            <p className="text-gray-600 text-sm">
              Winners selected quarterly. The more detail you shared, the better your chances!
            </p>
          </div>

          <p className="text-gray-600 mb-6">
            Thanks for sharing your trip! Your insights help other golfers plan better trips.
          </p>

          <div className="space-y-3">
            <Link
              href="/share-stay"
              className="block w-full bg-masters-green hover:bg-masters-green-dark text-white py-3 rounded-xl font-semibold transition-colors"
            >
              Share a Lodging Recommendation
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
          <h1 className="text-4xl font-bold mb-2">Share Your Golf Trip</h1>
          <p className="text-masters-green-light text-lg mb-4">
            Tell us about your trip and help other golfers
          </p>

          {/* Giveaway Banner */}
          <div className="bg-masters-yellow/20 backdrop-blur-sm rounded-xl p-4 inline-block">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-masters-yellow rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-masters-green-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-masters-yellow">Win a $3,000 Golf Trip!</p>
                <p className="text-white/80 text-sm">Every submission is an entry. Winners selected quarterly.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email - Required for giveaway */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Email <span className="text-red-500">*</span>
                  <span className="font-normal text-gray-500"> (required for giveaway entry)</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-masters-green focus:border-transparent"
                />
              </div>

              {/* Destination */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Where did you go? <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="e.g., Cape Cod, Maine Coast"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-masters-green focus:border-transparent"
                />
              </div>

              {/* Trip Date & Group Size */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">When?</label>
                  <input
                    type="month"
                    value={formData.tripDate}
                    onChange={(e) => setFormData({ ...formData, tripDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-masters-green focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Group Size</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.groupSize}
                    onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
                    placeholder="e.g., 8"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-masters-green focus:border-transparent"
                  />
                </div>
              </div>

              {/* Overall Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  How would you rate this trip overall? <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, overallRating: star })}
                      className={`w-12 h-12 rounded-xl transition-all ${
                        star <= formData.overallRating
                          ? 'bg-masters-yellow text-masters-green-dark scale-110'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* Would Book Again */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Would you book this trip again?
                </label>
                <div className="flex gap-4">
                  {['yes', 'no'].map((option) => (
                    <label
                      key={option}
                      className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${
                        formData.wouldBookAgain === option
                          ? 'bg-masters-green/10 border-masters-green text-masters-green-dark'
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="wouldBookAgain"
                        value={option}
                        checked={formData.wouldBookAgain === option}
                        onChange={(e) => setFormData({ ...formData, wouldBookAgain: e.target.value })}
                        className="sr-only"
                      />
                      <span className="font-semibold capitalize">{option === 'yes' ? 'Yes!' : 'No'}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Courses Played */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Which courses did you play?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {mockCourses.map((course) => (
                    <label
                      key={course.id}
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.coursesPlayed.includes(course.id)
                          ? 'bg-masters-green/10 border-masters-green'
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.coursesPlayed.includes(course.id)}
                        onChange={() => handleCourseToggle(course.id)}
                        className="w-4 h-4 text-masters-green focus:ring-masters-green rounded"
                      />
                      <span className="text-sm">{course.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* What Worked */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  What worked well?
                </label>
                <textarea
                  value={formData.whatWorked}
                  onChange={(e) => setFormData({ ...formData, whatWorked: e.target.value })}
                  rows={3}
                  placeholder="e.g., Great courses, the house was perfect for our group..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-masters-green focus:border-transparent"
                />
              </div>

              {/* What Didn't Work */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  What didn&apos;t work?
                </label>
                <textarea
                  value={formData.whatDidntWork}
                  onChange={(e) => setFormData({ ...formData, whatDidntWork: e.target.value })}
                  rows={3}
                  placeholder="e.g., One course was too far, traffic on Friday..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-masters-green focus:border-transparent"
                />
              </div>

              {/* Lodging Used */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Where did you stay?
                </label>
                <input
                  type="text"
                  value={formData.lodgingUsed}
                  onChange={(e) => setFormData({ ...formData, lodgingUsed: e.target.value })}
                  placeholder="e.g., Airbnb in Brewster, Ocean Edge Resort"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-masters-green focus:border-transparent"
                />
              </div>

              {/* Suggested Courses */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Any courses we should add to Breakfast Ball?
                </label>
                <textarea
                  value={formData.suggestedCourses}
                  onChange={(e) => setFormData({ ...formData, suggestedCourses: e.target.value })}
                  rows={2}
                  placeholder="e.g., Highland Links in Truro was amazing, you should add it!"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-masters-green focus:border-transparent"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-masters-green to-masters-green-dark hover:from-masters-green-dark hover:to-masters-green disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                    Submit & Enter to Win $3K
                  </>
                )}
              </button>

              <p className="text-center text-gray-500 text-sm">
                Winners selected quarterly. The more detail you share, the better your chances!
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
