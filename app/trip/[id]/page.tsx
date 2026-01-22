'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Course {
  id: string;
  name: string;
  description: string;
  city: string;
  state: string;
  greenFee: number;
  cartFee: number;
  rating: number;
  holes: number;
  par: number;
  yardage: number;
  phone: string;
  email: string;
}

interface Trip {
  id: string;
  prompt: string;
  destination: string;
  groupSize: number;
  nights: number;
  tripType: string;
  courses: Course[];
  itinerary: Array<{ day: number; activities: string[] }>;
  createdAt: string;
}

export default function TripResultsPage() {
  const params = useParams();
  const tripId = params.id as string;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchTrip() {
      try {
        const res = await fetch(`/api/trips?id=${tripId}`);
        if (!res.ok) throw new Error('Trip not found');
        const data = await res.json();
        setTrip(data);
      } catch {
        setError('Trip not found. It may have expired.');
      } finally {
        setLoading(false);
      }
    }

    if (tripId) {
      fetchTrip();
    }
  }, [tripId]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-masters-green border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your trip...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trip Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/" className="text-masters-green hover:text-masters-green-dark font-medium">
            Plan a new trip
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-masters-green text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-masters-green-light text-sm mb-2">
                <span className="bg-masters-yellow text-masters-green-dark px-2 py-0.5 rounded-full text-xs font-medium">
                  {trip.tripType}
                </span>
                <span>{trip.groupSize} people</span>
                <span>•</span>
                <span>{trip.nights} days</span>
              </div>
              <h1 className="text-3xl font-bold">{trip.destination} Golf Trip</h1>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-masters-yellow hover:bg-masters-yellow-dark text-masters-green-dark px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {copied ? 'Link Copied!' : 'Share Trip'}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Itinerary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Your Itinerary</h2>
              <div className="space-y-6">
                {trip.itinerary.map((day) => (
                  <div key={day.day} className="relative pl-8 pb-6 border-l-2 border-masters-green last:border-l-0 last:pb-0">
                    <div className="absolute left-0 top-0 w-6 h-6 bg-masters-green rounded-full -translate-x-1/2 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{day.day}</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Day {day.day}</h3>
                      <ul className="space-y-2">
                        {day.activities.map((activity, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-600">
                            <svg className="w-5 h-5 text-masters-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Courses */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recommended Courses</h2>
              <div className="space-y-4">
                {trip.courses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:border-masters-green transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{course.name}</h3>
                        <p className="text-gray-500 text-sm">{course.city}, {course.state}</p>
                        <p className="text-gray-600 text-sm mt-2">{course.description}</p>
                        <div className="flex gap-4 mt-3 text-sm text-gray-500">
                          <span>{course.holes} holes</span>
                          <span>Par {course.par}</span>
                          <span>{course.yardage.toLocaleString()} yards</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-masters-yellow">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="font-semibold text-gray-900">{course.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Link
                        href={`/courses/${course.id}`}
                        className="text-sm text-masters-green hover:text-masters-green-dark font-medium"
                      >
                        View Details & Reviews
                      </Link>
                      <span className="text-gray-300">|</span>
                      <a
                        href={`mailto:${course.email}`}
                        className="text-sm text-masters-green hover:text-masters-green-dark font-medium"
                      >
                        Contact Course
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lodging Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Lodging</h3>
                  <p className="text-gray-600 text-sm">
                    For lodging, we recommend checking Airbnb or VRBO for group rentals near your courses.
                    Golf trip houses are often the best option for groups!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Share & Pricing Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Share This Trip</h2>
              <p className="text-gray-600 text-sm mb-4">
                Send this trip to your crew so everyone can see the plan!
              </p>
              <button
                onClick={handleShare}
                className="w-full bg-masters-green hover:bg-masters-green-dark text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 mb-6"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                {copied ? 'Link Copied!' : 'Copy Link'}
              </button>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-2">Pricing</h3>
                <p className="text-gray-500 text-sm">
                  Contact each course directly for current green fees and tee time availability.
                </p>
              </div>
            </div>

            {/* Trip Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Trip Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Destination</span>
                  <span className="text-gray-900">{trip.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Group Size</span>
                  <span className="text-gray-900">{trip.groupSize} people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span className="text-gray-900">{trip.nights} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Trip Type</span>
                  <span className="text-gray-900">{trip.tripType}</span>
                </div>
              </div>
            </div>

            {/* Plan Another */}
            <Link
              href="/"
              className="block text-center text-masters-green hover:text-masters-green-dark font-medium"
            >
              Plan Another Trip
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
