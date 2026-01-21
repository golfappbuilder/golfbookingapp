'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-masters-green text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <svg
              className="w-8 h-8 text-masters-yellow"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="3" strokeWidth="2" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 2v4m0 12v4m-10-10h4m12 0h4m-2.93-7.07l-2.83 2.83m-8.48 8.48l-2.83 2.83m14.14 0l-2.83-2.83M6.34 6.34L3.51 3.51"
              />
            </svg>
            <span className="font-pacifico text-2xl text-masters-yellow">Breakfast Ball</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              href="/courses"
              className="hover:text-masters-yellow transition-colors"
            >
              Browse Courses
            </Link>
            <Link
              href="/my-bookings"
              className="bg-masters-yellow text-masters-green-dark hover:bg-masters-yellow-dark px-4 py-2 rounded-lg transition-colors font-medium"
            >
              My Bookings
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
