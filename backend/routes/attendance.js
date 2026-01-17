const express = require('express');
const Attendance = require('../models/Attendance');
const { auth, isTeacherOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Get attendance by date
router.get('/date/:date', auth, async (req, res) => {
  try {
    const records = await Attendance.find({ date: req.params.date })
      .populate('studentId', 'firstName lastName')
      .populate('classId', 'name');
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get attendance by class and date
router.get('/class/:classId/date/:date', auth, async (req, res) => {
  try {
    const records = await Attendance.find({
      classId: req.params.classId,
      date: req.params.date
    }).populate('studentId', 'firstName lastName');
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student attendance history
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const records = await Attendance.find({ studentId: req.params.studentId })
      .sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark attendance (create or update)
router.post('/', auth, isTeacherOrAdmin, async (req, res) => {
  try {
    const { studentId, classId, date, present, notes } = req.body;
    
    const record = await Attendance.findOneAndUpdate(
      { studentId, classId, date },
      { present, notes },
      { new: true, upsert: true }
    );
    
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk mark attendance
router.post('/bulk', auth, isTeacherOrAdmin, async (req, res) => {
  try {
    const { classId, date, records } = req.body;
    
    const operations = records.map(r => ({
      updateOne: {
        filter: { studentId: r.studentId, classId, date },
        update: { present: r.present, notes: r.notes },
        upsert: true
      }
    }));
    
    await Attendance.bulkWrite(operations);
    res.json({ message: 'Attendance saved', count: records.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
