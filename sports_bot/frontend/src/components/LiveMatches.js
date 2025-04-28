import React, { useEffect, useState } from 'react';

/**
 * Recursive component to render JSON data as collapsible sections.
 */
function JSONCollapsible({ data, name, path = '$' }) {
  const isObject = data && typeof data === 'object';
  const displayName = name !== undefined ? name : Array.isArray(data) ? 'Array' : 'Object';

  if (!isObject) {
    return (
      <div style={{ padding: '0.25em 0' }}>
        <strong>{displayName} ({path})</strong>: {String(data)}
      </div>
    );
  }

  const entries = Array.isArray(data)
    ? data.map((item, index) => [index, item])
    : Object.entries(data);

  return (
    <details style={{ margin: '0.25em 0', paddingLeft: '1em' }}>
      <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
        {displayName} ({path}) {Array.isArray(data) ? `[${data.length}]` : ''}
      </summary>
      <div style={{ marginTop: '0.5em' }}>
        {entries.map(([key, value]) => (
          <JSONCollapsible
            key={key}
            name={key}
            data={value}
            path={`${path}${Array.isArray(data) ? `[${key}]` : `.${key}`}`}
          />
        ))}
      </div>
    </details>
  );
}

export default LiveMatches;

const MAIN_TABS = ['merged', 'live', 'recent', 'teams', 'competition', 'country'];
const SUB_TABS = ['JSON', 'Parsed'];

function LiveMatches() {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);
  const [mainTab, setMainTab] = useState('live');
  const [subTab, setSubTab] = useState('JSON');

  useEffect(() => {
    fetch(`http://localhost:8000/${mainTab}`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => setMatches(data.results || []))
      .catch(err => setError(err.toString()));
  }, [mainTab]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5em', marginBottom: '1em' }}>
        {MAIN_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => { setMainTab(tab); setSubTab('JSON'); }}
            style={{
              padding: '0.5em 1em',
              background: mainTab === tab ? '#007bff' : '#e0e0e0',
              color: mainTab === tab ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.5em', marginBottom: '1em' }}>
        {SUB_TABS.map(view => (
          <button
            key={view}
            onClick={() => setSubTab(view)}
            style={{
              padding: '0.25em 0.75em',
              background: subTab === view ? '#28a745' : '#f0f0f0',
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
        Live Matches ({matches.length})
      </h1>
      {matches.length === 0 && <div>Loading {mainTab} matches...</div>}
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
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
            {match.id}
          </summary>
          <div style={{ marginTop: '0.5em', background: '#fff', padding: '1em' }}>
            {subTab === 'JSON' ? (
              <JSONCollapsible data={match} name={match.id} path={`$[${idx}]`} />
            ) : (
              <div> -   <p>Parsed view for {mainTab} - match {match.id}</p>
              </div>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
