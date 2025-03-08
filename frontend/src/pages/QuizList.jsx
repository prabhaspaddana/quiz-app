import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AcademicCapIcon, ClockIcon } from '@heroicons/react/24/outline';

const API_URL = 'https://quiz-app-y3h8.onrender.com';
axios.defaults.baseURL = API_URL;

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/quiz', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizzes(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch quizzes');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom flex justify-center items-center">
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom">
        <div className="text-center text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="container-custom">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">Available Quizzes</h1>
        <p className="text-lg text-hr-gray dark:text-gray-300">
          Choose from our collection of quizzes and test your knowledge
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz, index) => (
          <motion.div
            key={quiz._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="card h-full hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <AcademicCapIcon className="h-8 w-8 text-hr-green" />
                  <span className="flex items-center text-sm text-hr-gray dark:text-gray-300">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {quiz.questionCount} questions
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">{quiz.title}</h3>
                <p className="text-hr-gray dark:text-gray-300 mb-4">{quiz.description}</p>
                <Link
                  to={`/quiz/${quiz._id}`}
                  className="btn btn-primary w-full"
                >
                  Start Quiz
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {quizzes.length === 0 && (
        <div className="text-center text-hr-gray dark:text-gray-300">
          No quizzes available at the moment.
        </div>
      )}
    </div>
  );
}

export default QuizList; 