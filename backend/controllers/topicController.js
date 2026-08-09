// controllers/topicController.js
const Topic = require('../models/Topic');
const { generateNotes } = require('../services/geminiService');

// Generate notes for a topic
const generateTopicNotes = async (req, res) => {
  try {
    const { topic, difficulty = 'beginner' } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a topic'
      });
    }

    // Generate notes using Gemini
    const notes = await generateNotes(topic, difficulty);

    // Save to database
    const newTopic = await Topic.create({
      user: req.user._id,
      name: topic,
      difficulty,
      notes,
      summary: notes.split('\n').slice(0, 5).join(' ').substring(0, 200) + '...'
    });

    // Update user stats
    req.user.stats.totalTopicsStudied += 1;
    await req.user.save();

    res.status(201).json({
      success: true,
      data: {
        topic: newTopic,
        notes
      }
    });
  } catch (error) {
    console.error('Generate Notes Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate notes'
    });
  }
};

// Get all topics for a user
const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: topics
    });
  } catch (error) {
    console.error('Get Topics Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get a single topic
const getTopic = async (req, res) => {
  try {
    const topic = await Topic.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    res.json({
      success: true,
      data: topic
    });
  } catch (error) {
    console.error('Get Topic Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  generateTopicNotes,
  getTopics,
  getTopic
};