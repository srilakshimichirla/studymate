import React, { useState, useEffect } from 'react';
import { topicAPI } from '../../services/api';

const NotesHistory = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await topicAPI.getAll();
      setTopics(response.data.data || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
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
      <h3 className="text-lg font-bold text-gray-800 mb-4">📚 Notes History</h3>
      {topics.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-3xl mb-2">📭</p>
          <p>No notes generated yet</p>
          <p className="text-sm">Generate notes to see them here</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {topics.map((topic, index) => (
            <div key={index} className="border border-gray-100 rounded-lg p-3 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{topic.name}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span className="capitalize">{topic.difficulty}</span>
                    <span>•</span>
                    <span>Mastery: {topic.masteryLevel}%</span>
                    <span>•</span>
                    <span>Studied: {topic.timesStudied}x</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(topic.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {topic.summary?.substring(0, 100)}...
                  </p>
                </div>
                <div className="ml-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    topic.masteryLevel >= 80 ? 'bg-green-100 text-green-700' :
                    topic.masteryLevel >= 50 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {topic.masteryLevel}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesHistory;