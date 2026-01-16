import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { newEnglandCourses, newEnglandLodging, generateItinerary } from '../services/mockData';

function TripResults() {
  const navigate = useNavigate();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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
    const groupMatch = prompt.match(/(\d+)\s*(?:guys|people|players|friends|of us|men)/i);
    const groupSize = groupMatch ? parseInt(groupMatch[1]) : 8;

    // Detect number of rounds
    const roundsMatch = prompt.match(/(\d+)\s*(?:rounds?|games?)/i);
    const numRounds = roundsMatch ? parseInt(roundsMatch[1]) : 3;

    // Detect number of nights
    const nightsMatch = prompt.match(/(\d+)\s*(?:nights?|days?)/i);
    const numNights = nightsMatch ? parseInt(nightsMatch[1]) : 6;

    // Get courses for the region
    const regionCourses = newEnglandCourses.filter(c => c.region === region).slice(0, numRounds);
    if (regionCourses.length === 0) {
      // Fallback to random courses
      regionCourses.push(...newEnglandCourses.slice(0, numRounds));
    }

    // Get lodging for the region
    const regionLodging = newEnglandLodging.filter(l => l.region === region).slice(0, 3);
    if (regionLodging.length === 0) {
      regionLodging.push(...newEnglandLodging.slice(0, 3));
    }

    // Generate itinerary
    const itinerary = generateItinerary(regionCourses, startDate, numNights);

    // Calculate cost estimates
    const avgGreenFee = regionCourses.reduce((sum, c) => sum + c.price_weekday, 0) / regionCourses.length;
    const totalGolfCost = avgGreenFee * numRounds * groupSize;
    const avgLodgingPerNight = regionLodging[0]?.price_per_night || 200;
    const totalLodgingCost = avgLodgingPerNight * numNights;
    const estimatedTotal = totalGolfCost + totalLodgingCost;
    const perPersonCost = Math.round(estimatedTotal / groupSize);

    return {
      prompt,
      region,
      startDate,
      endDate,
      groupSize,
      numRounds,
      numNights,
      courses: regionCourses,
      lodging: regionLodging,
      itinerary,
      costs: {
        golf: Math.round(totalGolfCost),
        lodging: Math.round(totalLodgingCost),
        total: Math.round(estimatedTotal),
        perPerson: perPersonCost,
      },
    };
  };

  const handleShare = async () => {
    const shareText = `Golf Trip Plan: ${tripData.region}\n${tripData.groupSize} players · ${tripData.startDate} - ${tripData.endDate}\n\nCourses:\n${tripData.courses.map(c => `- ${c.name}`).join('\n')}\n\nEstimated cost: $${tripData.costs.perPerson}/person`;

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="trip-results">
        <div className="loading">
          <p>Researching your perfect golf trip...</p>
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
          {tripData.groupSize} players · {tripData.numRounds} rounds · {tripData.startDate} - {tripData.endDate}
        </p>
      </div>

      <div className="trip-sections">
        {/* Cost Estimate Section */}
        <section className="trip-section cost-estimate">
          <h2>Estimated Trip Cost</h2>
          <div className="cost-breakdown">
            <div className="cost-row">
              <span>Golf ({tripData.numRounds} rounds x {tripData.groupSize} players)</span>
              <span>${tripData.costs.golf.toLocaleString()}</span>
            </div>
            <div className="cost-row">
              <span>Lodging ({tripData.numNights} nights)</span>
              <span>${tripData.costs.lodging.toLocaleString()}</span>
            </div>
            <div className="cost-row total">
              <span>Total Estimate</span>
              <span>${tripData.costs.total.toLocaleString()}</span>
            </div>
          </div>
          <div className="cost-per-person">
            <div className="amount">${tripData.costs.perPerson.toLocaleString()}</div>
            <div className="label">per person</div>
          </div>
        </section>

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
                <p>{lodge.city}, {lodge.state} · {lodge.type} · Sleeps {lodge.sleeps || 'varies'}</p>
              </div>
              <div className="lodging-option-price">
                <span className="price">${lodge.price_per_night}</span>
                <span className="per-night">/night</span>
              </div>
            </div>
          ))}
        </section>
      </div>

      <div className="trip-actions">
        <Link to="/" className="btn btn-outline">
          Start Over
        </Link>
        <button className="btn btn-share" onClick={handleShare}>
          {copied ? 'Copied!' : 'Copy to Share'}
        </button>
        <button className="btn btn-primary" onClick={() => window.print()}>
          Print Trip Plan
        </button>
      </div>
    </div>
  );
}

export default TripResults;
