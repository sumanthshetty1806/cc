import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import OverviewCards from './components/OverviewCards';
import HourlyAnomaliesChart from './components/HourlyAnomaliesChart';
import WeatherChart from './components/WeatherChart';
import MonthlyTrend from './components/MonthlyTrend';
import SeverityPie from './components/SeverityPie';
import Heatmap from './components/Heatmap';
import RecordsTable from './components/RecordsTable';
import DeepAnalyticsCards from './components/DeepAnalyticsCards';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [overview, setOverview] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  
  // Matrix Tracking States Maps
  const [weatherSeverity, setWeatherSeverity] = useState([]);
  const [lightingCrashType, setLightingCrashType] = useState([]);
  const [hourlyWeatherRisk, setHourlyWeatherRisk] = useState([]);
  const [controlCause, setControlCause] = useState([]);

  // React State Hook defining filter logic for crashes fetching functionality
  const [filters, setFilters] = useState({ weather: '', month: '', day: '', hour: '' });
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewRes, anomaliesRes, crashesRes, heatmapRes, wsRes, lcRes, hwrRes, ccRes] = await Promise.all([
          axios.get(`${API_BASE}/stats/overview`),
          axios.get(`${API_BASE}/stats/anomalies`),
          axios.get(`${API_BASE}/crashes?limit=1000`), // Only used to sample hour densities purely statically as alternative
          axios.get(`${API_BASE}/stats/heatmap`),
          axios.get(`${API_BASE}/stats/weather-severity`),
          axios.get(`${API_BASE}/stats/lighting-crashtype`),
          axios.get(`${API_BASE}/stats/hourly-weather-risk`),
          axios.get(`${API_BASE}/stats/control-cause`)
        ]);

        setOverview(overviewRes.data);
        setAnomalies(anomaliesRes.data);
        setHeatmapData(heatmapRes.data);
        setWeatherSeverity(wsRes.data);
        setLightingCrashType(lcRes.data);
        setHourlyWeatherRisk(hwrRes.data);
        setControlCause(ccRes.data);

        // Mock default scale or process baseline densities from available bulk fetches simply for the bar chart
        const hist = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }));
        if (crashesRes.data) {
          crashesRes.data.forEach(c => {
            if (c.crash_hour >= 0 && c.crash_hour < 24) hist[c.crash_hour].count++;
          });
        }
        setHourlyData(hist);
      } catch (err) {
        console.error("Error fetching comprehensive data payload:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#c9d1d9' }}>Loading Dashboard Environment...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Traffic Analysis Dashboard</h1>
      </header>

      {/* Dynamic Filter Query Sub-Bar */}
      <div className="card" style={{ display: 'flex', flexDirection: 'row', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <input
          name="weather"
          placeholder="Weather (ex. CLEAR)"
          value={filters.weather}
          onChange={handleFilterChange}
          style={inputStyles}
        />
        <input
          name="month" type="number"
          placeholder="Month (1-12)"
          value={filters.month}
          onChange={handleFilterChange}
          style={inputStyles}
        />
        <input
          name="day" type="number"
          placeholder="DayOfWeek (0-6)"
          value={filters.day}
          onChange={handleFilterChange}
          style={inputStyles}
        />
        <input
          name="hour" type="number"
          placeholder="Hour (0-23)"
          value={filters.hour}
          onChange={handleFilterChange}
          style={inputStyles}
        />
        <button onClick={fetchRecords} style={btnStyles}>View Records</button>
      </div>

      <OverviewCards data={overview} />

      <div className="charts-grid">
        <HourlyAnomaliesChart hourlyData={hourlyData} anomalies={anomalies} />
        <Heatmap data={heatmapData} />
        <WeatherChart />
        <MonthlyTrend />
        <SeverityPie data={overview} />

        {records && records.length > 0 && <RecordsTable records={records} />}
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ paddingLeft: '1rem', borderLeft: '4px solid #d2a8ff' }}>Correlation & Cross-Dimensional Analytics</h2>
        <DeepAnalyticsCards 
          weatherSeverity={weatherSeverity}
          lightingCrashType={lightingCrashType}
          hourlyWeatherRisk={hourlyWeatherRisk}
          controlCause={controlCause}
        />
      </div>

    </div>
  );
}

// Small UI definitions for inputs statically
const inputStyles = {
  background: '#0d1117',
  border: '1px solid #30363d',
  color: '#c9d1d9',
  padding: '0.7rem 1.2rem',
  borderRadius: '6px',
  outline: 'none',
  fontSize: '1rem'
};

const btnStyles = {
  background: '#238636',
  color: '#ffffff',
  border: 'none',
  padding: '0.7rem 1.5rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '1rem'
};

export default App;
