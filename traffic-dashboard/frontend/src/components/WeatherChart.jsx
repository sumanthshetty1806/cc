import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function WeatherChart({ data }) {
  return (
    <div className="chart-card">
      <h3 style={{marginBottom: '5px'}}>Top Weather Conditions</h3>
      <p style={{margin: '0 0 15px 0', fontSize: '0.8rem', color: '#8b949e', textAlign: 'center'}}>Logarithmic Scale Calibration</p>
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
            <XAxis type="number" scale="log" domain={['auto', 'auto']} tickFormatter={(tick) => tick.toLocaleString()} stroke="#8b949e" />
            <YAxis dataKey="weather" type="category" interval={0} tick={{ fontSize: 10 }} stroke="#8b949e" width={90} />
            <Tooltip formatter={(value) => value.toLocaleString()} />
            <Bar dataKey="crashes" fill="#8957e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
