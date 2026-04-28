import React from 'react';
import { useOutletContext } from 'react-router-dom';
import OverviewCards from '../components/OverviewCards';
import HourlyAnomaliesChart from '../components/HourlyAnomaliesChart';
import WeatherChart from '../components/WeatherChart';
import MonthlyTrend from '../components/MonthlyTrend';
import SeverityPie from '../components/SeverityPie';

export default function Overview() {
  const { overview, hourlyData, anomalies, monthlyTrend, weatherCrashes } = useOutletContext();
  
  if (!overview) return null;

  return (
    <>
      <OverviewCards data={overview} />
      <div className="charts-grid" style={{ marginTop: '2rem' }}>
        <HourlyAnomaliesChart hourlyData={hourlyData} anomalies={anomalies} />
        <MonthlyTrend data={monthlyTrend} />
        <WeatherChart data={weatherCrashes} />
        <SeverityPie data={overview} />
      </div>
    </>
  );
}
