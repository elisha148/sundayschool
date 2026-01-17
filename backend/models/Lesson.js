const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  bibleVerse: String,
  objectives: [String],
  materials: [String],
  activities: [String],
  notes: String,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lesson', lessonSchema);
