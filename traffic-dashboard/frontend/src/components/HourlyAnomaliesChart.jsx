import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function HourlyAnomaliesChart({ hourlyData, anomalies }) {
  // Extract hours that are considered anomalous from the anomalies array
  const anomalyHours = new Set(anomalies.map(a => a.hour));

  return (
    <div className="chart-card">
      <h3>Crashes by Hour (Anomalies in Red)</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={hourlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
            <XAxis dataKey="hour" stroke="#8b949e" />
            <YAxis stroke="#8b949e" />
            <Tooltip contentStyle={{ backgroundColor: '#21262d', border: 'none', color: '#c9d1d9' }}/>
            <Bar dataKey="count">
              {hourlyData.map((entry, index) => {
                // Special Logic for Chart 1: If hour is in anomaly list, color red. Else blue.
                const isAnomaly = anomalyHours.has(entry.hour);
                return <Cell key={`cell-${index}`} fill={isAnomaly ? '#f85149' : '#58a6ff'} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
