import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#58a6ff', '#f85149', '#3fb950', '#a371f7'];

export default function SeverityPie({ data }) {
  // Utilizing the overview data for a simple breakdown if provided, or fallback data
  const pieData = [
    { name: 'No Injury', value: data?.totalCrashes ? data.totalCrashes - data.totalInjuries - data.totalFatalities : 400 },
    { name: 'Injury', value: data?.totalInjuries || 300 },
    { name: 'Fatalities', value: data?.totalFatalities || 50 }
  ];

  return (
    <div className="chart-card">
      <h3>Crash Severity Breakdown</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ color: '#c9d1d9' }}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
