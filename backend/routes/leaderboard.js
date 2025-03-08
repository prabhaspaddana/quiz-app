const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    // Aggregate scores by user
    const leaderboard = await Score.aggregate([
      {
        $group: {
          _id: '$userId',
          totalScore: { $sum: '$score' },
          totalMaxScore: { $sum: '$maxScore' },
          quizzesCompleted: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 1,
          username: '$user.username',
          totalScore: 1,
          totalMaxScore: 1,
          quizzesCompleted: 1,
          percentage: {
            $multiply: [
              { $divide: ['$totalScore', '$totalMaxScore'] },
              100
            ]
          }
        }
      },
      {
        $sort: { totalScore: -1 }
      }
    ]);

    // Add rank to each entry
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    res.json(rankedLeaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 