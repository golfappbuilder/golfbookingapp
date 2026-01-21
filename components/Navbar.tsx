'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

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

          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/courses"
              className="hover:text-masters-yellow transition-colors"
            >
              Browse Courses
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="hover:text-masters-yellow transition-colors"
                >
                  My Bookings
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-masters-green-light">
                    Hi, {user?.firstName}
                  </span>
                  <button
                    onClick={logout}
                    className="bg-masters-yellow hover:bg-masters-yellow-dark text-masters-green-dark px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="hover:text-masters-yellow transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-masters-yellow text-masters-green-dark hover:bg-masters-yellow-dark px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Link
              href={isAuthenticated ? '/dashboard' : '/login'}
              className="bg-masters-yellow hover:bg-masters-yellow-dark text-masters-green-dark px-4 py-2 rounded-lg transition-colors font-medium"
            >
              {isAuthenticated ? 'Dashboard' : 'Login'}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
