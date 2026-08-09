import React, { useState } from 'react';

const TopicInput = ({ onGenerate, loading }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('beginner');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onGenerate(topic.trim(), difficulty);
    setTopic('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
      <h3 className="font-semibold text-gray-800 mb-4">📚 What to learn?</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., React JS, Python, Photosynthesis..."
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          disabled={loading}
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          disabled={loading}
        >
          <option value="beginner">🌱 Beginner</option>
          <option value="intermediate">📈 Intermediate</option>
          <option value="advanced">🚀 Advanced</option>
        </select>
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : 'Generate Notes 🚀'}
        </button>
      </form>
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500">💡 Try: "Machine Learning", "React JS", "Photosynthesis"</p>
      </div>
    </div>
  );
};

export default TopicInput;