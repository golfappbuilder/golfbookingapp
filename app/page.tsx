import Link from 'next/link';

export default function Home() {
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
              <Link
                href="/courses"
                className="bg-masters-yellow hover:bg-masters-yellow-dark text-masters-green-dark px-8 py-4 rounded-lg font-semibold text-lg transition-colors text-center shadow-lg"
              >
                Start Planning
              </Link>
              <Link
                href="/my-bookings"
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

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Why Choose <span className="text-masters-green">Breakfast Ball</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              }
              title="AI Trip Planning"
              description="Tell us your group size, dates, and vibe - we'll build the perfect itinerary."
            />
            <FeatureCard
              icon={
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              }
              title="Share with Friends"
              description="Get a shareable link to send your crew. No app download needed."
            />
            <FeatureCard
              icon={
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              }
              title="Real Reviews"
              description="Learn from other golf trips - what worked, what didn't."
            />
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
          <Link
            href="/courses"
            className="inline-block bg-masters-yellow hover:bg-masters-yellow-dark text-masters-green-dark px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
          >
            Start Planning
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="text-masters-green mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
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
