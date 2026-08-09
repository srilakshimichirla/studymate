// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes - No authentication needed
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes - Authentication required
router.get('/me', auth, authController.getMe);

module.exports = router;