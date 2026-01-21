'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import type { Booking } from '@/types';
import { format, parseISO, isPast } from 'date-fns';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/dashboard');
      return;
    }

    async function fetchBookings() {
      if (!user) return;

      try {
        const res = await fetch(`/api/bookings?userId=${user.id}`);
        const data = await res.json();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [user, isAuthenticated, router]);

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    setCancellingId(bookingId);

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setBookings(
          bookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'cancelled' } : b
          )
        );
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
    } finally {
      setCancellingId(null);
    }
  };

  const upcomingBookings = bookings.filter(
    (b) => b.status !== 'cancelled' && !isPast(parseISO(b.date))
  );
  const pastBookings = bookings.filter(
    (b) => b.status === 'cancelled' || isPast(parseISO(b.date))
  );

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-masters-green border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-gray-500 mt-1">
                Welcome back, {user?.firstName}!
              </p>
            </div>
            <Link
              href="/courses"
              className="bg-masters-yellow hover:bg-masters-yellow-dark text-masters-green-dark px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Book New Tee Time
            </Link>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="bg-masters-green/10 border border-masters-green/20 text-masters-green px-6 py-4 rounded-lg mb-6 flex items-center">
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Your booking has been confirmed! Check your email for details.
            </div>
          )}

          {/* Upcoming Bookings */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Upcoming Bookings ({upcomingBookings.length})
            </h2>

            {upcomingBookings.length === 0 ? (
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
                  You don&apos;t have any upcoming bookings
                </p>
                <Link
                  href="/courses"
                  className="inline-block text-masters-green hover:text-masters-green-dark font-medium"
                >
                  Browse courses and book a tee time
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCancel={handleCancel}
                    cancelling={cancellingId === booking.id}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Past Bookings */}
          {pastBookings.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Past & Cancelled ({pastBookings.length})
              </h2>
              <div className="space-y-4 opacity-75">
                {pastBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    isPast
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function BookingCard({
  booking,
  onCancel,
  cancelling,
  isPast,
}: {
  booking: Booking;
  onCancel?: (id: string) => void;
  cancelling?: boolean;
  isPast?: boolean;
}) {
  const course = booking.course;
  const playerNames = JSON.parse(booking.playerNames || '[]');

  const statusColors: Record<string, string> = {
    confirmed: 'bg-masters-green/10 text-masters-green',
    pending: 'bg-masters-yellow/20 text-masters-yellow-dark',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-gray-100 text-gray-800',
    'no-show': 'bg-red-100 text-red-800',
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
                {booking.numberOfPlayers} Player
                {booking.numberOfPlayers > 1 ? 's' : ''}
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
            {!isPast && booking.status !== 'cancelled' && onCancel && (
              <button
                onClick={() => onCancel(booking.id)}
                disabled={cancelling}
                className="text-red-600 hover:text-red-700 text-sm font-medium mt-2"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Booking'}
              </button>
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

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-masters-green border-t-transparent"></div>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
