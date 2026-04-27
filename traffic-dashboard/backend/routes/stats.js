const express = require('express');
const router = express.Router();
const Crash = require('../models/Crash');

// /overview: Sum of crashes, injuries, fatalities, and average units.

router.get('/overview', async (req, res) => {
    try {
        const stats = await Crash.aggregate([
            {
                $group: {
                    _id: null,
                    totalCrashes: { $sum: 1 },
                    totalInjuries: { $sum: '$injuries_total' },
                    totalFatalities: { $sum: '$injuries_fatal' },
                    avgUnits: { $avg: '$num_units' }
                }
            },
            {
                $project: {
                    _id: 0
                }
            }
        ]);
        res.json(stats[0] || { totalCrashes: 0, totalInjuries: 0, totalFatalities: 0, avgUnits: 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// /anomalies: Group by crash_hour (crash_hou). Calculate mean/std of crash counts.
// Calculate Z-Score and return only hours where Z > 2.
router.get('/anomalies', async (req, res) => {
    try {
        const anomalies = await Crash.aggregate([
            // 1. Group by hour to get count
            {
                $group: {
                    _id: '$crash_hour',
                    count: { $sum: 1 }
                }
            },
            {
                $match: { _id: { $ne: null } }
            },
            // 2. Global group for mean and standard deviation
            {
                $group: {
                    _id: null,
                    hourlyData: { $push: { hour: '$_id', count: '$count' } },
                    meanCount: { $avg: '$count' },
                    stdDevCount: { $stdDevPop: '$count' }
                }
            },
            // 3. Unwind back to item level
            {
                $unwind: '$hourlyData'
            },
            // 4. Calculate Z-Scores
            {
                $project: {
                    _id: 0,
                    hour: '$hourlyData.hour',
                    count: '$hourlyData.count',
                    mean: '$meanCount',
                    stdDev: '$stdDevCount',
                    zScore: {
                        $cond: [
                            { $eq: ['$stdDevCount', 0] },
                            0, // If standard deviation is 0, z-score is essentially 0 
                            { $divide: [ { $subtract: ['$hourlyData.count', '$meanCount'] }, '$stdDevCount' ] }
                        ]
                    }
                }
            },
            // 5. Keep anomalies
            {
                $match: {
                    zScore: { $gt: 2 }
                }
            },
            {
                $sort: { hour: 1 }
            }
        ]);

        res.json(anomalies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// /heatmap: Generate a 2D array [7][24] representing [crash_day][crash_hou] frequencies
router.get('/heatmap', async (req, res) => {
    try {
        const heatmapData = await Crash.aggregate([
            {
                $match: {
                    crash_day_of_week: { $ne: null },
                    crash_hour: { $ne: null }
                }
            },
            {
                $group: {
                    _id: {
                        day: '$crash_day_of_week',
                        hour: '$crash_hour'
                    },
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Initialize an empty 7x24 grid representing day x hour
        const grid = Array.from({ length: 7 }, () => Array(24).fill(0));
        
        heatmapData.forEach(item => {
            const d = item._id.day;
            const h = item._id.hour;
            // Standardizing 1-7 day scheme (common in CSV) to 0-6 array bounds, keeping raw if already 0-6
            const dayIndex = (d >= 1 && d <= 7) ? d - 1 : d;
            
            if (dayIndex >= 0 && dayIndex < 7 && h >= 0 && h < 24) {
               grid[dayIndex][h] = item.count;
            }
        });

        res.json(grid);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// /top-causes: Top 10 prim_cont values sorted by count.
router.get('/top-causes', async (req, res) => {
    try {
        const topCauses = await Crash.aggregate([
            {
                $group: {
                    _id: '$prim_contributory_cause',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 10
            },
            {
                $project: {
                    _id: 0,
                    cause: '$_id',
                    count: 1
                }
            }
        ]);
        res.json(topCauses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// /weather-severity: Cross-tab of weather_condition vs most_severe_injury
router.get('/weather-severity', async (req, res) => {
    try {
        const data = await Crash.aggregate([
            {
                $match: {
                    weather_condition: { $nin: [null, ''] },
                    most_severe_injury: { $nin: [null, ''] }
                }
            },
            {
                $group: {
                    _id: { weather: '$weather_condition', severity: '$most_severe_injury' },
                    count: { $sum: 1 }
                }
            }
        ]);
        const formatted = {};
        data.forEach(item => {
            const w = item._id.weather;
            const s = item._id.severity;
            if (!formatted[w]) formatted[w] = { weather: w };
            formatted[w][s] = item.count;
        });
        res.json(Object.values(formatted));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// /lighting-crashtype: lighting_condition vs crash_type + injury_rate
router.get('/lighting-crashtype', async (req, res) => {
    try {
        const data = await Crash.aggregate([
            {
                $match: {
                    lighting_condition: { $nin: [null, ''] },
                    crash_type: { $nin: [null, ''] }
                }
            },
            {
                $group: {
                    _id: { lighting: '$lighting_condition', type: '$crash_type' },
                    total_crashes: { $sum: 1 },
                    total_injuries: { $sum: '$injuries_total' }
                }
            },
            {
                $project: {
                    _id: 0,
                    lighting: '$_id.lighting',
                    type: '$_id.type',
                    total_crashes: 1,
                    total_injuries: 1,
                    injury_rate: {
                        $cond: [
                            { $eq: ['$total_crashes', 0] },
                            0, // Safe calculation blocks divide by zero natively
                            { $divide: ['$total_injuries', '$total_crashes'] }
                        ]
                    }
                }
            },
            { $sort: { total_crashes: -1 } },
            { $limit: 30 }
        ]);
        
        // Flatten nested strings safely into Recharts native values
        const payload = data.map(o => ({
            ...o,
            injury_rate: Number(o.injury_rate.toFixed(2)),
            type: `${o.type} (${o.lighting})`
        }));
        
        res.json(payload);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// /hourly-weather-risk: (hour, weather) pair compute injuries_total / crash_count
router.get('/hourly-weather-risk', async (req, res) => {
    try {
        const data = await Crash.aggregate([
            {
                $match: {
                    crash_hour: { $ne: null },
                    weather_condition: { $nin: [null, ''] }
                }
            },
            {
                $group: {
                    _id: { hour: '$crash_hour', weather: '$weather_condition' },
                    crash_count: { $sum: 1 },
                    total_injuries: { $sum: '$injuries_total' }
                }
            },
            {
                $project: {
                    _id: 0,
                    hour: '$_id.hour',
                    weather: '$_id.weather',
                    crash_count: 1,
                    riskScore: {
                        $cond: [
                            { $eq: ['$crash_count', 0] },
                            0,
                            { $divide: ['$total_injuries', '$crash_count'] }
                        ]
                    }
                }
            }
        ]);
        
        const formatted = {};
        data.forEach(item => {
            const h = item.hour;
            const w = item.weather;
            if (!formatted[h]) formatted[h] = { hour: h };
            // Ensure minimum threshold explicitly clipping statistical anomalies (e.g. 1 crash, 5 injuries)
            if (item.crash_count >= 5) {
                formatted[h][w] = Number(item.riskScore.toFixed(3));
            }
        });
        
        const result = Array.from({ length: 24 }).map((_, i) => formatted[i] || { hour: i });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// /control-cause: traffic_con vs prim_cont filtering specifically for traffic signals
router.get('/control-cause', async (req, res) => {
    try {
        const data = await Crash.aggregate([
            {
                $match: {
                    traffic_control_device: { $in: ['TRAFFIC SIGNAL', 'STOP SIGN/FLASHER'] },
                    prim_contributory_cause: { $nin: [null, '', 'UNABLE TO DETERMINE'] }
                }
            },
            {
                $group: {
                    _id: { device: '$traffic_control_device', cause: '$prim_contributory_cause' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            {
                $project: {
                    _id: 0,
                    cause: '$_id.cause',
                    count: 1
                }
            },
            { $limit: 15 }
        ]);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
