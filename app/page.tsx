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
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[600px] bg-gradient-to-br from-masters-green via-masters-green to-masters-green-dark text-white py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-32 h-32 opacity-10 animate-pulse">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="white" />
            <circle cx="35" cy="35" r="3" fill="#006747" />
            <circle cx="50" cy="30" r="3" fill="#006747" />
            <circle cx="65" cy="35" r="3" fill="#006747" />
            <circle cx="40" cy="50" r="3" fill="#006747" />
            <circle cx="60" cy="50" r="3" fill="#006747" />
            <circle cx="50" cy="65" r="3" fill="#006747" />
          </svg>
        </div>
        <div className="absolute bottom-40 right-1/4 w-20 h-20 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="white" />
          </svg>
        </div>

        {/* Flag Pin Decoration */}
        <div className="absolute top-1/4 right-20 opacity-20 hidden lg:block">
          <svg width="80" height="120" viewBox="0 0 80 120" fill="none">
            <path d="M40 0V120" stroke="white" strokeWidth="3"/>
            <path d="M40 10L75 30L40 50V10Z" fill="#FFC72C"/>
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="mb-8">
              <h1 className="font-pacifico text-7xl md:text-8xl lg:text-9xl text-masters-yellow drop-shadow-2xl mb-4 transform hover:scale-105 transition-transform duration-300">
                Breakfast Ball
              </h1>
              <p className="text-2xl md:text-3xl font-light text-white/90 max-w-2xl">
                Plan epic golf trips with your crew.
                <span className="text-masters-yellow font-medium"> No mulligans needed.</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <a
                href="#plan-trip"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#plan-trip')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group bg-masters-yellow hover:bg-masters-yellow-dark text-masters-green-dark px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 text-center shadow-2xl hover:shadow-masters-yellow/30 hover:-translate-y-1 cursor-pointer flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Start Planning
              </a>
              <Link
                href="/my-trips"
                className="border-3 border-masters-yellow/80 text-masters-yellow hover:bg-masters-yellow hover:text-masters-green-dark px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 text-center hover:-translate-y-1"
                style={{ borderWidth: '3px' }}
              >
                My Trips
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* AI Trip Planner Section */}
      <section id="plan-trip" className="py-20 bg-gray-50 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block bg-masters-green/10 text-masters-green px-4 py-2 rounded-full text-sm font-semibold mb-4">
                AI-POWERED PLANNING
              </span>
              <h2 className="font-pacifico text-5xl md:text-6xl text-masters-green mb-4">
                Plan Your Trip
              </h2>
              <p className="text-xl text-gray-600">
                Tell us the vibe and we&apos;ll handle the rest
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100 transform hover:shadow-3xl transition-shadow duration-300">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-masters-yellow rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-masters-green-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <textarea
                  value={tripPrompt}
                  onChange={(e) => {
                    setTripPrompt(e.target.value);
                    setError('');
                  }}
                  placeholder="8 guys, Cape Cod, 3 days, bachelor party... let's go!"
                  className="w-full h-40 px-6 py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-masters-green/20 focus:border-masters-green resize-none text-gray-900 placeholder-gray-400 text-lg transition-all duration-200"
                />
                <button
                  onClick={handlePlanTrip}
                  disabled={loading}
                  className="absolute bottom-5 right-5 bg-gradient-to-r from-masters-green to-masters-green-dark hover:from-masters-green-dark hover:to-masters-green disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
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
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </p>
                </div>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="text-sm text-gray-500 font-medium">Try these:</span>
                <button
                  onClick={() => handleExampleClick('Bachelor party, Cape Cod, 8 guys, 3 days')}
                  className="text-sm bg-gradient-to-r from-gray-100 to-gray-50 hover:from-masters-yellow/20 hover:to-masters-yellow/10 text-gray-700 hover:text-masters-green-dark px-4 py-2 rounded-full transition-all duration-200 border border-gray-200 hover:border-masters-yellow/50 font-medium"
                >
                  🎉 Bachelor party, Cape Cod
                </button>
                <button
                  onClick={() => handleExampleClick('Father-son trip, Maine, 4 people, 2 rounds')}
                  className="text-sm bg-gradient-to-r from-gray-100 to-gray-50 hover:from-masters-yellow/20 hover:to-masters-yellow/10 text-gray-700 hover:text-masters-green-dark px-4 py-2 rounded-full transition-all duration-200 border border-gray-200 hover:border-masters-yellow/50 font-medium"
                >
                  👨‍👦 Father-son trip, Maine
                </button>
                <button
                  onClick={() => handleExampleClick('Corporate outing, Boston area, 16 people')}
                  className="text-sm bg-gradient-to-r from-gray-100 to-gray-50 hover:from-masters-yellow/20 hover:to-masters-yellow/10 text-gray-700 hover:text-masters-green-dark px-4 py-2 rounded-full transition-all duration-200 border border-gray-200 hover:border-masters-yellow/50 font-medium"
                >
                  💼 Corporate outing, Boston
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-masters-green/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-masters-yellow/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block bg-masters-yellow/20 text-masters-green-dark px-4 py-2 rounded-full text-sm font-semibold mb-4">
              SIMPLE AS A TAP-IN
            </span>
            <h2 className="font-pacifico text-5xl md:text-6xl text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From group chat to first tee in four easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <StepCard
              number="1"
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
              title="Tell Us Your Vibe"
              description="Group size, destination, dates - just the basics"
            />
            <StepCard
              number="2"
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              }
              title="AI Builds Your Trip"
              description="Courses, lodging, day-by-day itinerary - done"
            />
            <StepCard
              number="3"
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              }
              title="Share One Link"
              description="Drop it in the group chat, everyone's in"
            />
            <StepCard
              number="4"
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Make Memories"
              description="Book, play, and come back for the next one"
            />
          </div>
        </div>
      </section>

      {/* Social Proof / Stats Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div className="p-6">
              <div className="text-5xl font-bold text-masters-yellow mb-2">500+</div>
              <div className="text-gray-400 font-medium">Trips Planned</div>
            </div>
            <div className="p-6 border-x border-gray-700">
              <div className="text-5xl font-bold text-masters-yellow mb-2">2,000+</div>
              <div className="text-gray-400 font-medium">Rounds Booked</div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-masters-yellow mb-2">4.9★</div>
              <div className="text-gray-400 font-medium">Trip Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-masters-green via-masters-green to-masters-green-dark" />

        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Floating Golf Balls */}
        <div className="absolute top-10 left-10 w-16 h-16 opacity-20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
          <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="white"/></svg>
        </div>
        <div className="absolute bottom-20 right-20 w-12 h-12 opacity-20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
          <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="white"/></svg>
        </div>
        <div className="absolute top-1/2 right-1/4 w-8 h-8 opacity-10 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}>
          <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="white"/></svg>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="font-pacifico text-5xl md:text-7xl text-masters-yellow mb-6 drop-shadow-lg">
            Ready to Tee Off?
          </h2>
          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto">
            Your crew is waiting. Plan the trip they&apos;ll talk about for years.
          </p>
          <button
            onClick={() => {
              document.querySelector('#plan-trip')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group inline-flex items-center gap-3 bg-masters-yellow hover:bg-white text-masters-green-dark px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:-translate-y-1 cursor-pointer"
          >
            <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Start Planning Now
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
}

function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative">
      {/* Connector Line */}
      {number !== '4' && (
        <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-masters-green/30 to-transparent z-0" />
      )}

      <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-masters-green/20 group-hover:-translate-y-2 z-10">
        {/* Number Badge */}
        <div className="absolute -top-4 -right-4 w-10 h-10 bg-masters-yellow rounded-full flex items-center justify-center text-masters-green-dark font-bold shadow-lg">
          {number}
        </div>

        {/* Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-masters-green to-masters-green-dark rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>

        <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
