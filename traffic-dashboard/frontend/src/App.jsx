import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

import Layout from './layouts/Layout';
import Overview from './pages/Overview';
import CrossAnalytics from './pages/CrossAnalytics';
import Infrastructure from './pages/Infrastructure';
import DataExplorer from './pages/DataExplorer';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [loading, setLoading] = useState(true);
  const [contextPayload, setContextPayload] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          overviewRes, anomaliesRes, crashesRes, heatmapRes, 
          wsRes, lcRes, hwrRes, ccRes,
          rdRes, intRes, algnRes, trafRes, monthlyRes, weatherTopRes
        ] = await Promise.all([
          axios.get(`${API_BASE}/stats/overview`),
          axios.get(`${API_BASE}/stats/anomalies`),
          axios.get(`${API_BASE}/crashes?limit=1000`), // Scaled limitation for baseline 24H mapping cleanly
          axios.get(`${API_BASE}/stats/heatmap`),
          axios.get(`${API_BASE}/stats/weather-severity`),
          axios.get(`${API_BASE}/stats/lighting-crashtype`),
          axios.get(`${API_BASE}/stats/hourly-weather-risk`),
          axios.get(`${API_BASE}/stats/control-cause`),
          axios.get(`${API_BASE}/stats/road-defect`),
          axios.get(`${API_BASE}/stats/intersection`),
          axios.get(`${API_BASE}/stats/alignment-crash`),
          axios.get(`${API_BASE}/stats/trafficway-ranking`),
          axios.get(`${API_BASE}/stats/monthly-trend`),
          axios.get(`${API_BASE}/stats/weather-crashes`)
        ]);

        const hist = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }));
        if (crashesRes.data) {
          crashesRes.data.forEach(c => {
            if (c.crash_hour >= 0 && c.crash_hour < 24) hist[c.crash_hour].count++;
          });
        }

        // Globalized State Memory Context natively injected into Router Outlet
        setContextPayload({
          overview: overviewRes.data,
          anomalies: anomaliesRes.data,
          heatmapData: heatmapRes.data,
          hourlyData: hist,
          monthlyTrend: monthlyRes.data,
          weatherCrashes: weatherTopRes.data,
          weatherSeverity: wsRes.data,
          lightingCrashType: lcRes.data,
          hourlyWeatherRisk: hwrRes.data,
          controlCause: ccRes.data,
          roadDefect: rdRes.data,
          intersection: intRes.data,
          alignmentCrash: algnRes.data,
          trafficwayRanking: trafRes.data
        });

      } catch (err) {
        console.error("Error fetching heavily aggregated matrix data payload:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !contextPayload) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{color: '#c9d1d9'}}>Booting Deep Analytical Correlators...</h2>
        <div style={{color: '#8b949e'}}>Running 12 synchronous MongoDB Pipelines natively</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout contextPayload={contextPayload} />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="analytics" element={<CrossAnalytics />} />
          <Route path="infrastructure" element={<Infrastructure />} />
          <Route path="explorer" element={<DataExplorer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
