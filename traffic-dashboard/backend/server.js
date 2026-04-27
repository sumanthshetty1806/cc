require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import route definitions
const statsRoutes = require('./routes/stats');
const crashesRoutes = require('./routes/crashes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/traffic_dashboard';

// Database Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Register API Routes
app.use('/api/stats', statsRoutes);
app.use('/api/crashes', crashesRoutes);

// Server Instantiation
app.listen(PORT, () => {
    console.log(`Traffic Dashboard Backend listening on port ${PORT}`);
});
