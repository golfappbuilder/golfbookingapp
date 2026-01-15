import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesApi } from '../services/api';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    coursesApi.getAll()
      .then(response => setCourses(response.data))
      .catch(err => setError('Failed to load courses'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading courses...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="courses-page">
      <h1>Golf Courses</h1>
      {courses.length === 0 ? (
        <p>No courses available yet.</p>
      ) : (
        <div className="courses-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card">
              <h2>{course.name}</h2>
              <p className="location">{course.city}, {course.state}</p>
              <p className="details">{course.holes} holes | Par {course.par_total}</p>
              <p className="price">From ${course.price_weekday}</p>
              <Link to={`/courses/${course.id}`} className="btn btn-primary">
                View & Book
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;
