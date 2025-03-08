import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrophyIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const API_URL = 'https://quiz-app-y3h8.onrender.com/api';
axios.defaults.baseURL = API_URL;

const QuizAttempt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, maxScore, percentage } = location.state || {};

  if (!location.state) {
    return (
      <div className="container-custom">
        <div className="text-center text-red-500 mt-8">
          <p>No quiz results found</p>
          <button
            onClick={() => navigate('/quizzes')}
            className="btn btn-primary mt-4"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card"
        >
          <div className="card-body text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <TrophyIcon className={`h-24 w-24 mx-auto ${
                percentage >= 80 ? 'text-yellow-500' :
                percentage >= 60 ? 'text-green-500' :
                'text-gray-500'
              }`} />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Quiz Results
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                {score}/{maxScore}
              </div>
              <div className="text-2xl text-gray-600 dark:text-gray-300">
                {percentage}% Correct
              </div>
              <div className="text-lg text-gray-500 dark:text-gray-400">
                {percentage >= 80 ? 'Excellent work! 🎉' :
                 percentage >= 60 ? 'Good job! 👍' :
                 'Keep practicing! 💪'}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12"
            >
              <button
                onClick={() => navigate('/quizzes')}
                className="btn btn-primary inline-flex items-center"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Quizzes
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizAttempt; 