const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Score = require('../models/Score');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// Create quiz (admin only)
router.post('/quiz', protect, authorize('admin'), async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', protect, authorize('admin'), async (req, res) => {
  try {
    const leaderboard = await Score.find()
      .populate('userId', 'username')
      .populate('quizId', 'title')
      .sort('-score')
      .limit(10);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all scores
router.get('/scores', protect, authorize('admin'), async (req, res) => {
  try {
    const scores = await Score.find()
      .populate('userId', 'username')
      .populate('quizId', 'title')
      .sort('-completedAt');
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update quiz
router.put('/quiz/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete quiz
router.delete('/quiz/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    // Delete associated scores
    await Score.deleteMany({ quizId: req.params.id });
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users (admin only)
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user (admin only)
router.put('/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { username, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, role },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete user (admin only)
router.delete('/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Delete associated scores
    await Score.deleteMany({ userId: req.params.id });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 