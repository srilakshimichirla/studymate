// server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// ========================================
// CORS
// ========================================

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://studymate-5.onrender.com'
];

app.use(cors({
    origin: function (origin, callback) {

        // Allow requests without origin
        // Example: Postman, mobile apps, etc.
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.log('❌ CORS blocked:', origin);
        return callback(new Error('Not allowed by CORS'));
    },

    credentials: true,

    methods: [
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'PATCH',
        'OPTIONS'
    ],

    allowedHeaders: [
        'Content-Type',
        'Authorization'
    ]
}));

// Handle preflight requests
app.options('*', cors());

// ========================================
// BODY PARSER
// ========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================================
// ROUTES
// ========================================

const authRoutes = require('./routes/auth');
const topicRoutes = require('./routes/topics');
const quizRoutes = require('./routes/quiz');

// Authentication
app.use('/api/auth', authRoutes);

// Topics
app.use('/api/topics', topicRoutes);

// Quiz
app.use('/api/quiz', quizRoutes);

// ========================================
// HEALTH CHECK
// ========================================

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'OK',
        message: 'AI StudyMate API is running',
        timestamp: new Date().toISOString()
    });
});

// ========================================
// 404 HANDLER
// ========================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
    });
});

// ========================================
// ERROR HANDLER
// ========================================

app.use((err, req, res, next) => {

    console.error('Error:', err.stack);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Something went wrong!'
    });
});

// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log('');
    console.log('========================================');
    console.log('🚀 AI StudyMate Server Started');
    console.log(`🚀 Port: ${PORT}`);
    console.log('📊 Database: MongoDB');
    console.log('🤖 Gemini AI');
    console.log('========================================');

    console.log('');
    console.log('📌 API Endpoints:');
    console.log('🔑 Auth:   /api/auth');
    console.log('📝 Topics: /api/topics');
    console.log('📊 Quiz:   /api/quiz');
    console.log('❤️ Health: /api/health');
    console.log('');

    console.log('🌐 Allowed Frontend:');
    console.log('https://studymate-5.onrender.com');
    console.log('');
});
