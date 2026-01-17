const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  date: { type: String, required: true },
  present: { type: Boolean, default: false },
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

// Compound index to prevent duplicate attendance records
attendanceSchema.index({ studentId: 1, classId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
