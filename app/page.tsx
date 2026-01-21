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
                Book Your Perfect Tee Time
              </span>
            </h1>
            <p className="text-xl text-masters-green-light mb-8">
              Discover and book tee times at the best golf courses. Easy
              scheduling, instant confirmation, and the best prices guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/courses"
                className="bg-masters-yellow hover:bg-masters-yellow-dark text-masters-green-dark px-8 py-4 rounded-lg font-semibold text-lg transition-colors text-center shadow-lg"
              >
                Browse Courses
              </Link>
              <Link
                href="/register"
                className="border-2 border-masters-yellow text-masters-yellow hover:bg-masters-yellow hover:text-masters-green-dark px-8 py-4 rounded-lg font-semibold text-lg transition-colors text-center"
              >
                Create Account
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              }
              title="Easy Booking"
              description="Book your tee time in seconds with our intuitive calendar and time slot picker."
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              title="Instant Confirmation"
              description="Get immediate booking confirmation with a unique confirmation number."
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              title="Best Prices"
              description="Compare prices across multiple courses and find the best deals."
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
              title="Browse Courses"
              description="Explore our selection of premium golf courses"
            />
            <StepCard
              number="2"
              title="Select Date & Time"
              description="Pick your preferred date and available tee time"
            />
            <StepCard
              number="3"
              title="Add Players"
              description="Specify the number of players and cart options"
            />
            <StepCard
              number="4"
              title="Confirm Booking"
              description="Complete your reservation and hit the course!"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-masters-green text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Play?</h2>
          <p className="text-xl text-masters-green-light mb-8">
            Join thousands of golfers who book their tee times with us.
          </p>
          <Link
            href="/courses"
            className="inline-block bg-masters-yellow hover:bg-masters-yellow-dark text-masters-green-dark px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
          >
            Find a Course Near You
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
