const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Crash = require('../models/Crash');

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/traffic_dashboard';

const numericFields = [
  'num_units', 'injuries_total', 'injuries_fatal', 'injuries_incapacitating', 
  'injuries_non_incapacitating', 'injuries_reported_not_evident', 'injuries_no_indication', 
  'crash_hour', 'crash_day_of_week', 'crash_month',
  // Below are fallback checks using the truncated naming format from initial requests
  'injuries_to', 'injuries_fa', 'injuries_in', 'injuries_no', 'injuries_re', 'injuries_nc', 'crash_hou', 'crash_day'
];

async function importData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    console.log('Clearing the crashes collection...');
    await Crash.deleteMany({});
    console.log('Successfully cleared collection.');

    const results = [];
    const csvFilePath = path.join(__dirname, '../data/crashes.csv');

    console.log(`Starting to read constraints from ${csvFilePath}...`);

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        // Parse the crash_date array strictly if present
        if (row.crash_date) {
            row.crash_date = new Date(row.crash_date);
        }

        // Explicitly cast numeric fields using Number()
        for (const field of numericFields) {
          if (row[field] !== undefined && row[field] !== '') {
            row[field] = Number(row[field]);
          }
        }
        
        results.push(row);
      })
      .on('end', async () => {
        console.log(`Parsed ${results.length} rows from CSV. Starting insertion...`);
        try {
          // Batch insertion to avoid memory issues and document limits effectively
          const batchSize = 10000;
          for (let i = 0; i < results.length; i += batchSize) {
              const batch = results.slice(i, i + batchSize);
              await Crash.insertMany(batch);
              console.log(`Inserted records ${i + 1} to ${i + batch.length} of ${results.length}.`);
          }

          console.log(`Successfully completed import of ${results.length} records!`);
          process.exit(0);
        } catch (insertionError) {
          console.error('Error occurred during batch insertion to DB:', insertionError);
          process.exit(1);
        }
      })
      .on('error', (error) => {
          console.error('Error accessing/parsing the CSV data:', error);
          process.exit(1);
      });
  } catch (connectionErr) {
    console.error('Failed to establish MongoDB connection:', connectionErr);
    process.exit(1);
  }
}

importData();
