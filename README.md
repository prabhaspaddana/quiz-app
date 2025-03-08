# Quiz Application

A full-stack quiz application built with React.js, Node.js, Express, and MongoDB. This application allows users to take quizzes, track their progress, and includes an admin dashboard for quiz management.

## Live Demo
- Frontend (Vercel): https://quiz-app-sand-alpha.vercel.app
- Backend (Render): https://quiz-app-y3h8.onrender.com/api

## Features

- User Authentication
  - JWT-based authentication
  - Role-based access control (User/Admin)
  - Secure password storage with bcrypt
  - Password strength validation

- Quiz Management
  - Multiple quiz types (single choice, multiple choice, true/false)
  - Real-time score calculation
  - Progress tracking
  - Immediate feedback on answers

- Admin Dashboard
  - Comprehensive quiz management (CRUD operations)
  - User management
  - Score tracking
  - Performance analytics

- User Interface
  - Responsive design for all devices
  - Dark/Light mode support
  - Modern UI with Tailwind CSS
  - Smooth animations with Framer Motion
  - Intuitive navigation

## Tech Stack

### Frontend
- React.js 18 (Vite)
- Tailwind CSS for styling
- React Router v6 for navigation
- Axios for API requests
- Context API for state management
- Framer Motion for animations
- Heroicons for icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- CORS for cross-origin requests

## Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/prabhaspaddana/quiz-app.git
cd quiz-app
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

5. Start the development servers:

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

## Deployment

The application is deployed using the following services:

### Frontend (Vercel)
- Repository connected to Vercel for automatic deployments
- Environment variables configured in Vercel dashboard
- Build command: `npm run build`
- Output directory: `dist`

### Backend (Render)
- Web service configured on Render
- Environment variables set in Render dashboard
- Automatic deployments from main branch
- Database hosted on MongoDB Atlas

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Quiz Endpoints
- `GET /api/quiz` - Get all quizzes
- `GET /api/quiz/:id` - Get specific quiz
- `POST /api/quiz/:id/submit` - Submit quiz answers

### Admin Endpoints
- `POST /api/admin/quiz` - Create quiz
- `PUT /api/admin/quiz/:id` - Update quiz
- `DELETE /api/admin/quiz/:id` - Delete quiz
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/scores` - Get all scores

## Testing Credentials

### Admin Account
- Username: addedadmin
- Email   : addedadmin@gmail.com
- Password: Password@123

### User Account
- Username: addeduser
- Email   : addeduser@gmail.com
- Password: Password@123

## Repository Access
The private repository has been shared with:
- abhay_gond@vecros.com
- prime@vecros.com

## Future Enhancements
- Quiz categories and tags
- User profile customization
- Social sharing features
- Advanced analytics
- Quiz timer functionality
- Certificate generation

## Contact
For any queries regarding the application, please contact:
- Email: prabhaspaddana@gmail.com
- GitHub: https://github.com/prabhaspaddana 
