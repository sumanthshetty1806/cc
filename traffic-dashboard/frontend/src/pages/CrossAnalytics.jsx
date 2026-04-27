import React from 'react';
import { useOutletContext } from 'react-router-dom';
import DeepAnalyticsCards from '../components/DeepAnalyticsCards';
import Heatmap from '../components/Heatmap';

export default function CrossAnalytics() {
  const { heatmapData, weatherSeverity, lightingCrashType, hourlyWeatherRisk, controlCause } = useOutletContext();

  return (
    <div>
      <h2 style={{ paddingLeft: '1rem', borderLeft: '4px solid #d2a8ff', marginBottom: '2rem' }}>Correlation & Cross-Dimensional Analytics</h2>
      
      {/* Bringing the Heatmap out of the congested overview specifically into the Matrix Analytics tab! */}
      <div className="charts-grid" style={{ marginBottom: '2rem' }}>
         <Heatmap data={heatmapData} />
      </div>

      <DeepAnalyticsCards 
          weatherSeverity={weatherSeverity}
          lightingCrashType={lightingCrashType}
          hourlyWeatherRisk={hourlyWeatherRisk}
          controlCause={controlCause}
      />
    </div>
  );
}
