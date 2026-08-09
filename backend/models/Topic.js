// models/Topic.js
const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Topic name is required'],
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  notes: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    default: ''
  },
  keyConcepts: {
    type: [String],
    default: []
  },
  masteryLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  timesStudied: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Topic', topicSchema);