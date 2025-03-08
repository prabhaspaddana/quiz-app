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
  // Allow HTTPS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Security headers
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
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

// Base route handler
const apiDocumentation = {
  name: 'Quiz App API',
  version: '1.0.0',
  status: 'active',
  documentation: {
    description: 'A full-featured quiz application API',
    endpoints: {
      auth: {
        register: 'POST /auth/register',
        login: 'POST /auth/login',
        me: 'GET /auth/me'
      },
      quiz: {
        list: 'GET /quiz',
        single: 'GET /quiz/:id',
        submit: 'POST /quiz/:id/submit'
      },
      admin: {
        users: 'GET /admin/users',
        quizzes: 'GET /admin/quiz',
        scores: 'GET /admin/scores'
      },
      leaderboard: 'GET /leaderboard'
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
};

// Root routes
app.get('/', (req, res) => {
  res.json(apiDocumentation);
});

app.get('/api', (req, res) => {
  res.json(apiDocumentation);
});

// API Routes
app.use('/auth', authRoutes);
app.use('/quiz', quizRoutes);
app.use('/admin', adminRoutes);
app.use('/leaderboard', leaderboardRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: 'error',
    message: 'Something went wrong!',
    documentation: '/'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    status: 'error',
    message: 'Route not found',
    documentation: '/',
    availableEndpoints: apiDocumentation.documentation.endpoints
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 