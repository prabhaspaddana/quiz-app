import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { PlusIcon, TrashIcon, UserGroupIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTab, setSelectedTab] = useState('users'); // 'users' or 'quizzes'
  const { token } = useAuth();

  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    questions: []
  });

  const emptyQuestion = {
    question: '',
    type: 'single',
    options: ['', ''],
    correctAnswers: []
  };

  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isEditingQuiz, setIsEditingQuiz] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, quizzesRes, scoresRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/quiz'),
        axios.get('/api/admin/scores')
      ]);

      setUsers(usersRes.data);
      setQuizzes(quizzesRes.data);
      setScores(scoresRes.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  const handleUserDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      setError('Failed to delete user');
    }
  };

  const handleUserRoleToggle = async (userId, currentRole) => {
    try {
      const newRole = currentRole === 'user' ? 'admin' : 'user';
      await axios.put(`/api/admin/users/${userId}`, {
        role: newRole
      });
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      setError('Failed to update user role');
    }
  };

  const handleQuizDelete = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await axios.delete(`/api/admin/quiz/${quizId}`);
      setQuizzes(quizzes.filter(quiz => quiz._id !== quizId));
    } catch (error) {
      setError('Failed to delete quiz');
    }
  };

  const handleQuizChange = (e) => {
    setNewQuiz({
      ...newQuiz,
      [e.target.name]: e.target.value
    });
  };

  const addQuestion = () => {
    setNewQuiz({
      ...newQuiz,
      questions: [...newQuiz.questions, { ...emptyQuestion }]
    });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...newQuiz.questions];
    if (field === 'options') {
      updatedQuestions[index].options = value;
    } else if (field === 'correctAnswers') {
      const answers = value.split(',').map(Number).filter(num => !isNaN(num));
      updatedQuestions[index].correctAnswers = answers;
    } else {
      updatedQuestions[index][field] = value;
    }
    setNewQuiz({
      ...newQuiz,
      questions: updatedQuestions
    });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = newQuiz.questions.filter((_, i) => i !== index);
    setNewQuiz({
      ...newQuiz,
      questions: updatedQuestions
    });
  };

  const handleQuizCreate = async (e) => {
    e.preventDefault();
    try {
      const validQuestions = newQuiz.questions.filter(q => 
        q.question.trim() !== '' && 
        q.options.some(opt => opt.trim() !== '') &&
        q.correctAnswers.length > 0
      );

      if (validQuestions.length === 0) {
        setError('Please add at least one valid question with options and correct answers');
        return;
      }

      const quizData = {
        ...newQuiz,
        questions: validQuestions
      };

      await axios.post('/api/admin/quiz', quizData);

      setNewQuiz({
        title: '',
        description: '',
        questions: []
      });
      fetchData();
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create quiz');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', newUser);
      fetchData();
      setShowAddUser(false);
      setNewUser({ username: '', email: '', password: '', role: 'user' });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add user');
    }
  };

  const handleEditQuiz = async (quiz) => {
    try {
      // Fetch complete quiz data including questions
      const response = await axios.get(`/api/quiz/${quiz._id}`);
      setSelectedQuiz(response.data);
      setIsEditingQuiz(true);
      setSelectedTab('quizzes');
    } catch (error) {
      setError('Failed to fetch quiz details');
    }
  };

  const handleUpdateQuiz = async () => {
    try {
      const validQuestions = selectedQuiz.questions.filter(q => 
        q.question.trim() !== '' && 
        q.options.some(opt => opt.trim() !== '') &&
        q.correctAnswers.length > 0
      );

      if (validQuestions.length === 0) {
        setError('Please add at least one valid question with options and correct answers');
        return;
      }

      const quizData = {
        ...selectedQuiz,
        questions: validQuestions
      };

      await axios.put(`/api/admin/quiz/${selectedQuiz._id}`, quizData);
      setIsEditingQuiz(false);
      setSelectedQuiz(null);
      fetchData();
      setError('');
    } catch (error) {
      setError('Failed to update quiz');
    }
  };

  const handleQuestionDelete = (index) => {
    if (!selectedQuiz) return;
    const updatedQuestions = [...selectedQuiz.questions];
    updatedQuestions.splice(index, 1);
    setSelectedQuiz({
      ...selectedQuiz,
      questions: updatedQuestions
    });
  };

  const handleQuestionEdit = (index, field, value) => {
    if (!selectedQuiz) return;
    const updatedQuestions = [...selectedQuiz.questions];
    if (field === 'options') {
      updatedQuestions[index].options = value;
    } else if (field === 'correctAnswers') {
      const answers = value.split(',').map(Number).filter(num => !isNaN(num));
      updatedQuestions[index].correctAnswers = answers;
    } else {
      updatedQuestions[index][field] = value;
    }
    setSelectedQuiz({
      ...selectedQuiz,
      questions: updatedQuestions
    });
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
      <div className="container-custom">
        <div className="text-center text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Total Users</h3>
              <UserGroupIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{users.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Total Quizzes</h3>
              <DocumentTextIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{quizzes.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Total Attempts</h3>
              <ChartBarIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{scores.length}</p>
          </motion.div>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            className={`btn ${selectedTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedTab('users')}
          >
            Manage Users
          </button>
          <button
            className={`btn ${selectedTab === 'quizzes' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedTab('quizzes')}
          >
            Manage Quizzes
          </button>
        </div>

        {selectedTab === 'users' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Users</h2>
              <button
                onClick={() => setShowAddUser(!showAddUser)}
                className="btn btn-primary"
              >
                {showAddUser ? 'Cancel' : 'Add User'}
              </button>
            </div>

            {showAddUser && (
              <form onSubmit={handleAddUser} className="mb-6 space-y-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    className="input mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="input mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="input mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="input mt-1"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">
                  Add User
                </button>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-4">
                        <button
                          onClick={() => handleUserRoleToggle(user._id, user.role)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          Toggle Role
                        </button>
                        <button
                          onClick={() => handleUserDelete(user._id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        >
                          <TrashIcon className="h-5 w-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === 'quizzes' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            {!isEditingQuiz ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Manage Quizzes</h2>
                  <button
                    onClick={() => {
                      setSelectedQuiz(null);
                      setIsEditingQuiz(true);
                    }}
                    className="btn btn-primary"
                  >
                    Create New Quiz
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Questions</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {quizzes.map((quiz) => (
                        <tr key={quiz._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{quiz.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{quiz.questionCount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-4">
                            <button
                              onClick={() => handleEditQuiz(quiz)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleQuizDelete(quiz._id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {selectedQuiz ? `Edit Quiz: ${selectedQuiz.title}` : 'Create New Quiz'}
                  </h2>
                  <button
                    onClick={() => setIsEditingQuiz(false)}
                    className="btn btn-secondary"
                  >
                    Back to Quizzes
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                    <input
                      type="text"
                      value={selectedQuiz ? selectedQuiz.title : newQuiz.title}
                      onChange={(e) => {
                        if (selectedQuiz) {
                          setSelectedQuiz({ ...selectedQuiz, title: e.target.value });
                        } else {
                          setNewQuiz({ ...newQuiz, title: e.target.value });
                        }
                      }}
                      className="input mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                    <textarea
                      value={selectedQuiz ? selectedQuiz.description : newQuiz.description}
                      onChange={(e) => {
                        if (selectedQuiz) {
                          setSelectedQuiz({ ...selectedQuiz, description: e.target.value });
                        } else {
                          setNewQuiz({ ...newQuiz, description: e.target.value });
                        }
                      }}
                      className="input mt-1"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Questions</h3>
                  {(selectedQuiz ? selectedQuiz.questions : newQuiz.questions).map((question, qIndex) => (
                    <div key={qIndex} className="p-4 border dark:border-gray-700 rounded-lg space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Question {qIndex + 1}</h4>
                        <button
                          type="button"
                          onClick={() => {
                            if (selectedQuiz) {
                              handleQuestionDelete(qIndex);
                            } else {
                              removeQuestion(qIndex);
                            }
                          }}
                          className="text-red-600 dark:text-red-400"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={question.question || ''}
                        onChange={(e) => {
                          if (selectedQuiz) {
                            handleQuestionEdit(qIndex, 'question', e.target.value);
                          } else {
                            handleQuestionChange(qIndex, 'question', e.target.value);
                          }
                        }}
                        className="input w-full"
                        placeholder="Question"
                        required
                      />

                      <select
                        value={question.type || 'single'}
                        onChange={(e) => {
                          if (selectedQuiz) {
                            handleQuestionEdit(qIndex, 'type', e.target.value);
                          } else {
                            handleQuestionChange(qIndex, 'type', e.target.value);
                          }
                        }}
                        className="input"
                      >
                        <option value="single">Single Choice</option>
                        <option value="multiple">Multiple Choice</option>
                        <option value="boolean">True/False</option>
                      </select>

                      <div className="space-y-2">
                        {(question.options || []).map((option, oIndex) => (
                          <input
                            key={oIndex}
                            type="text"
                            value={option || ''}
                            onChange={(e) => {
                              const newOptions = [...question.options];
                              newOptions[oIndex] = e.target.value;
                              if (selectedQuiz) {
                                handleQuestionEdit(qIndex, 'options', newOptions);
                              } else {
                                handleQuestionChange(qIndex, 'options', newOptions);
                              }
                            }}
                            className="input w-full"
                            placeholder={`Option ${oIndex + 1}`}
                            required
                          />
                        ))}
                        {question.type !== 'boolean' && (
                          <button
                            type="button"
                            onClick={() => {
                              const newOptions = [...(question.options || []), ''];
                              if (selectedQuiz) {
                                handleQuestionEdit(qIndex, 'options', newOptions);
                              } else {
                                handleQuestionChange(qIndex, 'options', newOptions);
                              }
                            }}
                            className="btn btn-secondary"
                          >
                            Add Option
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        value={(question.correctAnswers || []).join(',')}
                        onChange={(e) => {
                          if (selectedQuiz) {
                            handleQuestionEdit(qIndex, 'correctAnswers', e.target.value);
                          } else {
                            handleQuestionChange(qIndex, 'correctAnswers', e.target.value);
                          }
                        }}
                        className="input w-full"
                        placeholder="Correct Answers (comma-separated indices, e.g., 0,2)"
                        required
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedQuiz) {
                        const newQuestions = [...selectedQuiz.questions, { ...emptyQuestion }];
                        setSelectedQuiz({ ...selectedQuiz, questions: newQuestions });
                      } else {
                        addQuestion();
                      }
                    }}
                    className="btn btn-secondary"
                  >
                    Add Question
                  </button>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={selectedQuiz ? handleUpdateQuiz : handleQuizCreate}
                    className="btn btn-primary"
                  >
                    {selectedQuiz ? 'Save Changes' : 'Create Quiz'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recent Scores */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Scores
          </h2>
          <div className="card">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Quiz
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {scores.map((score) => (
                    <tr
                      key={score._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {score.userId.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {score.quizId.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {score.score}/{score.maxScore}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(score.completedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 