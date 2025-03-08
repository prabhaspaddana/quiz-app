# Quiz Application

A full-stack quiz application built with React.js, Node.js, Express, and MongoDB.

## Features

- User authentication (JWT)
- Multiple quiz types (single choice, multiple choice, true/false)
- Admin dashboard for quiz management
- Leaderboard system displaying user statistics
- Dark/Light mode support
- Responsive design for various devices
- Password strength indicator during registration
- Role-based access control for admin functionalities
- Error handling with clear messages for user actions
- Real-time score updates and feedback during quizzes
- Ability to add, edit, and delete quizzes and questions by admins

## Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- React Router
- Axios
- Context API

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

## Installation

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

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd ../frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Backend (Render)
1. Create a new Web Service on Render
2. Connect your repository
3. Configure environment variables
4. Deploy

## API Endpoints

### Authentication
- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - Login user

### Quiz
- **GET** `/api/quiz` - Get all quizzes
- **GET** `/api/quiz/:id` - Get quiz by ID
- **POST** `/api/quiz/:id/submit` - Submit quiz answers

### Admin
- **POST** `/api/admin/quiz` - Create new quiz (admin only)
- **PUT** `/api/admin/quiz/:id` - Update existing quiz (admin only)
- **DELETE** `/api/admin/quiz/:id` - Delete quiz (admin only)
- **GET** `/api/admin/leaderboard` - Get leaderboard (admin only)
- **GET** `/api/admin/scores` - Get all scores (admin only)
- **GET** `/api/admin/users` - Get all users (admin only)
- **PUT** `/api/admin/users/:id` - Update user role (admin only)
- **DELETE** `/api/admin/users/:id` - Delete user (admin only)

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

MIT 