import { useState, useEffect } from 'react';
import { bookingsApi } from '../services/api';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    bookingsApi.getAll()
      .then(response => setBookings(response.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingsApi.cancel(id);
      loadBookings();
    } catch (error) {
      alert('Failed to cancel booking');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
    <div className="bookings-page">
      <h1>My Bookings</h1>

      {bookings.length === 0 ? (
        <p>You don't have any bookings yet.</p>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking.id} className={`booking-card ${booking.status}`}>
              <div className="booking-header">
                <h3>{booking.course_name}</h3>
                <span className={`status status-${booking.status}`}>
                  {booking.status}
                </span>
              </div>
              <div className="booking-details">
                <p><strong>Date:</strong> {formatDate(booking.tee_date)}</p>
                <p><strong>Time:</strong> {booking.tee_time.slice(0, 5)}</p>
                <p><strong>Players:</strong> {booking.players}</p>
                <p><strong>Total:</strong> ${booking.total_price}</p>
              </div>
              {booking.status === 'confirmed' && (
                <button
                  className="btn btn-outline btn-danger"
                  onClick={() => handleCancel(booking.id)}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookings;
