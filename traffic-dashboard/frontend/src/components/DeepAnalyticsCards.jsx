import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend, ResponsiveContainer,
  ComposedChart, Line, AreaChart, Area
} from 'recharts';

// Unique color generator explicitly hashing weather/severity dynamic key iterations into strict hex codes
const generateColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
};

// Hardcoded safe severity palettes handling basic constants when mapped cleanly
const SEVERITY_COLORS = {
    'NO INDICATION OF INJURY': '#58a6ff',
    'NONINCAPACITATING INJURY': '#d2a8ff',
    'INCAPACITATING INJURY': '#ff7b72',
    'FATAL': '#f85149',
    'REPORTED, NOT EVIDENT': '#3fb950'
}

export default function DeepAnalyticsCards({ weatherSeverity, lightingCrashType, hourlyWeatherRisk, controlCause }) {
  
  // 1. Weather x Severity (Stacked Bar Key Mapping)
  const getSeverityKeys = () => {
    const keys = new Set();
    weatherSeverity.forEach(item => {
      Object.keys(item).forEach(k => {
         if(k !== 'weather') keys.add(k);
      });
    });
    return Array.from(keys);
  };
  const severityKeys = getSeverityKeys();

  // 3. Hourly Weather Risk (Line Chart Area Stack)
  const getRiskWeatherKeys = () => {
    const keys = new Set();
    hourlyWeatherRisk.forEach(item => {
      Object.keys(item).forEach(k => {
         if(k !== 'hour') keys.add(k);
      });
    });
    return Array.from(keys);
  };
  const riskWeatherKeys = getRiskWeatherKeys();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
      
      <div className="charts-grid">
          {/* Weather x Severity Stacked Bar */}
          <div className="chart-card">
            <h3>Weather × Injury Severity Breakdown</h3>
            <p style={{textAlign: 'center', margin: '0 0 1rem 0', fontSize: '0.8rem', color: '#8b949e'}}>Raw frequencies cross-tabulated</p>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={weatherSeverity} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis dataKey="weather" stroke="#8b949e" tick={{fontSize: 10}} />
                  <YAxis stroke="#8b949e" />
                  <ReTooltip contentStyle={{ backgroundColor: '#21262d', border: 'none', color: '#c9d1d9' }}/>
                  <Legend wrapperStyle={{ fontSize: '12px' }}/>
                  {severityKeys.map((key) => (
                    <Bar key={key} dataKey={key} stackId="a" fill={SEVERITY_COLORS[key] || generateColor(key)} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hour x Weather Combined Risk Score */}
          <div className="chart-card">
            <h3>Hourly Risk Score by Weather</h3>
            <p style={{textAlign: 'center', margin: '0 0 1rem 0', fontSize: '0.8rem', color: '#8b949e'}}>Injuries divided by Crash Counts explicitly mapped across hours</p>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <AreaChart data={hourlyWeatherRisk} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis dataKey="hour" stroke="#8b949e" />
                  <YAxis stroke="#8b949e" />
                  <ReTooltip contentStyle={{ backgroundColor: '#21262d', border: 'none', color: '#c9d1d9' }}/>
                  <Legend wrapperStyle={{ fontSize: '10px' }}/>
                  {riskWeatherKeys.map((key) => (
                    <Area 
                      key={key} 
                      type="monotone" 
                      dataKey={key} 
                      stackId="1" 
                      stroke={generateColor(key)} 
                      fill={generateColor(key)} 
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
      </div>
      
      <div className="charts-grid">
          {/* Traffic Control x Primary Cause */}
          <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
            <h3>Top Causes at Monitored Intersections (Signaled)</h3>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={controlCause} layout="vertical" margin={{ top: 5, right: 30, left: 200, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis type="number" stroke="#8b949e" />
                  <YAxis dataKey="cause" type="category" stroke="#8b949e" tick={{fontSize: 10}} width={190} />
                  <ReTooltip contentStyle={{ backgroundColor: '#21262d', border: 'none', color: '#c9d1d9' }}/>
                  <Legend />
                  <Bar dataKey="count" fill="#d2a8ff" name="Crash Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Lighting x Crash Type Injury Rate */}
          <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
            <h3>Lighting × Crash Type (Injury Multiplier Risk)</h3>
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <ComposedChart data={lightingCrashType} margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
                  <CartesianGrid stroke="#30363d" strokeDasharray="3 3" />
                  <XAxis dataKey="type" stroke="#8b949e" tick={{fontSize: 9}} angle={-25} textAnchor="end" interval={0} />
                  <YAxis yAxisId="left" stroke="#58a6ff" />
                  <YAxis yAxisId="right" orientation="right" stroke="#ff7b72" />
                  <ReTooltip contentStyle={{ backgroundColor: '#21262d', border: 'none', color: '#c9d1d9' }}/>
                  <Legend verticalAlign="top" />
                  <Bar yAxisId="left" dataKey="total_crashes" barSize={25} fill="#58a6ff" name="Total Crashes"/>
                  <Line yAxisId="right" type="monotone" dataKey="injury_rate" stroke="#ff7b72" strokeWidth={3} name="Avg Injuries Per Crash (Risk)" dot={{r: 4}} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
      </div>
      
    </div>
  );
}
