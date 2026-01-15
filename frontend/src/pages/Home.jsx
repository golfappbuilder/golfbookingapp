import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>Book Your Perfect Tee Time</h1>
        <p>Find and book tee times at the best golf courses near you</p>
        <Link to="/courses" className="btn btn-primary btn-large">
          Browse Courses
        </Link>
      </section>

      <section className="features">
        <div className="feature">
          <h3>Easy Booking</h3>
          <p>Book your tee time in just a few clicks</p>
        </div>
        <div className="feature">
          <h3>Best Prices</h3>
          <p>Find competitive rates at top courses</p>
        </div>
        <div className="feature">
          <h3>Instant Confirmation</h3>
          <p>Get immediate booking confirmation</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
