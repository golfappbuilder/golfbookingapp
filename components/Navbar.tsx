'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-masters-green via-masters-green to-masters-green-dark text-white shadow-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-3 group">
            {/* Golf Ball Icon */}
            <div className="relative">
              <svg
                className="w-10 h-10 text-masters-yellow group-hover:rotate-12 transition-transform duration-300"
                viewBox="0 0 40 40"
                fill="currentColor"
              >
                <circle cx="20" cy="20" r="18" />
                <circle cx="14" cy="14" r="2" fill="#006747" />
                <circle cx="20" cy="12" r="2" fill="#006747" />
                <circle cx="26" cy="14" r="2" fill="#006747" />
                <circle cx="16" cy="20" r="2" fill="#006747" />
                <circle cx="24" cy="20" r="2" fill="#006747" />
                <circle cx="20" cy="26" r="2" fill="#006747" />
              </svg>
            </div>
            <span className="font-pacifico text-3xl text-masters-yellow drop-shadow-md group-hover:scale-105 transition-transform duration-300">
              Breakfast Ball
            </span>
          </Link>

          <div className="flex items-center space-x-2">
            <Link
              href="/courses"
              className="px-5 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 font-medium"
            >
              Courses
            </Link>
            <Link
              href="/my-trips"
              className="bg-masters-yellow hover:bg-masters-yellow-dark text-masters-green-dark px-6 py-2.5 rounded-xl transition-all duration-200 font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              My Trips
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
