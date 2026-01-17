const express = require('express');
const Student = require('../models/Student');
const { auth, isTeacherOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all students
router.get('/', auth, async (req, res) => {
  try {
    const students = await Student.find().populate('classId', 'name');
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get students by class
router.get('/class/:classId', auth, async (req, res) => {
  try {
    const students = await Student.find({ classId: req.params.classId });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single student
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('classId', 'name');
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create student
router.post('/', auth, isTeacherOrAdmin, async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update student
router.put('/:id', auth, isTeacherOrAdmin, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete student
router.delete('/:id', auth, isTeacherOrAdmin, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
