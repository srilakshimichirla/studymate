import React, { useState, useEffect } from 'react';
import { quizAPI } from '../../services/api';

const QuizHistory = () => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await quizAPI.getHistory();
      setHistory(response.data.data.attempts || []);
      setStats(response.data.data.stats || {});
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded mb-3"></div>
          <div className="h-20 bg-gray-200 rounded mb-3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Quiz History</h3>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <p className="text-xl font-bold text-blue-600">{stats.totalQuizzes || 0}</p>
          <p className="text-xs text-gray-600">Total Quizzes</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <p className="text-xl font-bold text-green-600">{stats.averageScore?.toFixed(1) || 0}%</p>
          <p className="text-xs text-gray-600">Average Score</p>
        </div>
      </div>
      {history.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-3xl mb-2">📭</p>
          <p>No quiz attempts yet</p>
          <p className="text-sm">Take a quiz to see history here</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {history.map((attempt, index) => (
            <div key={index} className="border border-gray-100 rounded-lg p-3 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">{attempt.topicName}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(attempt.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    attempt.percentage >= 80 ? 'text-green-600' :
                    attempt.percentage >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {attempt.percentage}%
                  </p>
                  <p className="text-xs text-gray-500">
                    {attempt.score}/{attempt.totalQuestions}
                  </p>
                </div>
              </div>
              {attempt.weakAreas?.length > 0 && (
                <div className="mt-1">
                  <p className="text-xs text-yellow-600">📌 Weak: {attempt.weakAreas.join(', ')}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizHistory;