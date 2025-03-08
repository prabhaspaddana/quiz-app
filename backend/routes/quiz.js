const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Score = require('../models/Score');
const { protect } = require('../middleware/auth');

// Get all quizzes
router.get('/', protect, async (req, res) => {
  try {
    const quizzes = await Quiz.find().select('title description questions');
    const quizzesWithCount = quizzes.map(quiz => ({
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      questionCount: quiz.questions.length
    }));
    res.json(quizzesWithCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get quiz by ID
router.get('/:quizId', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit quiz answers
router.post('/:quizId/submit', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const { answers } = req.body;
    let score = 0;
    const maxScore = quiz.questions.length;

    answers.forEach((answer, index) => {
      const question = quiz.questions[index];
      if (!question) return;

      if (question.type === 'single' || question.type === 'boolean') {
        // Convert both to numbers and compare
        const submittedAnswer = Number(answer);
        const correctAnswer = Number(question.correctAnswers[0]);
        if (!isNaN(submittedAnswer) && submittedAnswer === correctAnswer) {
          score++;
        }
      } else if (question.type === 'multiple') {
        if (Array.isArray(answer) && Array.isArray(question.correctAnswers)) {
          // Convert all answers to numbers and sort for comparison
          const submittedAnswers = answer.map(a => Number(a)).sort((a, b) => a - b);
          const correctAnswers = question.correctAnswers.map(a => Number(a)).sort((a, b) => a - b);
          
          if (submittedAnswers.length === correctAnswers.length &&
              submittedAnswers.every((a, i) => a === correctAnswers[i])) {
            score++;
          }
        }
      }
    });

    const userScore = await Score.create({
      userId: req.user._id,
      quizId: quiz._id,
      score,
      maxScore,
    });

    res.json({
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 