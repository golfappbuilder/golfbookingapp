'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [tripPrompt, setTripPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePlanTrip = async () => {
    if (!tripPrompt.trim()) {
      setError('Please describe your trip');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: tripPrompt }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to plan trip');
      }

      const trip = await res.json();
      router.push(`/trip/${trip.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setTripPrompt(example);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-masters-green text-white py-24 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="mb-6">
              <span className="font-pacifico text-6xl md:text-7xl text-masters-yellow drop-shadow-lg">
                Breakfast Ball
              </span>
              <span className="block text-2xl md:text-3xl font-semibold mt-4 text-white">
                Plan Your Perfect Golf Trip
              </span>
            </h1>
            <p className="text-xl text-masters-green-light mb-8">
              Plan epic golf trips with your crew. AI-powered itineraries, course
              reviews, and easy sharing - all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#plan-trip"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#plan-trip')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-masters-yellow hover:bg-masters-yellow-dark text-masters-green-dark px-8 py-4 rounded-lg font-semibold text-lg transition-colors text-center shadow-lg cursor-pointer"
              >
                Start Planning
              </a>
              <Link
                href="/my-trips"
                className="border-2 border-masters-yellow text-masters-yellow hover:bg-masters-yellow hover:text-masters-green-dark px-8 py-4 rounded-lg font-semibold text-lg transition-colors text-center"
              >
                My Trips
              </Link>
            </div>
          </div>
        </div>
        {/* Golf Ball decorative element */}
        <div className="absolute bottom-0 right-0 w-1/3 h-full opacity-10">
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <circle cx="50" cy="50" r="45" fill="white" />
          </svg>
        </div>
        {/* Subtle grass pattern at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-masters-green-dark to-transparent"></div>
      </section>

      {/* AI Trip Planner Section */}
      <section id="plan-trip" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
              Plan Your Trip
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Tell us about your golf trip and we&apos;ll create the perfect itinerary
            </p>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="relative">
                <textarea
                  value={tripPrompt}
                  onChange={(e) => {
                    setTripPrompt(e.target.value);
                    setError('');
                  }}
                  placeholder="8 guys, Cape Cod, 3 days, bachelor party..."
                  className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-masters-green focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
                />
                <button
                  onClick={handlePlanTrip}
                  disabled={loading}
                  className="absolute bottom-4 right-4 bg-masters-green hover:bg-masters-green-dark disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Planning...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Plan My Trip
                    </>
                  )}
                </button>
              </div>
              {error && (
                <p className="text-red-600 text-sm mt-2">{error}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs text-gray-500">Try:</span>
                <button
                  onClick={() => handleExampleClick('Bachelor party, Cape Cod, 8 guys, 3 days')}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                >
                  Bachelor party, Cape Cod, 8 guys, 3 days
                </button>
                <button
                  onClick={() => handleExampleClick('Father-son trip, Maine, 4 people, 2 rounds')}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                >
                  Father-son trip, Maine, 4 people, 2 rounds
                </button>
                <button
                  onClick={() => handleExampleClick('Corporate outing, Boston area, 16 people')}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                >
                  Corporate outing, Boston area, 16 people
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <StepCard
              number="1"
              title="Tell Us Your Trip"
              description="Group size, dates, region, budget"
            />
            <StepCard
              number="2"
              title="Get Your Itinerary"
              description="AI builds your day-by-day schedule"
            />
            <StepCard
              number="3"
              title="Share with Friends"
              description="Send one link to your group chat"
            />
            <StepCard
              number="4"
              title="Book & Review"
              description="Use our links to book, then review after your trip"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-masters-green text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Trip?</h2>
          <p className="text-xl text-masters-green-light mb-8">
            Join thousands of golfers planning epic trips with their crew.
          </p>
          <button
            onClick={() => {
              document.querySelector('#plan-trip')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-block bg-masters-yellow hover:bg-masters-yellow-dark text-masters-green-dark px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg cursor-pointer"
          >
            Start Planning
          </button>
        </div>
      </section>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-masters-yellow text-masters-green-dark rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-md">
        {number}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
