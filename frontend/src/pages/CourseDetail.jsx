import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { coursesApi, teeTimesApi, bookingsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [teeTimes, setTeeTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedTeeTime, setSelectedTeeTime] = useState(null);
  const [players, setPlayers] = useState(1);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    coursesApi.getById(id)
      .then(response => setCourse(response.data))
      .catch(() => navigate('/courses'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    if (course) {
      teeTimesApi.getAvailable(id, selectedDate)
        .then(response => setTeeTimes(response.data))
        .catch(() => setTeeTimes([]));
    }
  }, [id, selectedDate, course]);

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!selectedTeeTime) return;

    setBooking(true);
    try {
      await bookingsApi.create(selectedTeeTime.id, players, selectedTeeTime);
      navigate('/bookings');
    } catch (error) {
      alert(error.response?.data?.error || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!course) return <div className="error">Course not found</div>;

  const isWeekend = new Date(selectedDate).getDay() % 6 === 0;
  const price = isWeekend ? course.price_weekend : course.price_weekday;

  return (
    <div className="course-detail">
      <div className="course-info">
        <h1>{course.name}</h1>
        <p className="address">{course.address}, {course.city}, {course.state} {course.zip}</p>
        <p className="details">{course.holes} holes | Par {course.par_total}</p>
        {course.description && <p className="description">{course.description}</p>}
      </div>

      <div className="booking-section">
        <h2>Book a Tee Time</h2>

        <div className="form-group">
          <label>Select Date</label>
          <input
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Number of Players</label>
          <select value={players} onChange={(e) => setPlayers(Number(e.target.value))}>
            {[1, 2, 3, 4].map(n => (
              <option key={n} value={n}>{n} Player{n > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        <div className="tee-times-list">
          <h3>Available Tee Times</h3>
          {teeTimes.length === 0 ? (
            <p>No tee times available for this date.</p>
          ) : (
            <div className="tee-times-grid">
              {teeTimes.map(tt => (
                <button
                  key={tt.id}
                  className={`tee-time-btn ${selectedTeeTime?.id === tt.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTeeTime(tt)}
                  disabled={tt.available_slots < players}
                >
                  {tt.tee_time.slice(0, 5)}
                  <span className="slots">{tt.available_slots} slots</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedTeeTime && (
          <div className="booking-summary">
            <p>Total: <strong>${price * players}</strong> ({players} x ${price})</p>
            <button
              className="btn btn-primary btn-large"
              onClick={handleBooking}
              disabled={booking}
            >
              {booking ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseDetail;
