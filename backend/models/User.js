// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: [6, 'Password must be at least 6 characters'],
  },
  stats: {
    totalTopicsStudied: { type: Number, default: 0 },
    totalQuizzesTaken: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    weakAreas: { type: [String], default: [] },
  }
}, { timestamps: true });

// ✅ CORRECTED: Using async/await with NO next() parameter
userSchema.pre('save', async function() {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return;
  }
  
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);