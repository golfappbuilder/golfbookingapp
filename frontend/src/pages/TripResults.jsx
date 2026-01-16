import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { newEnglandCourses, newEnglandLodging } from '../services/mockData';

function TripResults() {
  const navigate = useNavigate();
  const [tripRequest, setTripRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('options'); // 'options' | 'trip'

  // Selections
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedLodging, setSelectedLodging] = useState(null);

  // Available options based on prompt
  const [courseOptions, setCourseOptions] = useState([]);
  const [hotelOptions, setHotelOptions] = useState([]);
  const [rentalOptions, setRentalOptions] = useState([]);

  // Final trip
  const [finalTrip, setFinalTrip] = useState(null);

  useEffect(() => {
    const prompt = sessionStorage.getItem('tripPrompt');
    if (!prompt) { navigate('/'); return; }

    setTimeout(() => {
      const parsed = parsePrompt(prompt);
      setTripRequest(parsed);

      // Get options for this region
      const regionCourses = newEnglandCourses.filter(c => c.region === parsed.region);
      const regionLodging = newEnglandLodging.filter(l => l.region === parsed.region);

      setCourseOptions(regionCourses.length > 0 ? regionCourses : newEnglandCourses.slice(0, 8));
      setHotelOptions(regionLodging.filter(l => l.type === 'Hotel' || l.type === 'Resort' || l.type === 'Inn').slice(0, 4));
      setRentalOptions(regionLodging.filter(l => l.type === 'Vacation Rental' || l.type === 'House').slice(0, 4));

      setLoading(false);
    }, 800);
  }, [navigate]);

  const parsePrompt = (prompt) => {
    const lowerPrompt = prompt.toLowerCase();

    let region = 'Vermont';
    if (lowerPrompt.includes('cape cod')) region = 'Cape Cod';
    else if (lowerPrompt.includes('maine')) region = 'Maine';
    else if (lowerPrompt.includes('new hampshire') || lowerPrompt.includes(' nh')) region = 'New Hampshire';
    else if (lowerPrompt.includes('vermont') || lowerPrompt.includes('killington')) region = 'Vermont';
    else if (lowerPrompt.includes('rhode island')) region = 'Rhode Island';
    else if (lowerPrompt.includes('connecticut')) region = 'Connecticut';
    else if (lowerPrompt.includes('massachusetts') || lowerPrompt.includes(' ma ')) region = 'Massachusetts';

    const groupMatch = prompt.match(/(\d+)\s*(?:guys|people|players|friends|of us|men)/i);
    const groupSize = groupMatch ? parseInt(groupMatch[1]) : 8;

    const roundsMatch = prompt.match(/(\d+)\s*(?:rounds?|games?)/i);
    const numRounds = roundsMatch ? parseInt(roundsMatch[1]) : 3;

    // Detect 36 holes in one day
    const marathonDay = lowerPrompt.includes('36') || lowerPrompt.includes('two rounds') || lowerPrompt.includes('2 rounds in one');

    // Detect origin
    let origin = 'Boston';
    if (lowerPrompt.includes('new york') || lowerPrompt.includes('nyc')) origin = 'New York';
    else if (lowerPrompt.includes('boston')) origin = 'Boston';
    else if (lowerPrompt.includes('providence')) origin = 'Providence';
    else if (lowerPrompt.includes('hartford')) origin = 'Hartford';

    // Detect lodging preference
    let lodgingPref = 'any';
    if (lowerPrompt.includes('airbnb') || lowerPrompt.includes('vrbo') || lowerPrompt.includes('house')) lodgingPref = 'rental';
    else if (lowerPrompt.includes('hotel') || lowerPrompt.includes('resort') || lowerPrompt.includes('lodge') || lowerPrompt.includes('ski')) lodgingPref = 'hotel';

    // Detect trip type
    let tripType = 'golf trip';
    if (lowerPrompt.includes('bachelor')) tripType = 'bachelor party';

    return {
      prompt,
      region,
      groupSize,
      numRounds,
      marathonDay,
      origin,
      lodgingPref,
      tripType,
    };
  };

  const toggleCourse = (course) => {
    setSelectedCourses(prev => {
      const exists = prev.find(c => c.id === course.id);
      if (exists) {
        return prev.filter(c => c.id !== course.id);
      } else {
        return [...prev, course];
      }
    });
  };

  const selectLodging = (lodging) => {
    setSelectedLodging(lodging);
  };

  const planForMe = () => {
    // Auto-select courses based on numRounds (pick top-rated)
    const sortedCourses = [...courseOptions].sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
    const autoCourses = sortedCourses.slice(0, tripRequest.numRounds + (tripRequest.marathonDay ? 1 : 0));

    // Auto-select lodging based on preference
    let autoLodging;
    if (tripRequest.lodgingPref === 'rental' && rentalOptions.length > 0) {
      autoLodging = rentalOptions[0];
    } else if (tripRequest.lodgingPref === 'hotel' && hotelOptions.length > 0) {
      autoLodging = hotelOptions[0];
    } else {
      autoLodging = hotelOptions[0] || rentalOptions[0];
    }

    setSelectedCourses(autoCourses);
    setSelectedLodging(autoLodging);

    // Generate the trip
    generateTrip(autoCourses, autoLodging);
  };

  const buildMyTrip = () => {
    if (selectedCourses.length === 0) {
      alert('Please select at least one course');
      return;
    }
    if (!selectedLodging) {
      alert('Please select lodging');
      return;
    }
    generateTrip(selectedCourses, selectedLodging);
  };

  const generateTrip = (courses, lodging) => {
    const numDays = courses.length + 1; // Golf days + travel day
    const itinerary = [];

    // Day 1: Travel + maybe golf
    itinerary.push({
      day: 1,
      title: 'Arrival Day',
      activities: [
        { type: 'travel', description: `Drive from ${tripRequest.origin} to ${tripRequest.region}`, duration: '3-4 hours' },
        { type: 'checkin', description: `Check in at ${lodging.name}`, time: 'Afternoon' },
        { type: 'dinner', description: 'Group dinner & drinks', time: 'Evening' },
      ]
    });

    // Golf days
    courses.forEach((course, i) => {
      const dayNum = i + 2;
      const activities = [];

      if (tripRequest.marathonDay && i === 0) {
        // 36-hole day
        activities.push(
          { type: 'golf', description: `Morning round at ${course.name}`, time: '7:00 AM', course },
          { type: 'lunch', description: 'Quick lunch at the turn', time: '12:00 PM' },
          { type: 'golf', description: `Afternoon round at ${courses[1]?.name || course.name}`, time: '1:30 PM', course: courses[1] || course },
        );
      } else if (tripRequest.marathonDay && i === 1) {
        // Skip - handled above
        return;
      } else {
        activities.push(
          { type: 'golf', description: `Round at ${course.name}`, time: '8:30 AM', course },
          { type: 'drive', description: `${getRandomDriveTime()} drive back to lodging`, time: 'Afternoon' },
        );
      }

      activities.push({ type: 'dinner', description: 'Dinner & drinks', time: 'Evening' });

      itinerary.push({
        day: dayNum,
        title: `Day ${dayNum} - Golf`,
        activities,
      });
    });

    // Last day: Departure
    itinerary.push({
      day: numDays + 1,
      title: 'Departure Day',
      activities: [
        { type: 'checkout', description: `Check out of ${lodging.name}`, time: 'Morning' },
        { type: 'travel', description: `Drive back to ${tripRequest.origin}`, duration: '3-4 hours' },
      ]
    });

    // Calculate costs
    const golfCost = courses.reduce((sum, c) => sum + c.price_weekend, 0) * tripRequest.groupSize;
    const lodgingNights = numDays;
    const lodgingCost = lodging.price_per_night * lodgingNights;
    const totalCost = golfCost + lodgingCost;

    setFinalTrip({
      request: tripRequest,
      courses,
      lodging,
      itinerary: itinerary.filter(Boolean),
      costs: {
        golf: golfCost,
        lodging: lodgingCost,
        total: totalCost,
        perPerson: Math.round(totalCost / tripRequest.groupSize),
      },
      nights: lodgingNights,
    });

    setStep('trip');
  };

  const getRandomDriveTime = () => {
    const times = ['15 min', '20 min', '25 min', '30 min'];
    return times[Math.floor(Math.random() * times.length)];
  };

  const startOver = () => {
    setStep('options');
    setSelectedCourses([]);
    setSelectedLodging(null);
    setFinalTrip(null);
  };

  const copyTrip = async () => {
    if (!finalTrip) return;
    const text = `🏌️ ${tripRequest.tripType.toUpperCase()} - ${tripRequest.region}\n${tripRequest.groupSize} guys\n\n` +
      `COURSES:\n${finalTrip.courses.map(c => `• ${c.name} - $${c.price_weekend}`).join('\n')}\n\n` +
      `LODGING:\n• ${finalTrip.lodging.name} - $${finalTrip.lodging.price_per_night}/night\n\n` +
      `ESTIMATED COST: $${finalTrip.costs.perPerson}/person`;
    await navigator.clipboard.writeText(text);
    alert('Trip copied! Share it with the group.');
  };

  if (loading) {
    return (
      <div className="trip-results">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Finding the best options for your trip...</p>
        </div>
      </div>
    );
  }

  // STEP 1: Show options to select from
  if (step === 'options') {
    return (
      <div className="trip-results">
        <div className="trip-results-header">
          <div className="trip-badge">{tripRequest.tripType}</div>
          <h1>{tripRequest.region} Golf Trip</h1>
          <p className="trip-summary">
            {tripRequest.groupSize} guys · {tripRequest.numRounds} rounds · Driving from {tripRequest.origin}
            {tripRequest.marathonDay && ' · 36 holes in one day'}
          </p>
        </div>

        <div className="options-container">
          {/* Quick Action */}
          <div className="plan-for-me-section">
            <button className="btn btn-accent btn-large" onClick={planForMe}>
              ✨ Plan It For Me
            </button>
            <p>Auto-generate the best trip based on your preferences</p>
          </div>

          <div className="options-divider">
            <span>or build your own</span>
          </div>

          {/* Courses Section */}
          <section className="options-section">
            <h2>Pick Your Courses <span className="selection-count">{selectedCourses.length} selected</span></h2>
            <div className="options-grid">
              {courseOptions.map(course => (
                <div
                  key={course.id}
                  className={`option-card ${selectedCourses.find(c => c.id === course.id) ? 'selected' : ''}`}
                  onClick={() => toggleCourse(course)}
                >
                  <div className="option-card-header">
                    <h3>{course.name}</h3>
                    {course.rating && <span className="rating">★ {course.rating}</span>}
                  </div>
                  <p className="option-location">{course.city}, {course.state}</p>
                  <p className="option-details">{course.holes} holes · Par {course.par_total}</p>
                  <div className="option-price">${course.price_weekend}<span>/round</span></div>
                  <div className="option-check">{selectedCourses.find(c => c.id === course.id) ? '✓' : ''}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Hotels Section */}
          {hotelOptions.length > 0 && (
            <section className="options-section">
              <h2>Hotels & Resorts</h2>
              <div className="options-grid lodging-grid">
                {hotelOptions.map(lodge => (
                  <div
                    key={lodge.id}
                    className={`option-card lodging-card ${selectedLodging?.id === lodge.id ? 'selected' : ''}`}
                    onClick={() => selectLodging(lodge)}
                  >
                    <div className="option-card-header">
                      <h3>{lodge.name}</h3>
                      <span className="lodging-type">{lodge.type}</span>
                    </div>
                    <p className="option-location">{lodge.city}, {lodge.state}</p>
                    {lodge.sleeps && <p className="option-details">Sleeps {lodge.sleeps}</p>}
                    <div className="option-price">${lodge.price_per_night}<span>/night</span></div>
                    <div className="option-check">{selectedLodging?.id === lodge.id ? '✓' : ''}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Vacation Rentals Section */}
          {rentalOptions.length > 0 && (
            <section className="options-section">
              <h2>Vacation Rentals</h2>
              <div className="options-grid lodging-grid">
                {rentalOptions.map(lodge => (
                  <div
                    key={lodge.id}
                    className={`option-card lodging-card ${selectedLodging?.id === lodge.id ? 'selected' : ''}`}
                    onClick={() => selectLodging(lodge)}
                  >
                    <div className="option-card-header">
                      <h3>{lodge.name}</h3>
                      <span className="lodging-type">Rental</span>
                    </div>
                    <p className="option-location">{lodge.city}, {lodge.state}</p>
                    {lodge.sleeps && <p className="option-details">Sleeps {lodge.sleeps}</p>}
                    <div className="option-price">${lodge.price_per_night}<span>/night</span></div>
                    <div className="option-check">{selectedLodging?.id === lodge.id ? '✓' : ''}</div>
                  </div>
                ))}
              </div>
              <div className="external-links">
                <p>Need more options? Search for large group rentals:</p>
                <div className="external-buttons">
                  <a href={`https://www.vrbo.com/search?destination=${encodeURIComponent(tripRequest.region + ', New England')}&adults=${tripRequest.groupSize}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-small">Search VRBO</a>
                  <a href={`https://www.airbnb.com/s/${encodeURIComponent(tripRequest.region)}/homes?adults=${tripRequest.groupSize}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-small">Search Airbnb</a>
                </div>
              </div>
            </section>
          )}

          {/* Build Trip Button */}
          <div className="build-trip-section">
            <button
              className="btn btn-primary btn-large"
              onClick={buildMyTrip}
              disabled={selectedCourses.length === 0 || !selectedLodging}
            >
              Build My Trip →
            </button>
          </div>
        </div>

        <div className="trip-actions">
          <Link to="/" className="btn btn-outline">← Start Over</Link>
        </div>
      </div>
    );
  }

  // STEP 2: Show final trip
  return (
    <div className="trip-results">
      <div className="trip-results-header">
        <div className="trip-badge">{tripRequest.tripType}</div>
        <h1>Your {tripRequest.region} Trip</h1>
        <p className="trip-summary">
          {tripRequest.groupSize} guys · {finalTrip.nights} nights · {finalTrip.courses.length} rounds
        </p>
      </div>

      <div className="trip-sections">
        {/* Cost Summary */}
        <section className="trip-section cost-estimate">
          <h2>Trip Cost Estimate</h2>
          <div className="cost-breakdown">
            <div className="cost-row">
              <span>Golf ({finalTrip.courses.length} rounds × {tripRequest.groupSize} players)</span>
              <span>${finalTrip.costs.golf.toLocaleString()}</span>
            </div>
            <div className="cost-row">
              <span>Lodging ({finalTrip.nights} nights at {finalTrip.lodging.name})</span>
              <span>${finalTrip.costs.lodging.toLocaleString()}</span>
            </div>
            <div className="cost-row total">
              <span>Total</span>
              <span>${finalTrip.costs.total.toLocaleString()}</span>
            </div>
          </div>
          <div className="cost-per-person">
            <div className="amount">${finalTrip.costs.perPerson}</div>
            <div className="label">per person (before food & drinks)</div>
          </div>
        </section>

        {/* Itinerary */}
        <section className="trip-section">
          <h2>Day-by-Day Itinerary</h2>
          {finalTrip.itinerary.map((day, i) => (
            <div key={i} className="itinerary-day">
              <h3>{day.title}</h3>
              <div className="day-activities">
                {day.activities.map((activity, j) => (
                  <div key={j} className={`activity activity-${activity.type}`}>
                    <span className="activity-time">{activity.time || activity.duration}</span>
                    <span className="activity-desc">{activity.description}</span>
                    {activity.course && (
                      <span className="activity-price">${activity.course.price_weekend}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Selected Courses */}
        <section className="trip-section">
          <h2>Your Courses</h2>
          {finalTrip.courses.map(course => (
            <div key={course.id} className="course-suggestion">
              <div className="course-suggestion-info">
                <h4>{course.name}</h4>
                <p>{course.city}, {course.state} · {course.holes} holes · Par {course.par_total}</p>
              </div>
              <div className="course-suggestion-price">${course.price_weekend}</div>
            </div>
          ))}
        </section>

        {/* Lodging */}
        <section className="trip-section">
          <h2>Your Lodging</h2>
          <div className="lodging-option selected-lodging">
            <div className="lodging-option-info">
              <h4>{finalTrip.lodging.name}</h4>
              <p>{finalTrip.lodging.city}, {finalTrip.lodging.state} · {finalTrip.lodging.type}</p>
            </div>
            <div className="lodging-option-price">
              <span className="price">${finalTrip.lodging.price_per_night}</span>
              <span className="per-night">/night</span>
            </div>
          </div>
        </section>
      </div>

      <div className="trip-actions">
        <button className="btn btn-outline" onClick={startOver}>← Change Selections</button>
        <button className="btn btn-share" onClick={copyTrip}>Copy & Share</button>
        <button className="btn btn-primary" onClick={() => window.print()}>Print Trip</button>
      </div>
    </div>
  );
}

export default TripResults;
