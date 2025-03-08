import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  AcademicCapIcon, 
  ChartBarIcon, 
  TrophyIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

function Home() {
  const { user } = useAuth();

  return (
    <div className="container-custom">
      <div className="text-center mb-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-6xl md:text-7xl font-bold mb-8 dark:text-white"
        >
          Test Your Knowledge
          <br />
          <span className="text-hr-green">Challenge Your Mind</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-hr-gray dark:text-gray-300 max-w-2xl mx-auto mb-12"
        >
          Join our community of learners and test your skills with interactive quizzes.
          Challenge yourself and track your progress in real-time.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link to={user ? "/quizzes" : "/register"} className="btn btn-primary inline-flex items-center">
            Start Quiz Now
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </div>

      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Why Choose Our Platform?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card p-6 text-center hover:scale-105 transition-transform duration-200"
          >
            <AcademicCapIcon className="h-12 w-12 mx-auto mb-4 text-hr-green" />
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Multiple Quiz Types</h3>
            <p className="text-hr-gray dark:text-gray-300">From multiple choice to true/false questions, we offer diverse quiz formats to test your knowledge effectively.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card p-6 text-center hover:scale-105 transition-transform duration-200"
          >
            <ChartBarIcon className="h-12 w-12 mx-auto mb-4 text-hr-green" />
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Track Your Progress</h3>
            <p className="text-hr-gray dark:text-gray-300">Monitor your performance with detailed analytics and see how you improve over time.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="card p-6 text-center hover:scale-105 transition-transform duration-200"
          >
            <TrophyIcon className="h-12 w-12 mx-auto mb-4 text-hr-green" />
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Compete & Win</h3>
            <p className="text-hr-gray dark:text-gray-300">Join the leaderboard and compete with other learners to become the top performer.</p>
          </motion.div>
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 dark:text-white">Ready to Test Your Knowledge?</h2>
        <p className="text-xl text-hr-gray dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Join thousands of learners who are already improving their skills and knowledge through our interactive quizzes.
        </p>
        {!user && (
          <Link to="/register" className="btn btn-primary inline-flex items-center">
            Get Started
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        )}
      </div>
    </div>
  );
}

export default Home; 