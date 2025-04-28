import React, { useEffect, useState } from 'react';

/**
 * Recursive component to render JSON data as collapsible sections.
 */
function JSONCollapsible({ data, name }) {
  const isObject = data && typeof data === 'object';
  const displayName = name !== undefined ? name : Array.isArray(data) ? 'Array' : 'Object';

  if (!isObject) {
    // Primitive value
    return (
      <div style={{ padding: '0.25em 0' }}>
        <strong>{displayName}:</strong> {String(data)}
      </div>
    );
  }

  const entries = Array.isArray(data)
    ? data.map((item, index) => [index, item])
    : Object.entries(data);

  return (
    <details style={{ margin: '0.25em 0', paddingLeft: '1em' }}>
      <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
        {displayName} {Array.isArray(data) ? `[${data.length}]` : ''}
      </summary>
      <div style={{ marginTop: '0.5em' }}>
        {entries.map(([key, value]) => (
          <JSONCollapsible key={key} name={key} data={value} />
        ))}
      </div>
    </details>
  );
}

function LiveMatches() {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/live')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setMatches(data.results))
      .catch(error => setError(error.toString()));
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Live Matches</h1>
      {matches.length === 0 ? (
        <div>Loading matches...</div>
      ) : (
        matches.map(match => (
          <details
            key={match.id}
            style={{
              background: '#f9f9f9',
              padding: '0.5em',
              margin: '0.5em 0',
              borderRadius: '4px'
            }}
          >
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              {match.id}
            </summary>
            <div style={{ marginTop: '0.5em', background: '#fff', padding: '1em' }}>
              <JSONCollapsible data={match} />
            </div>
          </details>
        ))
      )}
    </div>
  );
}

export default LiveMatches;
