import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function JsonPage() {
  const { tab } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setData(null);
    setError(null);
    fetch(`http://localhost:8000/${tab}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.status);
        }
        return response.json();
      })
      .then(json => setData(json))
      .catch(err => setError(err.toString()));
  }, [tab]);

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{tab.charAt(0).toUpperCase() + tab.slice(1)} Data</h1>
      <pre style={{ background: '#f9f9f9', padding: '1em', overflowX: 'auto' }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

export default JsonPage;
