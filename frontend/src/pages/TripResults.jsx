import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { newEnglandCourses, newEnglandLodging, generateItinerary } from '../services/mockData';

function TripResults() {
  const navigate = useNavigate();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const prompt = sessionStorage.getItem('tripPrompt');
    if (!prompt) {
      navigate('/');
      return;
    }

    // Simulate AI processing the prompt
    setTimeout(() => {
      const parsedTrip = parsePrompt(prompt);
      setTripData(parsedTrip);
      setLoading(false);
    }, 500);
  }, [navigate]);

  // Simple prompt parser (in production, this would use AI)
  const parsePrompt = (prompt) => {
    const lowerPrompt = prompt.toLowerCase();

    // Detect region
    let region = 'Vermont';
    if (lowerPrompt.includes('cape cod') || lowerPrompt.includes('massachusetts')) region = 'Cape Cod';
    else if (lowerPrompt.includes('maine')) region = 'Maine';
    else if (lowerPrompt.includes('new hampshire') || lowerPrompt.includes(' nh')) region = 'New Hampshire';
    else if (lowerPrompt.includes('vermont') || lowerPrompt.includes('killington')) region = 'Vermont';
    else if (lowerPrompt.includes('rhode island')) region = 'Rhode Island';
    else if (lowerPrompt.includes('connecticut')) region = 'Connecticut';

    // Detect dates (simple extraction)
    const dateMatch = prompt.match(/(\w+ \d+)(?:th|st|nd|rd)?(?:\s*[-–]\s*(\d+)(?:th|st|nd|rd)?)?/i);
    let startDate = 'August 4th';
    let endDate = 'August 10th';
    if (dateMatch) {
      startDate = dateMatch[1];
      endDate = dateMatch[2] ? `${dateMatch[1].split(' ')[0]} ${dateMatch[2]}` : startDate;
    }

    // Detect group size
    const groupMatch = prompt.match(/(\d+)\s*(?:guys|people|players|friends|of us)/i);
    const groupSize = groupMatch ? parseInt(groupMatch[1]) : 4;

    // Get courses for the region
    const regionCourses = newEnglandCourses.filter(c => c.region === region).slice(0, 3);
    if (regionCourses.length === 0) {
      // Fallback to random courses
      regionCourses.push(...newEnglandCourses.slice(0, 3));
    }

    // Get lodging for the region
    const regionLodging = newEnglandLodging.filter(l => l.region === region).slice(0, 3);
    if (regionLodging.length === 0) {
      regionLodging.push(...newEnglandLodging.slice(0, 3));
    }

    // Generate itinerary
    const itinerary = generateItinerary(regionCourses, startDate, 6);

    return {
      prompt,
      region,
      startDate,
      endDate,
      groupSize,
      courses: regionCourses,
      lodging: regionLodging,
      itinerary,
    };
  };

  if (loading) {
    return (
      <div className="trip-results">
        <div className="loading">
          <p>Creating your perfect golf trip...</p>
        </div>
      </div>
    );
  }

  if (!tripData) {
    return (
      <div className="trip-results">
        <div className="error">
          <p>Something went wrong. <Link to="/">Try again</Link></p>
        </div>
      </div>
    );
  }

  return (
    <div className="trip-results">
      <div className="trip-results-header">
        <h1>Your {tripData.region} Golf Trip</h1>
        <p className="trip-summary">
          {tripData.groupSize} players · {tripData.startDate} - {tripData.endDate}
        </p>
      </div>

      <div className="trip-sections">
        {/* Itinerary Section */}
        <section className="trip-section">
          <h2>Suggested Itinerary</h2>
          {tripData.itinerary.map((day, i) => (
            <div key={i} className="itinerary-day">
              <h3>{day.day}</h3>
              <p>{day.activity}</p>
            </div>
          ))}
        </section>

        {/* Courses Section */}
        <section className="trip-section">
          <h2>Recommended Courses</h2>
          {tripData.courses.map((course) => (
            <div key={course.id} className="course-suggestion">
              <div className="course-suggestion-info">
                <h4>{course.name}</h4>
                <p>{course.city}, {course.state} · {course.holes} holes · Par {course.par_total}</p>
              </div>
              <div className="course-suggestion-price">
                ${course.price_weekday} - ${course.price_weekend}
              </div>
            </div>
          ))}
        </section>

        {/* Lodging Section */}
        <section className="trip-section">
          <h2>Where to Stay</h2>
          {tripData.lodging.map((lodge) => (
            <div key={lodge.id} className="lodging-option">
              <div className="lodging-option-info">
                <h4>{lodge.name}</h4>
                <p>{lodge.city}, {lodge.state} · {lodge.type}</p>
              </div>
              <div className="lodging-option-price">
                <span className="price">${lodge.price_per_night}</span>
                <span className="per-night">/night</span>
              </div>
            </div>
          ))}
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
            Lodging links powered by Booking.com (coming soon)
          </p>
        </section>
      </div>

      <div className="trip-actions">
        <Link to="/" className="btn btn-outline">
          Plan Another Trip
        </Link>
        <button className="btn btn-primary" onClick={() => window.print()}>
          Save Trip Plan
        </button>
      </div>
    </div>
  );
}

export default TripResults;
