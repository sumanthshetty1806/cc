import React, { useState } from 'react';
import axios from 'axios';
import RecordsTable from '../components/RecordsTable';

const API_BASE = 'http://localhost:5000/api';

export default function DataExplorer() {
  const [filters, setFilters] = useState({ weather: '', month: '', day: '', hour: '' });
  const [records, setRecords] = useState([]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fetchRecords = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.weather) queryParams.append('weather', filters.weather);
      if (filters.month) queryParams.append('month', filters.month);
      if (filters.day) queryParams.append('day', filters.day);
      if (filters.hour) queryParams.append('hour', filters.hour);

      const res = await axios.get(`${API_BASE}/crashes?${queryParams.toString()}`);
      setRecords(res.data);
    } catch (err) {
      console.error("API Retrieval for specific limits has explicitly failed:", err);
    }
  };

  return (
    <div>
      <h2 style={{ paddingLeft: '1rem', borderLeft: '4px solid #3fb950', marginBottom: '2rem' }}>Raw Data Explorer</h2>
      
      <div className="card" style={{ display: 'flex', flexDirection: 'row', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
        <input name="weather" placeholder="Weather (ex. CLEAR)" value={filters.weather} onChange={handleFilterChange} style={inputStyles} />
        <input name="month" type="number" placeholder="Month (1-12)" value={filters.month} onChange={handleFilterChange} style={inputStyles} />
        <input name="day" type="number" placeholder="Day (0-6)" value={filters.day} onChange={handleFilterChange} style={inputStyles} />
        <input name="hour" type="number" placeholder="Hour (0-23)" value={filters.hour} onChange={handleFilterChange} style={inputStyles} />
        <button onClick={fetchRecords} style={btnStyles}>Search Records</button>
      </div>

      {records && records.length > 0 ? (
        <RecordsTable records={records} />
      ) : (
        <div style={{ textAlign: 'center', color: '#8b949e', marginTop: '4rem', padding: '3rem', border: '1px dashed #30363d', borderRadius: '8px' }}>
           Enter explicit parameters and hit search to pull discrete raw structural rows directly from the MongoDB backend database!
        </div>
      )}
    </div>
  );
}

const inputStyles = {
  background: '#0d1117', border: '1px solid #30363d', color: '#c9d1d9',
  padding: '0.7rem 1.2rem', borderRadius: '6px', outline: 'none', fontSize: '1rem'
};

const btnStyles = {
  background: '#238636', color: '#ffffff', border: 'none', padding: '0.7rem 1.5rem',
  borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'all 0.2s'
};
