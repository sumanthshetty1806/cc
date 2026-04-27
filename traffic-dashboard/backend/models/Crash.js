const mongoose = require('mongoose');

const crashSchema = new mongoose.Schema({
  crash_date: { type: Date },
  traffic_control_device: { type: String },
  weather_condition: { type: String },
  lighting_condition: { type: String },
  first_crash_type: { type: String },
  trafficway_type: { type: String },
  alignment: { type: String },
  roadway_surface_cond: { type: String },
  road_defect: { type: String },
  crash_type: { type: String },
  intersection_related_i: { type: String },
  damage: { type: String },
  prim_contributory_cause: { type: String },
  num_units: { type: Number },
  most_severe_injury: { type: String },
  injuries_total: { type: Number },
  injuries_fatal: { type: Number },
  injuries_incapacitating: { type: Number },
  injuries_non_incapacitating: { type: Number },
  injuries_reported_not_evident: { type: Number },
  injuries_no_indication: { type: Number },
  crash_hour: { type: Number },
  crash_day_of_week: { type: Number },
  crash_month: { type: Number }
}, {
  timestamps: true,
  strict: false // Allows for fields that might have different names (like truncated ones)
});

module.exports = mongoose.model('Crash', crashSchema);
