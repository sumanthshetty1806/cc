import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', crashes: 400 },
  { month: 'Feb', crashes: 300 },
  { month: 'Mar', crashes: 550 },
  { month: 'Apr', crashes: 450 },
  { month: 'May', crashes: 600 },
  { month: 'Jun', crashes: 700 },
];

export default function MonthlyTrend() {
  return (
    <div className="chart-card">
      <h3>Monthly Collision Trend</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
            <XAxis dataKey="month" stroke="#8b949e" />
            <YAxis stroke="#8b949e" />
            <Tooltip />
            <Line type="monotone" dataKey="crashes" stroke="#3fb950" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
