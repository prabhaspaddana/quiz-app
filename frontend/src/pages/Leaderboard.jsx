import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { TrophyIcon } from '@heroicons/react/24/outline';

axios.defaults.baseURL = 'https://quiz-app-y3h8.onrender.com/api';

function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/scores', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Process scores to get user statistics
      const userStats = response.data.reduce((acc, score) => {
        const userId = score.userId._id;
        if (!acc[userId]) {
          acc[userId] = {
            username: score.userId.username,
            totalQuizzes: 0,
            totalScore: 0,
            totalMaxScore: 0,
            lastAttempt: score.completedAt
          };
        }
        acc[userId].totalQuizzes += 1;
        acc[userId].totalScore += score.score;
        acc[userId].totalMaxScore += score.maxScore;
        acc[userId].lastAttempt = new Date(Math.max(new Date(acc[userId].lastAttempt), new Date(score.completedAt)));
        return acc;
      }, {});

      // Convert to array and calculate percentages
      const leaderboardData = Object.values(userStats)
        .map(user => ({
          ...user,
          percentage: Math.round((user.totalScore / user.totalMaxScore) * 100) || 0
        }))
        .sort((a, b) => b.percentage - a.percentage);

      setScores(leaderboardData);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch leaderboard data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom min-h-[calc(100vh-4rem)]">
        <div className="text-center text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 min-h-[calc(100vh-4rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card"
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-8">
            <TrophyIcon className="h-12 w-12 text-yellow-500 mr-4" />
            <h1 className="text-3xl font-bold text-center dark:text-white">Leaderboard</h1>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quizzes Taken</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Percentage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Attempt</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {scores.map((score, index) => (
                  <tr key={index} className={index < 3 ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {score.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {score.totalQuizzes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {score.totalScore}/{score.totalMaxScore}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {score.percentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(score.lastAttempt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Leaderboard; 