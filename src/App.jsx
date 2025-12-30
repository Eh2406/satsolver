import { useState } from 'react';
import useSat from './useSat';

const API_URL = 'http://localhost:3001/api';

const App = () => {
  const [results, args, setArgs] = useSat();

  return (
    <div className="app">
      <h1>Custody Solver</h1>

      <div>
        <label>
          Number of Results:
          <input
            type="number"
            value={args.numberOfResults}
            onChange={(e) => setArgs({ ...args, numberOfResults: parseInt(e.target.value) })}
            min="1"
            max="100"
          />
        </label>
      </div>

      {results.stillWorking && (
        <div><h2>Still loading</h2></div>
      )}

      {(results.results.length || results.stillWorking) && (
        <div>
          <h2>Results ({results.results.length}{results.stillWorking ? " + ?" : ""})</h2>
          {results.results.map((result, index) => (
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
      {!results.results.length && !results.stillWorking && (
        <div>
          <h2>Results (0)</h2>
          Unsat: No result to display.
        </div>
      )}
    </div>
  );
}

export default App;
