import React from 'react';

export default function Heatmap({ data }) {
  if (!data || data.length === 0) return null;

  // Flatten the 7x24 grid to find the absolute maximum frequency
  const allValues = data.flat();
  const maxVal = Math.max(...allValues, 1); // Clamp at 1 to prevent division-by-zero

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const cellSize = 20;
  const padding = 4;
  
  const width = 24 * (cellSize + padding) + 60; 
  const height = 7 * (cellSize + padding) + 40;

  return (
    <div className="chart-card heatmap-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h3>Crash Frequencies Heatmap</h3>
      <div style={{ overflowX: 'auto', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <svg width={width} height={height}>
          {/* X Axis Labels (Hours) */}
          {Array.from({ length: 24 }).map((_, h) => (
            <text 
              key={`h-${h}`} 
              x={60 + h * (cellSize + padding) + cellSize / 2} 
              y={15} 
              fill="#8b949e" 
              fontSize={10} 
              textAnchor="middle"
            >
              {h}
            </text>
          ))}
          
          {data.map((dayRow, dayIndex) => (
            <g key={`day-${dayIndex}`}>
              {/* Y Axis Label (Weekday) */}
              <text 
                x={0} 
                y={30 + dayIndex * (cellSize + padding) + cellSize / 2} 
                fill="#8b949e" 
                fontSize={12} 
                dominantBaseline="middle"
              >
                {days[dayIndex] || `Day ${dayIndex}`}
              </text>
              
              {/* Render SVGs dynamically via Heatmap Data Grid */}
              {dayRow.map((val, hourIndex) => {
                // Determine opacity based on peak
                const opacity = val / maxVal;
                // Native Red standard mapping (#f85149 is (248, 81, 73))
                return (
                  <rect
                    key={`cell-${dayIndex}-${hourIndex}`}
                    x={60 + hourIndex * (cellSize + padding)}
                    y={30 + dayIndex * (cellSize + padding)}
                    width={cellSize}
                    height={cellSize}
                    fill={`rgba(248, 81, 73, ${opacity})`}
                    stroke="#30363d"
                    strokeWidth={1}
                    rx={4}
                    ry={4}
                  >
                    <title>{`${days[dayIndex]}, ${hourIndex}:00 - Crashes: ${val}`}</title>
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
