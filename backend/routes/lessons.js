const express = require('express');
const Lesson = require('../models/Lesson');
const { auth, isTeacherOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all lessons
router.get('/', auth, async (req, res) => {
  try {
    const lessons = await Lesson.find().populate('classId', 'name').sort({ date: -1 });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get lessons by class
router.get('/class/:classId', auth, async (req, res) => {
  try {
    const lessons = await Lesson.find({ classId: req.params.classId }).sort({ date: -1 });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single lesson
router.get('/:id', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('classId', 'name');
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create lesson
router.post('/', auth, isTeacherOrAdmin, async (req, res) => {
  try {
    const lesson = new Lesson(req.body);
    await lesson.save();
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update lesson
router.put('/:id', auth, isTeacherOrAdmin, async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark lesson complete
router.patch('/:id/complete', auth, isTeacherOrAdmin, async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      { completed: true },
      { new: true }
    );
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete lesson
router.delete('/:id', auth, isTeacherOrAdmin, async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    res.json({ message: 'Lesson deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
