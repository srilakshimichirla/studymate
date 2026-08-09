// routes/topics.js
const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');
const auth = require('../middleware/auth');

// All routes need authentication
router.use(auth);

// Routes
router.post('/generate', topicController.generateTopicNotes);
router.get('/', topicController.getTopics);
router.get('/:id', topicController.getTopic);

module.exports = router;