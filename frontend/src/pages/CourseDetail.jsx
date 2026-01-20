import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { coursesApi } from '../services/api';
import reviewsService from '../services/reviewsService';
import StarRating from '../components/StarRating';

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [averages, setAverages] = useState(null);

  useEffect(() => {
    coursesApi.getById(id)
      .then(response => setCourse(response.data))
      .catch(() => navigate('/courses'))
      .finally(() => setLoading(false));

    // Load reviews for this course
    const courseReviews = reviewsService.getByCourseId(parseInt(id));
    setReviews(courseReviews);
    setAverages(reviewsService.getCourseAverages(parseInt(id)));
  }, [id, navigate]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!course) return <div className="error">Course not found</div>;

  return (
    <div className="main-content">
      <Link to="/courses" className="btn btn-outline" style={{ marginBottom: '1.5rem' }}>
        Back to Courses
      </Link>

      <div className="course-detail">
        <div className="course-info">
          <span className="region-badge">{course.region}</span>
          <h1>{course.name}</h1>
          <p className="address">{course.address}, {course.city}, {course.state} {course.zip}</p>
          <p className="details">{course.holes} holes · Par {course.par_total}</p>
          {course.description && <p className="description">{course.description}</p>}

          {/* Website Link */}
          {course.website && (
            <a
              href={course.website}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
            >
              Book Tee Time →
            </a>
          )}
        </div>

        <div className="info-section">
          <h2>Green Fees</h2>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
              <span>Weekday</span>
              <strong>${course.price_weekday}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0' }}>
              <span>Weekend</span>
              <strong>${course.price_weekend}</strong>
            </div>
          </div>

          {/* Ratings Summary */}
          {averages && (
            <>
              <h2 style={{ marginTop: '1.5rem' }}>Tripper Ratings</h2>
              <div className="ratings-summary">
                <div className="rating-summary-row">
                  <span>Conditions</span>
                  <div className="rating-value">
                    <StarRating rating={parseFloat(averages.conditions)} readonly size="small" />
                    <span>{averages.conditions}</span>
                  </div>
                </div>
                <div className="rating-summary-row">
                  <span>Pace of Play</span>
                  <div className="rating-value">
                    <StarRating rating={parseFloat(averages.paceOfPlay)} readonly size="small" />
                    <span>{averages.paceOfPlay}</span>
                  </div>
                </div>
                <div className="rating-summary-row">
                  <span>Value</span>
                  <div className="rating-value">
                    <StarRating rating={parseFloat(averages.value)} readonly size="small" />
                    <span>{averages.value}</span>
                  </div>
                </div>
                <div className="rating-summary-row overall">
                  <span>Overall</span>
                  <div className="rating-value">
                    <StarRating rating={parseFloat(averages.overall)} readonly size="small" />
                    <span>{averages.overall}</span>
                  </div>
                </div>
                <p className="review-count">Based on {averages.count} trip review{averages.count !== 1 ? 's' : ''}</p>
              </div>
            </>
          )}

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg)', borderRadius: 'var(--radius)', fontSize: '0.9rem', color: 'var(--text-light)' }}>
            <strong style={{ color: 'var(--text)' }}>Planning a group trip?</strong>
            <p style={{ marginTop: '0.5rem' }}>Use our AI trip planner to find the best courses and lodging for your golf getaway.</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Plan a Trip
            </Link>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <div className="reviews-section">
          <h2>What Trippers Are Saying</h2>
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <strong>{review.tripperName || 'Anonymous'}</strong>
                  <span className="review-meta">
                    {review.groupSize && `${review.groupSize} • `}
                    {review.region} trip
                  </span>
                </div>
                <div className="review-overall">
                  <StarRating rating={review.ratings.overall} readonly size="small" />
                </div>
              </div>
              {review.whatWorked && (
                <div className="review-feedback">
                  <span className="feedback-label good">What worked:</span>
                  <p>{review.whatWorked}</p>
                </div>
              )}
              {review.whatDidntWork && (
                <div className="review-feedback">
                  <span className="feedback-label bad">What didn't:</span>
                  <p>{review.whatDidntWork}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseDetail;
