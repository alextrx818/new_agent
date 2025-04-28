import React, { useEffect, useState } from 'react';

/**
 * Recursive component to render JSON data as collapsible sections.
 */
function JSONCollapsible({ data, name, path = '$' }) {
  const isObject = data && typeof data === 'object';
  const displayName =
    name !== undefined
      ? name
      : Array.isArray(data)
      ? 'Array'
      : 'Object';

  if (!isObject) {
    return (
      <div style={{ padding: '0.25em 0' }}>
        <strong>
          {displayName} ({path})
        </strong>
        : {String(data)}
      </div>
    );
  }

  const entries = Array.isArray(data)
    ? data.map((item, index) => [index, item])
    : Object.entries(data);

  return (
    <details style={{ margin: '0.25em 0', paddingLeft: '1em' }}>
      <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
        {displayName} ({path}){' '}
        {Array.isArray(data) ? `[${data.length}]` : ''}
      </summary>
      <div style={{ marginTop: '0.5em' }}>
        {entries.map(([key, value]) => (
          <JSONCollapsible
            key={key}
            data={value}
            name={key}
            path={`${path}${
              Array.isArray(data) ? `[${key}]` : `.${key}`
            }`}
          />
        ))}
      </div>
    </details>
  );
}

const MAIN_TABS = [
  'Merged',
  'Live',
  'Recent',
  'Teams',
  'Competition',
  'Country'
];
const SUB_TABS = ['JSON', 'Parsed', 'UI Print'];

function LiveMatches() {
  const [mainTab, setMainTab] = useState('Live');
  const [subTab, setSubTab] = useState('JSON');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [lastFetchSuccess, setLastFetchSuccess] = useState(null);

  useEffect(() => {
    setError(null);
    const fetchData = () => {
      setMatches([]);
      fetch(`/${mainTab.toLowerCase()}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.status);
          }
          return response.json();
        })
        .then(data => {
          setMatches(data.results || []);
          const now = new Date().toISOString();
          setLastFetchTime(now);
          setLastFetchSuccess(true);
          console.log(`[LiveMatches] fetch successful at ${now}`);
        })
        .catch(err => {
          setError(err.toString());
          const now = new Date().toISOString();
          setLastFetchTime(now);
          setLastFetchSuccess(false);
          console.error(`[LiveMatches] fetch failed at ${now}`, err);
        });
    };
    fetchData();
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, [mainTab]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {/* Main tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5em',
          marginBottom: '1em'
        }}
      >
        {MAIN_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => {
              setMainTab(tab);
              setSubTab('JSON');
            }}
            style={{
              padding: '0.5em 1em',
              background:
                mainTab === tab ? '#007bff' : '#e0e0e0',
              color: mainTab === tab ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Sub tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5em',
          marginBottom: '1em'
        }}
      >
        {SUB_TABS.map(view => (
          <button
            key={view}
            onClick={() => setSubTab(view)}
            style={{
              padding: '0.25em 0.75em',
              background:
                subTab === view ? '#28a745' : '#f0f0f0',
              color: subTab === view ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {view}
          </button>
        ))}
      </div>

      <h1 style={{ marginBottom: '0.5em' }}>
        {mainTab} Matches ({matches.length}){' '}
        <span style={{ fontSize: '0.8em', color: '#666' }}>
          Last fetch: {lastFetchTime ? new Date(lastFetchTime).toLocaleString() : '...'} ({lastFetchSuccess === null ? '-' : lastFetchSuccess ? 'successful' : 'failed'})
        </span>
      </h1>
      {matches.length === 0 && (
        <div>Loading {mainTab} matches...</div>
      )}
      {matches.map((match, idx) => (
        <details
          key={match.id}
          style={{
            background: '#f9f9f9',
            padding: '0.5em',
            margin: '0.5em 0',
            borderRadius: '4px'
          }}
        >
          <summary
            style={{ cursor: 'pointer', fontWeight: 'bold' }}
          >
            {match.id}
          </summary>
          <div
            style={{
              marginTop: '0.5em',
              background: '#fff',
              padding: '1em'
            }}
          >
            {subTab === 'JSON' ? (
              <JSONCollapsible
                data={match}
                name={match.id}
                path={`$[${idx}]`}
              />
            ) : subTab === 'Parsed' ? (
              <JSONCollapsible
                data={(({ stats, incidents, tlive, ...rest }) => rest)(match)}
                name={match.id}
                path={`$[${idx}]`}
              />
            ) : subTab === 'UI Print' ? (
              <div style={{ padding: '1em', border: '1px solid #ddd', borderRadius: '4px', background: '#fafafa' }}>
                <p style={{ margin: '0.5em 0' }}>
                  <strong>Match Id:</strong> {match.id}
                </p>
                <p style={{ margin: '0.5em 0' }}>
                  <strong>Score:</strong> {match.score[2][0]} - {match.score[3][0]}
                </p>
                <p style={{ margin: '0.5em 0' }}>
                  <strong>Half Time:</strong> HT: {match.score[2][1]} - {match.score[3][1]}
                </p>
              </div>
            ) : null}
          </div>
        </details>
      ))}
    </div>
  );
}

export default LiveMatches;
