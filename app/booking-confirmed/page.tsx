'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const confirmation = searchParams.get('confirmation');
  const email = searchParams.get('email');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-masters-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-masters-green"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-gray-600 mb-6">
              Your tee time has been reserved.
            </p>

            {confirmation && (
              <div className="bg-masters-yellow/10 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Confirmation Number</p>
                <p className="text-2xl font-bold text-masters-green">{confirmation}</p>
              </div>
            )}

            {email && (
              <p className="text-gray-600 mb-8">
                A confirmation email has been sent to <strong>{decodeURIComponent(email)}</strong>
              </p>
            )}

            <div className="space-y-3">
              <Link
                href="/my-trips"
                className="block w-full bg-masters-yellow hover:bg-masters-yellow-dark text-masters-green-dark py-3 rounded-lg font-semibold transition-colors"
              >
                View My Trips
              </Link>
              <Link
                href="/courses"
                className="block w-full border border-masters-green text-masters-green hover:bg-masters-green hover:text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Book Another Tee Time
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingConfirmedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-masters-green border-t-transparent"></div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
