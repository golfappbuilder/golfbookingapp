import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesApi } from '../services/api';

const regions = ['All', 'Vermont', 'Cape Cod', 'Maine', 'New Hampshire', 'Rhode Island', 'Connecticut'];

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('All');

  useEffect(() => {
    coursesApi.getAll()
      .then(response => setCourses(response.data))
      .catch(err => setError('Failed to load courses'))
      .finally(() => setLoading(false));
  }, []);

  const filteredCourses = selectedRegion === 'All'
    ? courses
    : courses.filter(c => c.region === selectedRegion);

  if (loading) return <div className="loading">Loading courses...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="courses-page main-content">
      <h1>New England Golf Courses</h1>

      <div className="region-filters" style={{ marginBottom: '1.5rem' }}>
        {regions.map(region => (
          <button
            key={region}
            className={`example-chip ${selectedRegion === region ? 'selected' : ''}`}
            onClick={() => setSelectedRegion(region)}
            style={selectedRegion === region ? {
              background: 'var(--primary)',
              color: 'white',
              borderColor: 'var(--primary)'
            } : {}}
          >
            {region}
          </button>
        ))}
      </div>

      {filteredCourses.length === 0 ? (
        <p>No courses available in this region.</p>
      ) : (
        <div className="courses-grid">
          {filteredCourses.map(course => (
            <div key={course.id} className="course-card">
              <span className="region-badge">{course.region}</span>
              <h2>{course.name}</h2>
              <p className="location">{course.city}, {course.state}</p>
              <p className="details">{course.holes} holes | Par {course.par_total}</p>
              <p className="price">From ${course.price_weekday}</p>
              <Link to={`/courses/${course.id}`} className="btn btn-primary">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;
