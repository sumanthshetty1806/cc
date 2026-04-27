import React from 'react';

export default function RecordsTable({ records }) {
  if (!records || records.length === 0) return null;

  return (
    <div className="chart-card" style={{ gridColumn: '1 / -1', overflowX: 'auto', padding: '1.5rem' }}>
      <h3>Filtered Crash Records (Max 100)</h3>
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', color: '#c9d1d9', minWidth: '700px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #30363d' }}>
            <th style={{ padding: '0.75rem', color: '#58a6ff' }}>Crash Date</th>
            <th style={{ padding: '0.75rem', color: '#58a6ff' }}>Weather</th>
            <th style={{ padding: '0.75rem', color: '#58a6ff' }}>Lighting</th>
            <th style={{ padding: '0.75rem', color: '#58a6ff' }}>Primary Cause</th>
            <th style={{ padding: '0.75rem', color: '#f85149' }}>Injuries</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={record._id || index} style={{ borderBottom: '1px solid #161b22', background: index % 2 === 0 ? '#0d1117' : '#161b22' }}>
              <td style={{ padding: '0.75rem' }}>{new Date(record.crash_date).toLocaleString()}</td>
              <td style={{ padding: '0.75rem' }}>{record.weather_condition || 'N/A'}</td>
              <td style={{ padding: '0.75rem' }}>{record.lighting_condition || 'N/A'}</td>
              <td style={{ padding: '0.75rem' }}>{record.prim_contributory_cause || 'N/A'}</td>
              <td style={{ padding: '0.75rem' }}>{record.injuries_total || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
