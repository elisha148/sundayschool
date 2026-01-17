const express = require('express');
const Event = require('../models/Event');
const { auth, isTeacherOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all events
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get upcoming events
router.get('/upcoming', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const events = await Event.find({ date: { $gte: today } }).sort({ date: 1 }).limit(10);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get events by date
router.get('/date/:date', auth, async (req, res) => {
  try {
    const events = await Event.find({ date: req.params.date });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create event
router.post('/', auth, isTeacherOrAdmin, async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update event
router.put('/:id', auth, isTeacherOrAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete event
router.delete('/:id', auth, isTeacherOrAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
