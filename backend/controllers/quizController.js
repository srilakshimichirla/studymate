// controllers/quizController.js
const QuizAttempt = require('../models/QuizAttempt');
const Topic = require('../models/Topic');
const { generateQuiz, generateFeedback } = require('../services/geminiService');

// Generate quiz questions
const generateQuizQuestions = async (req, res) => {
  try {
    const { topicId, numQuestions = 5 } = req.body;

    const topic = await Topic.findOne({
      _id: topicId,
      user: req.user._id
    });

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    // Generate quiz using Gemini
    const questions = await generateQuiz(topic.name, topic.difficulty, numQuestions);

    res.json({
      success: true,
      data: {
        topicId: topic._id,
        topicName: topic.name,
        difficulty: topic.difficulty,
        questions
      }
    });
  } catch (error) {
    console.error('Generate Quiz Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate quiz'
    });
  }
};

// Submit quiz and get results
const submitQuiz = async (req, res) => {
  try {
    const { topicId, answers, questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Questions not provided or invalid'
      });
    }

    const topic = await Topic.findOne({
      _id: topicId,
      user: req.user._id
    });

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    // Evaluate answers
    let score = 0;
    const weakAreas = [];
    const evaluatedQuestions = questions.map((q, index) => {
      const userAnswer = answers && answers[index] !== undefined ? answers[index] : '';
      const isCorrect = userAnswer === q.correctAnswer;
      
      if (isCorrect) {
        score++;
      } else {
        const concept = q.question.split('?')[0].slice(0, 50);
        weakAreas.push(concept);
      }
      
      return {
        ...q,
        userAnswer,
        isCorrect
      };
    });

    const totalQuestions = questions.length;
    const percentage = (score / totalQuestions) * 100;

    // Update topic mastery
    topic.masteryLevel = Math.min(100, (topic.masteryLevel || 0) + (percentage / 10));
    topic.timesStudied += 1;
    await topic.save();

    // Save quiz attempt
    const quizAttempt = await QuizAttempt.create({
      user: req.user._id,
      topic: topic._id,
      topicName: topic.name,
      difficulty: topic.difficulty,
      questions: evaluatedQuestions,
      score,
      totalQuestions,
      percentage,
      weakAreas: weakAreas.slice(0, 5)
    });

    // Update user stats
    req.user.stats.totalQuizzesTaken += 1;
    req.user.stats.averageScore = 
      ((req.user.stats.averageScore * (req.user.stats.totalQuizzesTaken - 1)) + percentage) / 
      req.user.stats.totalQuizzesTaken;
    
    if (weakAreas.length > 0) {
      req.user.stats.weakAreas = [...new Set([...req.user.stats.weakAreas, ...weakAreas])];
    }
    
    await req.user.save();

    // Generate feedback
    const feedback = await generateFeedback(topic.name, score, totalQuestions, weakAreas.slice(0, 3));

    res.json({
      success: true,
      data: {
        score,
        totalQuestions,
        percentage,
        weakAreas: weakAreas.slice(0, 5),
        questions: evaluatedQuestions,
        feedback,
        quizAttemptId: quizAttempt._id,
        masteryLevel: topic.masteryLevel
      }
    });
  } catch (error) {
    console.error('Submit Quiz Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit quiz'
    });
  }
};

// Get quiz history
const getQuizHistory = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: {
        attempts,
        stats: {
          totalQuizzes: attempts.length,
          averageScore: req.user.stats.averageScore || 0,
          weakAreas: req.user.stats.weakAreas || []
        }
      }
    });
  } catch (error) {
    console.error('Get Quiz History Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  generateQuizQuestions,
  submitQuiz,
  getQuizHistory
};