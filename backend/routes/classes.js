const express = require('express');
const Class = require('../models/Class');
const { auth, isTeacherOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all classes
router.get('/', auth, async (req, res) => {
  try {
    const classes = await Class.find().populate('teacherIds', 'name email');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single class
router.get('/:id', auth, async (req, res) => {
  try {
    const classDoc = await Class.findById(req.params.id).populate('teacherIds', 'name email');
    if (!classDoc) return res.status(404).json({ error: 'Class not found' });
    res.json(classDoc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create class
router.post('/', auth, isTeacherOrAdmin, async (req, res) => {
  try {
    const classDoc = new Class({
      ...req.body,
      teacherIds: req.body.teacherIds || [req.user._id]
    });
    await classDoc.save();
    res.status(201).json(classDoc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update class
router.put('/:id', auth, isTeacherOrAdmin, async (req, res) => {
  try {
    const classDoc = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!classDoc) return res.status(404).json({ error: 'Class not found' });
    res.json(classDoc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete class
router.delete('/:id', auth, isTeacherOrAdmin, async (req, res) => {
  try {
    const classDoc = await Class.findByIdAndDelete(req.params.id);
    if (!classDoc) return res.status(404).json({ error: 'Class not found' });
    res.json({ message: 'Class deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
