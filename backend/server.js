const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const adminRoutes = require('./routes/admin');
const leaderboardRoutes = require('./routes/leaderboard');

dotenv.config();

const app = express();

// Security Headers
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Middleware
app.use(cors({
  origin: [
    'https://quiz-app-git-master-prabhaspaddanas-projects.vercel.app',
    'https://quiz-app-sand-alpha.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log('MongoDB Connection Error:', err));

// API Documentation route
app.get('/api', (req, res) => {
  res.json({
    name: 'Quiz App API',
    version: '1.0.0',
    status: 'active',
    documentation: {
      description: 'A full-featured quiz application API',
      endpoints: {
        auth: {
          register: 'POST /api/auth/register',
          login: 'POST /api/auth/login',
          me: 'GET /api/auth/me'
        },
        quiz: {
          list: 'GET /api/quiz',
          single: 'GET /api/quiz/:id',
          submit: 'POST /api/quiz/:id/submit'
        },
        admin: {
          users: 'GET /api/admin/users',
          quizzes: 'GET /api/admin/quiz',
          scores: 'GET /api/admin/scores'
        },
        leaderboard: 'GET /api/leaderboard'
      },
      frontend: 'https://quiz-app-sand-alpha.vercel.app',
      repository: 'https://github.com/prabhaspaddana/quiz-app'
    },
    testCredentials: {
      admin: {
        username: 'admin',
        password: 'Admin@123'
      },
      user: {
        username: 'user',
        password: 'User@123'
      }
    }
  });
});

// Redirect root to API documentation
app.get('/', (req, res) => {
  res.redirect('/api');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    documentation: '/api'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 