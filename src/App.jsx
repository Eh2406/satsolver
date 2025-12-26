import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const App = () => {
  const [numberOfResults, setNumberOfResults] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSolve = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_URL}/solve`, {
        numberOfResults,
        workingDays: [],
        nonWorkingDays: [],
        shanonDays: [],
        chaimDays: []
      });
      
      if (response.data.success) {
        setResults(response.data.results);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Custody Solver</h1>
      
      <div>
        <label>
          Number of Results:
          <input
            type="number"
            value={numberOfResults}
            onChange={(e) => setNumberOfResults(parseInt(e.target.value))}
            min="1"
            max="100"
          />
        </label>
        <button onClick={handleSolve} disabled={loading}>
          {loading ? 'Solving...' : 'Solve'}
        </button>
      </div>

      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      {results && (
        <div>
          <h2>Results ({results.length})</h2>
          {results.map((result, index) => (
            <div key={index} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
              <h3>Solution {index + 1}</h3>
              <p>Transitions: {result.transitions}</p>
              <div>
                <strong>Custody:</strong>
                <pre>{JSON.stringify(result.custody, null, 2)}</pre>
              </div>
              <div>
                <strong>Work:</strong>
                <pre>{JSON.stringify(result.work, null, 2)}</pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
