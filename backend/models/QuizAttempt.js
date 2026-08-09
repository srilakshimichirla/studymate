// models/QuizAttempt.js
const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  topicName: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  questions: [{
    question: String,
    options: [String],
    correctAnswer: String,
    explanation: String,
    userAnswer: String,
    isCorrect: Boolean
  }],
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  percentage: { type: Number, required: true },
  weakAreas: { type: [String], default: [] },
  feedback: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);