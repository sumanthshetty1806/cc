export default function OverviewCards({ data }) {
  if (!data) return null;

  return (
    <div className="overview-grid">
      <div className="card">
        <h3>Total Crashes</h3>
        <p className="value">{data.totalCrashes?.toLocaleString() || 0}</p>
      </div>
      <div className="card">
        <h3>Total Injuries</h3>
        <p className="value">{data.totalInjuries?.toLocaleString() || 0}</p>
      </div>
      <div className="card">
        <h3>Total Fatalities</h3>
        <p className="value" style={{ color: '#f85149' }}>{data.totalFatalities?.toLocaleString() || 0}</p>
      </div>
      <div className="card">
        <h3>Avg Units Involved</h3>
        <p className="value">{data.avgUnits ? data.avgUnits.toFixed(2) : 0}</p>
      </div>
    </div>
  );
}
