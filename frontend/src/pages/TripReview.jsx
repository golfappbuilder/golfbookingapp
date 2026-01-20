import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import StarRating from '../components/StarRating';
import reviewsService from '../services/reviewsService';

function TripReview() {
  const navigate = useNavigate();
  const [tripData, setTripData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [whatWorked, setWhatWorked] = useState('');
  const [whatDidntWork, setWhatDidntWork] = useState('');
  const [tripperName, setTripperName] = useState('');
  const [groupSize, setGroupSize] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Try to get trip data from session storage
    const storedTrip = sessionStorage.getItem('completedTrip');
    if (storedTrip) {
      const trip = JSON.parse(storedTrip);
      setTripData(trip);
      // Initialize reviews for each course
      setReviews(trip.courses.map(course => ({
        courseId: course.id,
        courseName: course.name,
        ratings: {
          conditions: 0,
          paceOfPlay: 0,
          value: 0,
          overall: 0,
        }
      })));
    }
  }, []);

  const updateCourseRating = (courseIndex, category, value) => {
    setReviews(prev => {
      const updated = [...prev];
      updated[courseIndex] = {
        ...updated[courseIndex],
        ratings: {
          ...updated[courseIndex].ratings,
          [category]: value,
        }
      };
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate that all courses have been rated
    const allRated = reviews.every(r =>
      r.ratings.conditions > 0 &&
      r.ratings.paceOfPlay > 0 &&
      r.ratings.value > 0 &&
      r.ratings.overall > 0
    );

    if (!allRated) {
      alert('Please rate all categories for each course');
      return;
    }

    // Add trip context to each review
    const fullReviews = reviews.map(review => ({
      ...review,
      tripperName: tripperName || 'Anonymous',
      groupSize: groupSize || tripData?.groupSize || 'Unknown',
      whatWorked,
      whatDidntWork,
      region: tripData?.region,
      tripType: tripData?.tripType,
    }));

    // Save reviews
    reviewsService.addTripReviews(fullReviews);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="trip-review-page">
        <div className="review-success">
          <div className="success-icon">✓</div>
          <h1>Thanks for your review!</h1>
          <p>Your feedback helps other golfers plan better trips.</p>
          <div className="success-actions">
            <Link to="/" className="btn btn-primary">Plan Another Trip</Link>
            <Link to="/courses" className="btn btn-outline">Browse Courses</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!tripData) {
    return (
      <div className="trip-review-page">
        <div className="no-trip">
          <h1>No Trip to Review</h1>
          <p>Complete a trip first, then come back to leave a review.</p>
          <Link to="/" className="btn btn-primary">Plan a Trip</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="trip-review-page">
      <div className="review-header">
        <h1>How was your {tripData.region} trip?</h1>
        <p>Help other golfers by sharing what worked and what didn't</p>
      </div>

      <form onSubmit={handleSubmit} className="review-form">
        {/* Trip Info */}
        <section className="review-section">
          <h2>About Your Group</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Your Name (optional)</label>
              <input
                type="text"
                value={tripperName}
                onChange={(e) => setTripperName(e.target.value)}
                placeholder="e.g., Mike from Boston"
              />
            </div>
            <div className="form-group">
              <label>Group Size</label>
              <input
                type="text"
                value={groupSize}
                onChange={(e) => setGroupSize(e.target.value)}
                placeholder="e.g., 12 guys"
              />
            </div>
          </div>
        </section>

        {/* Course Ratings */}
        <section className="review-section">
          <h2>Rate the Courses</h2>
          {reviews.map((review, index) => (
            <div key={review.courseId} className="course-review-card">
              <h3>{review.courseName}</h3>
              <div className="rating-grid">
                <div className="rating-row">
                  <span className="rating-label">Course Conditions</span>
                  <StarRating
                    rating={review.ratings.conditions}
                    onRate={(val) => updateCourseRating(index, 'conditions', val)}
                  />
                </div>
                <div className="rating-row">
                  <span className="rating-label">Pace of Play</span>
                  <StarRating
                    rating={review.ratings.paceOfPlay}
                    onRate={(val) => updateCourseRating(index, 'paceOfPlay', val)}
                  />
                </div>
                <div className="rating-row">
                  <span className="rating-label">Value for Money</span>
                  <StarRating
                    rating={review.ratings.value}
                    onRate={(val) => updateCourseRating(index, 'value', val)}
                  />
                </div>
                <div className="rating-row">
                  <span className="rating-label">Overall Experience</span>
                  <StarRating
                    rating={review.ratings.overall}
                    onRate={(val) => updateCourseRating(index, 'overall', val)}
                  />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* What Worked / Didn't Work */}
        <section className="review-section">
          <h2>Trip Feedback</h2>
          <div className="form-group">
            <label>What worked well?</label>
            <textarea
              value={whatWorked}
              onChange={(e) => setWhatWorked(e.target.value)}
              placeholder="e.g., The courses were close together, the Airbnb was perfect for our group, the itinerary timing was spot on..."
              rows={4}
            />
          </div>
          <div className="form-group">
            <label>What didn't work?</label>
            <textarea
              value={whatDidntWork}
              onChange={(e) => setWhatDidntWork(e.target.value)}
              placeholder="e.g., One course was overpriced, should have booked earlier tee times, needed more rest days..."
              rows={4}
            />
          </div>
        </section>

        <div className="review-actions">
          <Link to="/" className="btn btn-outline">Cancel</Link>
          <button type="submit" className="btn btn-primary btn-large">
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
}

export default TripReview;
