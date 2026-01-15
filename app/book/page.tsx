'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import type { Course, TeeTime } from '@/types';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isBefore, startOfToday } from 'date-fns';

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const courseId = searchParams.get('courseId');

  const [course, setCourse] = useState<Course | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(addDays(new Date(), 1));
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [teeTimes, setTeeTimes] = useState<TeeTime[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);
  const [includeCart, setIncludeCart] = useState(false);
  const [playerNames, setPlayerNames] = useState<string[]>(['']);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!courseId) {
      router.push('/courses');
      return;
    }

    async function fetchCourse() {
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        if (!res.ok) throw new Error('Course not found');
        const data = await res.json();
        setCourse(data);
      } catch {
        router.push('/courses');
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [courseId, router]);

  useEffect(() => {
    if (!courseId || !selectedDate) return;

    async function fetchTeeTimes() {
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const res = await fetch(`/api/courses/${courseId}/tee-times?date=${dateStr}`);
        const data = await res.json();
        setTeeTimes(data);
        setSelectedTime(null);
      } catch (error) {
        console.error('Error fetching tee times:', error);
      }
    }

    fetchTeeTimes();
  }, [courseId, selectedDate]);

  useEffect(() => {
    setPlayerNames(Array(numberOfPlayers).fill(''));
  }, [numberOfPlayers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      router.push(`/login?redirect=/book?courseId=${courseId}`);
      return;
    }

    if (!selectedTime || !course || !user) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          userId: user.id,
          date: format(selectedDate, 'yyyy-MM-dd'),
          teeTime: selectedTime,
          numberOfPlayers,
          playerNames: playerNames.filter((n) => n.trim()),
          includeCart,
          notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create booking');
      }

      router.push('/dashboard?success=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const totalPrice = course
    ? course.greenFee * numberOfPlayers +
      (includeCart ? course.cartFee * Math.ceil(numberOfPlayers / 2) : 0)
    : 0;

  // Calendar functions
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const today = startOfToday();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-golf-green-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Course Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Book a Tee Time at {course.name}
            </h1>
            <p className="text-gray-500">
              {course.city}, {course.state} | {course.holes} Holes | Par{' '}
              {course.par}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Calendar & Time */}
            <div className="lg:col-span-2 space-y-6">
              {/* Calendar */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Select Date</h2>

                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() =>
                      setCurrentMonth(addDays(startOfMonth(currentMonth), -1))
                    }
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <span className="text-lg font-medium">
                    {format(currentMonth, 'MMMM yyyy')}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentMonth(addDays(endOfMonth(currentMonth), 1))
                    }
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                    (day) => (
                      <div key={day} className="py-2 font-medium text-gray-500">
                        {day}
                      </div>
                    )
                  )}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array(new Date(days[0]).getDay())
                    .fill(null)
                    .map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                  {days.map((day) => {
                    const isSelected =
                      format(day, 'yyyy-MM-dd') ===
                      format(selectedDate, 'yyyy-MM-dd');
                    const isPast = isBefore(day, today);
                    const isCurrentMonth = isSameMonth(day, currentMonth);

                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => !isPast && setSelectedDate(day)}
                        disabled={isPast}
                        className={`
                          p-3 rounded-lg text-sm font-medium transition-colors
                          ${!isCurrentMonth ? 'text-gray-300' : ''}
                          ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-golf-green-50'}
                          ${isSelected ? 'bg-golf-green-600 text-white hover:bg-golf-green-700' : ''}
                          ${isToday(day) && !isSelected ? 'ring-2 ring-golf-green-400' : ''}
                        `}
                      >
                        {format(day, 'd')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Available Tee Times for {format(selectedDate, 'EEEE, MMMM d')}
                </h2>

                {teeTimes.length === 0 ? (
                  <p className="text-gray-500">Loading tee times...</p>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {teeTimes.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() =>
                          slot.available && setSelectedTime(slot.time)
                        }
                        disabled={!slot.available}
                        className={`
                          py-3 px-2 rounded-lg text-sm font-medium transition-colors
                          ${
                            !slot.available
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : selectedTime === slot.time
                              ? 'bg-golf-green-600 text-white'
                              : 'bg-gray-50 hover:bg-golf-green-50 text-gray-700'
                          }
                        `}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4">Booking Details</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Players
                      </label>
                      <select
                        value={numberOfPlayers}
                        onChange={(e) =>
                          setNumberOfPlayers(parseInt(e.target.value))
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-golf-green-500"
                      >
                        {[1, 2, 3, 4].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? 'Player' : 'Players'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeCart}
                          onChange={(e) => setIncludeCart(e.target.checked)}
                          className="w-5 h-5 text-golf-green-600 rounded focus:ring-golf-green-500"
                        />
                        <span className="text-gray-700">
                          Include Golf Cart (+${course.cartFee}/cart)
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Player Names (Optional)
                      </label>
                      {playerNames.map((name, idx) => (
                        <input
                          key={idx}
                          type="text"
                          placeholder={`Player ${idx + 1}`}
                          value={name}
                          onChange={(e) => {
                            const newNames = [...playerNames];
                            newNames[idx] = e.target.value;
                            setPlayerNames(newNames);
                          }}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-golf-green-500 mb-2"
                        />
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Requests
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        placeholder="Any special requests or notes..."
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-golf-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4">Price Summary</h2>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Green Fee ({numberOfPlayers} x ${course.greenFee})
                      </span>
                      <span>${course.greenFee * numberOfPlayers}</span>
                    </div>
                    {includeCart && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Cart Fee ({Math.ceil(numberOfPlayers / 2)} x $
                          {course.cartFee})
                        </span>
                        <span>
                          ${course.cartFee * Math.ceil(numberOfPlayers / 2)}
                        </span>
                      </div>
                    )}
                    <div className="border-t pt-2 mt-2 flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-golf-green-600">${totalPrice}</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!selectedTime || submitting}
                  className={`
                    w-full py-4 rounded-lg font-semibold text-lg transition-colors
                    ${
                      selectedTime && !submitting
                        ? 'bg-golf-green-600 hover:bg-golf-green-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  {submitting
                    ? 'Booking...'
                    : selectedTime
                    ? `Book for ${selectedTime}`
                    : 'Select a Tee Time'}
                </button>

                {!isAuthenticated && (
                  <p className="text-center text-sm text-gray-500">
                    You&apos;ll need to{' '}
                    <a
                      href="/login"
                      className="text-golf-green-600 hover:underline"
                    >
                      login
                    </a>{' '}
                    to complete your booking
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-golf-green-600 border-t-transparent"></div>
        </div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
