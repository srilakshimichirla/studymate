// routes/quiz.js
const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const auth = require('../middleware/auth');

// All routes need authentication
router.use(auth);

// Routes
router.post('/generate', quizController.generateQuizQuestions);
router.post('/submit', quizController.submitQuiz);
router.get('/history', quizController.getQuizHistory);

module.exports = router;