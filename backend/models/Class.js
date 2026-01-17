const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ageGroup: { type: String, required: true },
  teacherIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  schedule: String,
  room: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Class', classSchema);
