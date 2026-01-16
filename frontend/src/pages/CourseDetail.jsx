import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { coursesApi } from '../services/api';

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coursesApi.getById(id)
      .then(response => setCourse(response.data))
      .catch(() => navigate('/courses'))
      .finally(() => setLoading(false));
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

          <h2 style={{ marginTop: '1.5rem' }}>Course Info</h2>
          <div style={{ color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: '1.7' }}>
            <p>Contact the pro shop directly to book tee times and check availability.</p>
            {course.phone && <p style={{ marginTop: '0.5rem' }}>Phone: {course.phone}</p>}
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg)', borderRadius: 'var(--radius)', fontSize: '0.9rem', color: 'var(--text-light)' }}>
            <strong style={{ color: 'var(--text)' }}>Planning a group trip?</strong>
            <p style={{ marginTop: '0.5rem' }}>Use our AI trip planner to find the best courses and lodging for your golf getaway.</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Plan a Trip
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
