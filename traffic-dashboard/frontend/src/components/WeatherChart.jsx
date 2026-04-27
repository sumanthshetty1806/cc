import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dummy data or fetch from backend
const data = [
  { weather: 'CLEAR', crashes: 4000 },
  { weather: 'RAIN', crashes: 3000 },
  { weather: 'SNOW', crashes: 2000 },
  { weather: 'CLOUDY', crashes: 2780 },
  { weather: 'FOG', crashes: 1890 },
];

export default function WeatherChart() {
  return (
    <div className="chart-card">
      <h3>Top Weather Conditions</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
            <XAxis type="number" stroke="#8b949e" />
            <YAxis dataKey="weather" type="category" stroke="#8b949e" width={80} />
            <Tooltip />
            <Bar dataKey="crashes" fill="#8957e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
