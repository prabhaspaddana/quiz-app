import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const API_URL = 'https://quiz-app-y3h8.onrender.com/api';
axios.defaults.baseURL = API_URL;

function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/quiz/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data && response.data.questions) {
          setQuiz(response.data);
          setAnswers(new Array(response.data.questions.length).fill(null));
        } else {
          setError('Quiz data is not available');
        }
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch quiz');
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleAnswerSelect = (answerIndex) => {
    const question = quiz.questions[currentQuestion];
    if (question.type === 'multiple') {
      setSelectedAnswers(prev => {
        if (prev.includes(answerIndex)) {
          return prev.filter(index => index !== answerIndex);
        } else {
          return [...prev, answerIndex].sort();
        }
      });
    } else {
      setSelectedAnswers([answerIndex]);
    }
  };

  const handleNextQuestion = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswers;
    setAnswers(newAnswers);

    if (currentQuestion === quiz.questions.length - 1) {
      handleQuizSubmit(newAnswers);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswers([]);
      setShowResult(false);
    }
  };

  const handleQuizSubmit = async (finalAnswers) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/quiz/${id}/submit`, 
        { answers: finalAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/quiz/${id}/attempt`, { 
        state: { 
          score: response.data.score,
          maxScore: response.data.maxScore,
          percentage: response.data.percentage
        } 
      });
    } catch (error) {
      setError('Failed to submit quiz');
    }
  };

  const checkAnswer = () => {
    if (selectedAnswers.length === 0) return;

    const question = quiz.questions[currentQuestion];
    let correct;
    
    if (question.type === 'multiple') {
      const sortedSelected = [...selectedAnswers].sort();
      const sortedCorrect = [...question.correctAnswers].sort();
      correct = JSON.stringify(sortedSelected) === JSON.stringify(sortedCorrect);
    } else {
      correct = selectedAnswers[0] === question.correctAnswers[0];
    }

    setIsCorrect(correct);
    setShowResult(true);
  };

  const question = quiz?.questions?.[currentQuestion];
  const progress = quiz ? ((currentQuestion + 1) / quiz.questions.length) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom">
        <div className="text-center text-red-500 mt-8">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!quiz || !question) {
    return (
      <div className="container-custom">
        <div className="text-center mt-8">
          <p>No quiz found or quiz has no questions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-200">
                  Progress
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-indigo-600 dark:text-indigo-200">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
            <div className="progress-bar">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="progress-bar-fill"
              ></motion.div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="card"
          >
            <div className="card-body">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {question.question}
              </h2>
              <div className="space-y-4">
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${
                      selectedAnswers.includes(index)
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                    } ${
                      showResult
                        ? question.correctAnswers.includes(index)
                          ? 'bg-green-50 border-green-500 dark:bg-green-900 dark:border-green-400'
                          : selectedAnswers.includes(index)
                          ? 'bg-red-50 border-red-500 dark:bg-red-900 dark:border-red-400'
                          : ''
                        : ''
                    }`}
                    disabled={showResult}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResult && (
                        <AnimatePresence>
                          {question.correctAnswers.includes(index) ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-green-500"
                            >
                              <CheckCircleIcon className="h-6 w-6" />
                            </motion.div>
                          ) : selectedAnswers.includes(index) ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-red-500"
                            >
                              <XCircleIcon className="h-6 w-6" />
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 flex justify-between">
                {!showResult ? (
                  <motion.button
                    onClick={checkAnswer}
                    disabled={selectedAnswers.length === 0}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Check Answer
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleNextQuestion}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-primary"
                  >
                    {currentQuestion === quiz.questions.length - 1
                      ? 'Finish Quiz'
                      : 'Next Question'}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Quiz; 