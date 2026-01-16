import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const examplePrompts = [
  "12 guys, Cape Cod, early August, 3 rounds",
  "Bachelor party in Vermont, need lodging",
  "Weekend trip to Maine, 6 players",
  "NH golf trip for 8, budget-friendly",
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
        <h1>Your AI <span>Golf Trip</span> Research Guide</h1>
        <p className="tagline">Planning a golf trip with the boys? We'll do the research for you.</p>
        <p className="subtitle">Just tell us what you're looking for - we'll find the courses, lodging, and build your itinerary.</p>
      </div>

      <form onSubmit={handleSubmit} className="prompt-container">
        <label className="prompt-label">Describe your trip</label>
        <textarea
          className="prompt-textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Example: We're 12 guys heading to Cape Cod the first week of August. Want to play 3-4 rounds at different courses. Looking for a big house or two nearby places that can fit everyone. Budget is around $150-200/person per day including golf and lodging. Driving from NYC."
        />
        <div className="prompt-footer">
          <span className="prompt-hint">Include group size, dates, region, and budget</span>
          <button
            type="submit"
            className="btn btn-primary btn-large"
            disabled={loading || !prompt.trim()}
          >
            {loading ? (
              <>
                <span className="spinner"></span> Researching...
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
