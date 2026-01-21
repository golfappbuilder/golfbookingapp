import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="font-pacifico text-4xl text-masters-yellow">
                Breakfast Ball
              </span>
            </Link>
            <p className="text-gray-400 max-w-md">
              Plan epic golf trips with your crew. AI-powered itineraries,
              course reviews, and easy sharing - all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className="text-gray-400 hover:text-masters-yellow transition-colors">
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link href="/my-trips" className="text-gray-400 hover:text-masters-yellow transition-colors">
                  My Trips
                </Link>
              </li>
            </ul>
          </div>

          {/* Regions */}
          <div>
            <h3 className="font-bold text-lg mb-4">Popular Destinations</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Cape Cod, MA</li>
              <li className="text-gray-400">Maine Coast</li>
              <li className="text-gray-400">Boston Area</li>
              <li className="text-gray-400">South Shore, MA</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Breakfast Ball. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-2">
            Made with
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            for golfers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
