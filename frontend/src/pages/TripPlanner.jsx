import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const examplePrompts = [
  "Weekend trip to Cape Cod",
  "Vermont golf getaway",
  "Maine coastal courses",
  "Bachelor party in NH",
];

function TripPlanner() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);

    // Simulate AI processing (in production, this would call an AI API)
    setTimeout(() => {
      // Store the prompt and navigate to results
      sessionStorage.setItem('tripPrompt', prompt);
      navigate('/trip-results');
    }, 1500);
  };

  const handleExampleClick = (example) => {
    setPrompt(example);
  };

  return (
    <div className="trip-planner">
      <div className="trip-planner-hero">
        <h1>Plan Your Golf Trip</h1>
        <p className="tagline">Tell us about your dream golf getaway</p>
        <p className="subtitle">We'll find the best courses and lodging in New England</p>
      </div>

      <form onSubmit={handleSubmit} className="prompt-container">
        <label className="prompt-label">Describe your trip</label>
        <textarea
          className="prompt-textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Example: We're 6 guys heading to Vermont August 4th-10th. Want to play 3 rounds of golf, maybe 2 at one course if it's great. Looking to stay somewhere near Killington with a hot tub. Driving from Boston, so no flights needed. Budget is around $200/night for lodging."
        />
        <div className="prompt-footer">
          <span className="prompt-hint">Include dates, group size, location preferences, and budget</span>
          <button
            type="submit"
            className="btn btn-primary btn-large"
            disabled={loading || !prompt.trim()}
          >
            {loading ? (
              <>
                <span className="spinner"></span> Planning...
              </>
            ) : (
              'Plan My Trip'
            )}
          </button>
        </div>
      </form>

      <div className="example-prompts">
        <h3>Try an example</h3>
        <div className="example-chips">
          {examplePrompts.map((example, i) => (
            <button
              key={i}
              type="button"
              className="example-chip"
              onClick={() => handleExampleClick(example)}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TripPlanner;
