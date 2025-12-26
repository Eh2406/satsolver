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
        response.data.results.sort((a, b) => a.transitions - b.transitions);
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

  const fromatRes = (result) => {
    let out = [];

    for (let day = 0; day < 42; day++) {
      let cust = result.custody[day] == '1';
      let work = result.work[day] == '1';
      if (cust) {
        out.push("S");
        console.assert(!work);
      } else if (work) {
        out.push("w");
      } else {
        out.push("c");
      }
    }
    return out;
  }

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
                <strong>Calendar:</strong>
                <br></br>
                <pre style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(7, 1fr)', columnGap: '3px', rowGap: '2px', backgroundColor: '#333', border: '2px solid #333', margin: '10px' }}>
                  {"s m t w t f s".split(" ").map(day => (
                    <div style={{ backgroundColor: '#fff', padding: `5px` }}>
                      {day}
                    </div>
                  )
                  )}
                  {fromatRes(result).map(day => (
                    <div style={{ backgroundColor: day === 'S' ? '#833' : day === 'w' ? '#383' : '#388', padding: `5px` }}>
                      {day}
                    </div>
                  )
                  )}
                </pre>
                <pre style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(7, 1fr)', columnGap: '3px', rowGap: '2px', backgroundColor: '#333', border: '2px solid #333', margin: '10px' }}>
                  {"s m t w t f s".split(" ").map(day => (
                    <div style={{ backgroundColor: '#fff', padding: `5px` }}>
                      {day}
                    </div>
                  )
                  )}
                  {fromatRes(result).map(day => (
                    <div style={{ backgroundColor: day !== 'S' ? '#777' : '#fff', padding: `5px` }}>
                      {day}
                    </div>
                  )
                  )}
                </pre>
                <pre style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(7, 1fr)', columnGap: '3px', rowGap: '2px', backgroundColor: '#333', border: '2px solid #333', margin: '10px' }}>
                  {"s m t w t f s".split(" ").map(day => (
                    <div style={{ backgroundColor: '#fff', padding: `5px` }}>
                      {day}
                    </div>
                  )
                  )}
                  {fromatRes(result).map(day => (
                    <div style={{ backgroundColor: day === 'w' ? '#383' : '#fff', padding: `5px` }}>
                      {day}
                    </div>
                  )
                  )}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )
      }
    </div >
  );
}

export default App;
