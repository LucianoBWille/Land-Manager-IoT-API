const mongoose = require('mongoose');

// Modelo / Schema / Coleção
const MeasurementSchema = new mongoose.Schema({
  value: { type: String, required: true },
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Measurement', MeasurementSchema, 'measurement');