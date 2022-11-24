const mongoose = require('mongoose');

// Modelo / Schema / Coleção
const DeviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: String, required: true },
    type: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Device', DeviceSchema, 'device');