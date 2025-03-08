const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  questions: [{
    question: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['single', 'multiple', 'boolean'],
      default: 'single',
    },
    options: [{
      type: String,
      required: true,
    }],
    correctAnswers: [{
      type: Number,
      required: true,
    }],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Quiz', quizSchema); 