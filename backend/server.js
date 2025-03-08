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

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Quiz App API',
    version: '1.0.0',
    status: 'active',
    documentation: {
      description: 'A full-featured quiz application API',
      endpoints: {
        auth: '/api/auth/*',
        quiz: '/api/quiz/*',
        admin: '/api/admin/*',
        leaderboard: '/api/leaderboard/*'
      },
      frontend: 'https://quiz-app-sand-alpha.vercel.app',
      repository: 'https://github.com/prabhaspaddana/quiz-app'
    }
  });
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 