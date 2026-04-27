const express = require('express');
const router = express.Router();
const Crash = require('../models/Crash');

// Filtered GET route supporting query params for weather, month, day, and hour with a limit of 100 records
router.get('/', async (req, res) => {
    try {
        const query = {};
        
        // Map available query parameters to MongoDB fields
        if (req.query.weather) {
            query.weather_condition = new RegExp(req.query.weather, 'i');
        }
        if (req.query.month) {
            query.crash_month = Number(req.query.month);
        }
        if (req.query.day) {
            query.crash_day_of_week = Number(req.query.day);
        }
        if (req.query.hour) {
            query.crash_hour = Number(req.query.hour);
        }

        const crashes = await Crash.find(query).limit(100);
        res.json(crashes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
