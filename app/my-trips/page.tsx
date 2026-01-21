'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format, parseISO, isPast } from 'date-fns';

interface Booking {
  id: string;
  courseId: string;
  email: string;
  date: string;
  teeTime: string;
  numberOfPlayers: number;
  playerNames: string;
  includeCart: boolean;
  totalPrice: number;
  status: string;
  confirmationNumber: string;
  course?: {
    name: string;
    city: string;
    state: string;
  };
}

export default function MyTripsPage() {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/bookings?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setBookings(data);
      setSearched(true);
    } catch {
      setError('Failed to fetch trips. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const upcomingBookings = bookings.filter(
    (b) => b.status !== 'cancelled' && !isPast(parseISO(b.date))
  );
  const pastBookings = bookings.filter(
    (b) => b.status === 'cancelled' || isPast(parseISO(b.date))
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-masters-green text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">My Trips</h1>
          <p className="text-masters-green-light text-lg">
            Enter your email to view your saved trip itineraries
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Email Search Form */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <form onSubmit={handleSearch} className="flex gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-masters-green focus:border-transparent"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-masters-yellow hover:bg-masters-yellow-dark text-masters-green-dark px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Find My Trips'}
              </button>
            </form>
            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
          </div>

          {/* Results */}
          {searched && (
            <>
              {bookings.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <svg
                    className="w-16 h-16 text-gray-300 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-500 mb-4">
                    No trips found for this email address
                  </p>
                  <Link
                    href="/"
                    className="inline-block text-masters-green hover:text-masters-green-dark font-medium"
                  >
                    Plan your first golf trip
                  </Link>
                </div>
              ) : (
                <>
                  {/* Upcoming Trips */}
                  {upcomingBookings.length > 0 && (
                    <section className="mb-8">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Upcoming Trips ({upcomingBookings.length})
                      </h2>
                      <div className="space-y-4">
                        {upcomingBookings.map((booking) => (
                          <BookingCard key={booking.id} booking={booking} />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Past Trips */}
                  {pastBookings.length > 0 && (
                    <section>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Past Trips ({pastBookings.length})
                      </h2>
                      <div className="space-y-4 opacity-75">
                        {pastBookings.map((booking) => (
                          <BookingCard key={booking.id} booking={booking} isPast />
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}
            </>
          )}

          {!searched && (
            <div className="text-center text-gray-500 py-8">
              <p>Enter your email above to view your trips</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BookingCard({ booking, isPast }: { booking: Booking; isPast?: boolean }) {
  const course = booking.course;
  const playerNames = JSON.parse(booking.playerNames || '[]');

  const statusColors: Record<string, string> = {
    confirmed: 'bg-masters-green/10 text-masters-green',
    pending: 'bg-masters-yellow/20 text-masters-yellow-dark',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {course?.name || 'Unknown Course'}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusColors[booking.status] || 'bg-gray-100'
                }`}
              >
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {format(parseISO(booking.date), 'EEEE, MMMM d, yyyy')}
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {booking.teeTime}
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {booking.numberOfPlayers} Player{booking.numberOfPlayers > 1 ? 's' : ''}
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                {booking.confirmationNumber}
              </div>
            </div>

            {playerNames.length > 0 && (
              <div className="text-sm text-gray-500">
                <span className="font-medium">Players:</span>{' '}
                {playerNames.join(', ')}
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="text-2xl font-bold text-masters-green">
              ${booking.totalPrice.toFixed(2)}
            </div>
            {booking.includeCart && (
              <span className="text-xs text-gray-500">Includes cart</span>
            )}
            {isPast && booking.status !== 'cancelled' && booking.course && (
              <Link
                href={`/courses/${booking.courseId}`}
                className="text-masters-green hover:text-masters-green-dark text-sm font-medium mt-2"
              >
                Leave a Review
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
