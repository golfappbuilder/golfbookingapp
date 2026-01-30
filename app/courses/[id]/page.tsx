'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { Course, Review } from '@/types';

// Local storage helpers for reviews
function getReviewsFromStorage(courseId: string): Review[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(`reviews_${courseId}`);
  return stored ? JSON.parse(stored) : [];
}

function saveReviewToStorage(review: Review): void {
  const reviews = getReviewsFromStorage(review.courseId);
  reviews.unshift(review);
  localStorage.setItem(`reviews_${review.courseId}`, JSON.stringify(reviews));
}

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        if (!res.ok) throw new Error('Course not found');
        const data = await res.json();
        setCourse(data);
      } catch {
        setCourse(null);
      } finally {
        setLoading(false);
      }
    }

    if (courseId) {
      fetchCourse();
      setReviews(getReviewsFromStorage(courseId));
    }
  }, [courseId]);

  const handleReviewSubmit = (review: Review) => {
    saveReviewToStorage(review);
    setReviews(getReviewsFromStorage(courseId));
    setShowReviewForm(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-masters-green border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
        <Link href="/courses" className="text-masters-green hover:underline">
          Back to Courses
        </Link>
      </div>
    );
  }

  const averageRatings = calculateAverageRatings(reviews);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Course Header */}
      <div className="bg-masters-green text-white py-12">
        <div className="container mx-auto px-4">
          <Link
            href="/courses"
            className="inline-flex items-center text-masters-green-light hover:text-white mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Courses
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold">{course.name}</h1>
            {course.verified && (
              <span className="bg-masters-yellow text-masters-green-dark px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
            )}
          </div>
          <p className="text-masters-green-light text-lg">
            {course.city}, {course.state} • {course.region}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Course Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Details Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">About This Course</h2>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="bg-masters-green/10 text-masters-green px-4 py-2 rounded-lg font-medium">
                  {course.type}
                </span>
                <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium">
                  {course.holes} Holes
                </span>
              </div>

              <p className="text-gray-600 mb-6">{course.description}</p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={course.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  View Current Rates
                </a>
                <a
                  href={course.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-masters-green hover:bg-masters-green-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Book Tee Time
                </a>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Reviews {reviews.length > 0 && `(${reviews.length})`}
                </h2>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-masters-yellow hover:bg-masters-yellow-dark text-masters-green-dark px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {showReviewForm ? 'Cancel' : 'Write a Review'}
                </button>
              </div>

              {/* Average Ratings */}
              {reviews.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold mb-3 text-gray-900">Average Ratings</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <RatingDisplay label="Conditions" rating={averageRatings.conditions} />
                    <RatingDisplay label="Pace of Play" rating={averageRatings.paceOfPlay} />
                    <RatingDisplay label="Value" rating={averageRatings.value} />
                    <RatingDisplay label="Overall" rating={averageRatings.overall} />
                  </div>
                </div>
              )}

              {/* Review Form */}
              {showReviewForm && (
                <ReviewForm
                  courseId={courseId}
                  onSubmit={handleReviewSubmit}
                  onCancel={() => setShowReviewForm(false)}
                />
              )}

              {/* Reviews List */}
              {reviews.length === 0 && !showReviewForm ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No reviews yet. Be the first to share your experience!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Book This Course</h3>

              <p className="text-gray-600 text-sm mb-4">
                Click below to view current rates and book your tee time directly with the course.
              </p>

              <a
                href={course.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-masters-green hover:bg-masters-green-dark text-white text-center px-6 py-3 rounded-lg font-semibold transition-colors mb-3"
              >
                Book Tee Time
              </a>

              <a
                href={course.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-masters-green hover:text-masters-green-dark text-center font-medium"
              >
                Visit Course Website
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Star Rating Input Component
function StarRatingInput({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (rating: number) => void;
  label: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`w-8 h-8 ${star <= value ? 'text-masters-yellow' : 'text-gray-300'} hover:text-masters-yellow transition-colors`}
          >
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

// Rating Display Component
function RatingDisplay({ label, rating }: { label: string; rating: number }) {
  return (
    <div className="text-center">
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      <div className="flex items-center justify-center gap-1">
        <svg className="w-4 h-4 text-masters-yellow" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
      </div>
    </div>
  );
}

// Review Form Component
function ReviewForm({
  courseId,
  onSubmit,
  onCancel,
}: {
  courseId: string;
  onSubmit: (review: Review) => void;
  onCancel: () => void;
}) {
  const [reviewerName, setReviewerName] = useState('');
  const [datePlayed, setDatePlayed] = useState('');
  const [ratings, setRatings] = useState({
    conditions: 0,
    paceOfPlay: 0,
    value: 0,
    overall: 0,
  });
  const [whatWorked, setWhatWorked] = useState('');
  const [whatDidntWork, setWhatDidntWork] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!reviewerName.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!datePlayed) {
      setError('Please enter the date you played');
      return;
    }
    if (ratings.conditions === 0 || ratings.paceOfPlay === 0 || ratings.value === 0 || ratings.overall === 0) {
      setError('Please rate all categories');
      return;
    }
    if (!whatWorked.trim()) {
      setError('Please share what worked');
      return;
    }

    const review: Review = {
      id: crypto.randomUUID(),
      courseId,
      reviewerName: reviewerName.trim(),
      datePlayed,
      ratings,
      whatWorked: whatWorked.trim(),
      whatDidntWork: whatDidntWork.trim(),
      createdAt: new Date().toISOString(),
    };

    onSubmit(review);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6 mb-6">
      <h3 className="font-semibold mb-4 text-gray-900">Share Your Experience</h3>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
          <input
            type="text"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            placeholder="John D."
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-masters-green focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Played</label>
          <input
            type="date"
            value={datePlayed}
            onChange={(e) => setDatePlayed(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-masters-green focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <StarRatingInput
          label="Conditions"
          value={ratings.conditions}
          onChange={(val) => setRatings({ ...ratings, conditions: val })}
        />
        <StarRatingInput
          label="Pace of Play"
          value={ratings.paceOfPlay}
          onChange={(val) => setRatings({ ...ratings, paceOfPlay: val })}
        />
        <StarRatingInput
          label="Value"
          value={ratings.value}
          onChange={(val) => setRatings({ ...ratings, value: val })}
        />
        <StarRatingInput
          label="Overall"
          value={ratings.overall}
          onChange={(val) => setRatings({ ...ratings, overall: val })}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">What Worked</label>
        <textarea
          value={whatWorked}
          onChange={(e) => setWhatWorked(e.target.value)}
          placeholder="Tell us what you enjoyed about the course..."
          rows={3}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-masters-green focus:border-transparent"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">What Didn&apos;t Work (Optional)</label>
        <textarea
          value={whatDidntWork}
          onChange={(e) => setWhatDidntWork(e.target.value)}
          placeholder="Any areas for improvement..."
          rows={3}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-masters-green focus:border-transparent"
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-masters-green hover:bg-masters-green-dark text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Submit Review
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// Review Card Component
function ReviewCard({ review }: { review: Review }) {
  const formattedDate = new Date(review.datePlayed).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="border-b pb-6 last:border-b-0 last:pb-0">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-gray-900">{review.reviewerName}</p>
          <p className="text-gray-500 text-sm">Played on {formattedDate}</p>
        </div>
        <div className="flex items-center gap-1 bg-masters-yellow/20 px-2 py-1 rounded">
          <svg className="w-4 h-4 text-masters-yellow" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="font-semibold text-masters-green-dark">{review.ratings.overall}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-3 text-sm">
        <span className="text-gray-600">Conditions: <span className="font-medium">{review.ratings.conditions}/5</span></span>
        <span className="text-gray-600">Pace: <span className="font-medium">{review.ratings.paceOfPlay}/5</span></span>
        <span className="text-gray-600">Value: <span className="font-medium">{review.ratings.value}/5</span></span>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-masters-green mb-1">What Worked</p>
          <p className="text-gray-700">{review.whatWorked}</p>
        </div>
        {review.whatDidntWork && (
          <div>
            <p className="text-sm font-medium text-red-600 mb-1">What Didn&apos;t Work</p>
            <p className="text-gray-700">{review.whatDidntWork}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to calculate average ratings
function calculateAverageRatings(reviews: Review[]): {
  conditions: number;
  paceOfPlay: number;
  value: number;
  overall: number;
} {
  if (reviews.length === 0) {
    return { conditions: 0, paceOfPlay: 0, value: 0, overall: 0 };
  }

  const totals = reviews.reduce(
    (acc, review) => ({
      conditions: acc.conditions + review.ratings.conditions,
      paceOfPlay: acc.paceOfPlay + review.ratings.paceOfPlay,
      value: acc.value + review.ratings.value,
      overall: acc.overall + review.ratings.overall,
    }),
    { conditions: 0, paceOfPlay: 0, value: 0, overall: 0 }
  );

  return {
    conditions: totals.conditions / reviews.length,
    paceOfPlay: totals.paceOfPlay / reviews.length,
    value: totals.value / reviews.length,
    overall: totals.overall / reviews.length,
  };
}
