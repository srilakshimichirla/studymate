import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { topicAPI, quizAPI } from '../../services/api';
import TopicInput from '../study/TopicInput';
import NotesDisplay from '../study/NotesDisplay';
import StatsCard from './StatsCard';
import QuizHistory from '../history/QuizHistory';
import NotesHistory from '../history/NotesHistory';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [currentTopic, setCurrentTopic] = useState(null);
  const [notes, setNotes] = useState(null);

  const [activeTab, setActiveTab] = useState('study');

  /*
    Generate Notes
  */
  const handleGenerateNotes = async (topic, difficulty) => {
    setLoading(true);

    try {
      const response = await topicAPI.generate({
        topic,
        difficulty,
      });

      const data = response.data?.data;

      console.log('Generated topic:', data);

      /*
        Backend may return:
        {
          topic: {...},
          notes: "..."
        }
      */

      setCurrentTopic(data?.topic || data);
      setNotes(data?.notes || '');

      toast.success('Notes generated! 📚');

    } catch (error) {
      console.error('Generate notes error:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to generate notes'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
    Generate Quiz and OPEN SEPARATE QUIZ PAGE
  */
  const handleGenerateQuiz = async () => {
    if (!currentTopic?._id) {
      toast.error('Please generate notes first.');
      return;
    }

    setLoading(true);

    try {
      const response = await quizAPI.generate({
        topicId: currentTopic._id,
        numQuestions: 5,
      });

      const generatedQuiz = response.data?.data;

      console.log('Generated quiz:', generatedQuiz);

      /*
        Navigate to completely separate Quiz page.

        We pass:
        - quiz
        - current topic

        So the Quiz page knows which topic
        the user selected.
      */
      navigate('/quiz', {
        state: {
          quiz: generatedQuiz,
          topic: currentTopic,
        },
      });

      toast.success('Quiz ready! 📝');

    } catch (error) {
      console.error('Generate quiz error:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to generate quiz'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /*
    Find topic name safely.
  */
  const topicName =
    currentTopic?.name ||
    currentTopic?.topic ||
    currentTopic?.title ||
    '';

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              🤖
            </div>

            <div>
              <h1 className="text-lg font-bold text-gray-900">
                AI StudyMate
              </h1>

              <p className="text-xs text-gray-500">
                Learn smarter with AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">

            <span className="text-sm text-gray-600 hidden md:block">
              Welcome, {user?.name || 'Student'}!
            </span>

            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Logout
            </button>

          </div>

        </div>
      </nav>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

          <StatsCard
            icon="📚"
            label="Topics Studied"
            value={user?.stats?.totalTopicsStudied || 0}
            color="blue"
          />

          <StatsCard
            icon="📝"
            label="Quizzes Taken"
            value={user?.stats?.totalQuizzesTaken || 0}
            color="green"
          />

          <StatsCard
            icon="📊"
            label="Average Score"
            value={`${user?.stats?.averageScore?.toFixed?.(1) || 0}%`}
            color="purple"
          />

          <StatsCard
            icon="🎯"
            label="Weak Areas"
            value={user?.stats?.weakAreas?.length || 0}
            color="orange"
          />

        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">

          <button
            onClick={() => setActiveTab('study')}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === 'study'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            📖 Study
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            📊 History
          </button>

        </div>

        {/* Study */}
        {activeTab === 'study' ? (

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Topic Input */}
            <div className="lg:col-span-4">

              <TopicInput
                onGenerate={handleGenerateNotes}
                loading={loading}
              />

            </div>

            {/* Notes */}
            <div className="lg:col-span-8">

              {notes ? (

                <NotesDisplay
                  notes={notes}
                  topic={topicName}
                  onGenerateQuiz={handleGenerateQuiz}
                  loading={loading}
                />

              ) : (

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">

                  <div className="text-6xl mb-5">
                    🚀
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800">
                    Start Learning
                  </h2>

                  <p className="text-gray-500 mt-2 max-w-md mx-auto">
                    Enter any topic on the left and let AI create
                    personalized study notes for you.
                  </p>

                </div>

              )}

            </div>

          </div>

        ) : (

          /* History */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <QuizHistory />

            <NotesHistory />

          </div>

        )}

      </main>

    </div>
  );
};

export default Dashboard;