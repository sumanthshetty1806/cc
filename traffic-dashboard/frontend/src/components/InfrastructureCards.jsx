import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend, ResponsiveContainer,
  ComposedChart, Line
} from 'recharts';

// Global Severity Palettes handling native stacking mapping cleanly
const SEVERITY_COLORS = {
    'NO INDICATION OF INJURY': '#58a6ff',
    'NONINCAPACITATING INJURY': '#d2a8ff',
    'INCAPACITATING INJURY': '#ff7b72',
    'FATAL': '#f85149',
    'REPORTED, NOT EVIDENT': '#3fb950'
}

export default function InfrastructureCards({ roadDefect, intersection, alignmentCrash, trafficwayRanking }) {
  
  // 1. Target exactly dynamic keys mapped in the $facet intersection query bypassing native labels explicitly.
  const getSeverityKeys = () => {
    const keys = new Set();
    if(intersection) {
        intersection.forEach(item => {
          Object.keys(item).forEach(k => {
             if(k !== 'type' && k !== 'avg_units' && k !== 'total_type_crashes') keys.add(k);
          });
        });
    }
    return Array.from(keys);
  };
  const severityKeysIntersection = getSeverityKeys();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
      
      <div className="charts-grid">
          {/* Trafficway Danger Rankings Horizontal Component */}
          <div className="chart-card">
            <h3>Trafficway Danger Ranking</h3>
            <p style={{textAlign: 'center', margin: '0 0 1rem 0', fontSize: '0.8rem', color: '#8b949e'}}>Highest average casualties strictly per-incident occurrence</p>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={trafficwayRanking} layout="vertical" margin={{ top: 10, right: 30, left: 160, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis type="number" dataKey="avg_injuries" stroke="#8b949e" />
                  <YAxis dataKey="trafficway" type="category" stroke="#8b949e" tick={{fontSize: 10}} width={150} />
                  <ReTooltip contentStyle={{ backgroundColor: '#21262d', border: 'none', color: '#c9d1d9' }}/>
                  <Legend wrapperStyle={{ fontSize: '12px' }}/>
                  <Bar dataKey="avg_injuries" fill="#ff7b72" name="Avg Injuries/Crash" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Road Defect Impact - Vertical Danger Rate */}
          <div className="chart-card">
            <h3>Road Defect Impact Ratio</h3>
            <p style={{textAlign: 'center', margin: '0 0 1rem 0', fontSize: '0.8rem', color: '#8b949e'}}>Severity multiplier against mapped physical defects</p>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={roadDefect} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis dataKey="defect" stroke="#8b949e" tick={{fontSize: 10}} interval={0} angle={-15} textAnchor="end" />
                  <YAxis stroke="#8b949e" />
                  <ReTooltip contentStyle={{ backgroundColor: '#21262d', border: 'none', color: '#c9d1d9' }}/>
                  <Legend wrapperStyle={{ fontSize: '12px', marginTop: '10px' }}/>
                  <Bar dataKey="avg_injuries" fill="#d2a8ff" name="Avg Injuries/Crash" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
      </div>
      
      <div className="charts-grid">
          {/* Intersection Architecture Composed Stack */}
          <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
            <h3>Intersection vs Corridor Profile</h3>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <ComposedChart data={intersection} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis type="number" stroke="#8b949e" />
                  <YAxis dataKey="type" type="category" stroke="#8b949e" tick={{fontSize: 14, fontWeight: 'bold'}} width={130} />
                  <ReTooltip contentStyle={{ backgroundColor: '#21262d', border: 'none', color: '#c9d1d9' }}/>
                  <Legend verticalAlign="top" />
                  {severityKeysIntersection.map((key) => (
                    <Bar key={key} dataKey={key} stackId="a" fill={SEVERITY_COLORS[key] || '#8b949e'} />
                  ))}
                  {/* Floating transparent line mapping multi-unit mass explicitly overlapping native bars */}
                  <Line type="monotone" dataKey="avg_units" stroke="#ffffff" strokeWidth={3} dot={{r: 6}} name="Avg Vehicles Involved" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Alignment Severity Multipliers */}
          <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
            <h3>Alignment Danger Zone Multipliers</h3>
            <p style={{textAlign: 'center', margin: '0 0 1rem 0', fontSize: '0.8rem', color: '#8b949e'}}>Raw frequencies vs severity ratios plotting curve/hill impact</p>
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <ComposedChart data={alignmentCrash} margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
                  <CartesianGrid stroke="#30363d" strokeDasharray="3 3" />
                  <XAxis dataKey="label" stroke="#8b949e" tick={{fontSize: 9}} angle={-25} textAnchor="end" interval={0} />
                  <YAxis yAxisId="left" stroke="#58a6ff" />
                  <YAxis yAxisId="right" orientation="right" stroke="#f85149" />
                  <ReTooltip contentStyle={{ backgroundColor: '#21262d', border: 'none', color: '#c9d1d9' }}/>
                  <Legend verticalAlign="top" />
                  <Bar yAxisId="left" dataKey="total_crashes" barSize={25} fill="#58a6ff" name="Total Crashes"/>
                  <Line yAxisId="right" type="step" dataKey="injury_rate" stroke="#f85149" strokeWidth={4} name="Severity Risk Ratio" dot={{r: 4}} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
      </div>
      
    </div>
  );
}
