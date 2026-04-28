import React from 'react';

export default function Heatmap({ data }) {
  if (!data || data.length === 0) return null;

  const allValues = data.flat();
  const maxVal = Math.max(...allValues, 1);

  const yLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const cellSize = 15;
  const padding = 3;
  
  const width = 31 * (cellSize + padding) + 60; 
  const height = 12 * (cellSize + padding) + 40;

  return (
    <div className="chart-card heatmap-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h3 style={{marginBottom: '5px'}}>Yearly Calendar Heatmap</h3>
      <p style={{margin: '0 0 15px 0', fontSize: '0.8rem', color: '#8b949e'}}>Horizontal axis directly maps Calendar Dates of the month (1-31)</p>
      <div style={{ overflowX: 'auto', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <svg width={width} height={height}>
          {/* X Axis Labels (Days of Month) */}
          {Array.from({ length: 31 }).map((_, d) => (
            <text 
              key={`d-${d}`} 
              x={60 + d * (cellSize + padding) + cellSize / 2} 
              y={15} 
              fill="#8b949e" 
              fontSize={10} 
              textAnchor="middle"
            >
              {d + 1}
            </text>
          ))}
          
          {data.map((monthRow, mIndex) => (
            <g key={`month-${mIndex}`}>
              {/* Y Axis Label (Months) */}
              <text 
                x={0} 
                y={30 + mIndex * (cellSize + padding) + cellSize / 2} 
                fill="#8b949e" 
                fontSize={12} 
                dominantBaseline="middle"
              >
                {yLabels[mIndex] || `Month ${mIndex + 1}`}
            </text>
              
              {/* Render SVGs dynamically via Heatmap Data Grid */}
              {monthRow.map((val, dIndex) => {
                const opacity = val / maxVal;
                return (
                  <rect
                    key={`cell-${mIndex}-${dIndex}`}
                    x={60 + dIndex * (cellSize + padding)}
                    y={30 + mIndex * (cellSize + padding)}
                    width={cellSize}
                    height={cellSize}
                    fill={`rgba(248, 81, 73, ${opacity})`}
                    stroke="#30363d"
                    strokeWidth={1}
                    rx={2}
                    ry={2}
                  >
                    <title>{`${yLabels[mIndex]} ${dIndex + 1} - Crashes: ${val}`}</title>
                  </rect>
                );
              })}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
