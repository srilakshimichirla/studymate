import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QuizDisplay from './QuizDisplay';
import { quizAPI } from '../../services/api';
import toast from 'react-hot-toast';

const QuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const quiz = location.state?.quiz;
  const topic = location.state?.topic;

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">

          <div className="text-5xl mb-4">
            📝
          </div>

          <h2 className="text-xl font-bold text-gray-800">
            Quiz not found
          </h2>

          <p className="text-gray-500 mt-2">
            Please generate a quiz from the dashboard.
          </p>

          <button
            onClick={() => navigate('/dashboard')}
            className="mt-5 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Go to Dashboard
          </button>

        </div>
      </div>
    );
  }

  // Submit quiz
  const handleSubmit = async (answers) => {
    setLoading(true);

    try {
      const response = await quizAPI.submit({
        topicId: topic?._id,
        answers,
        questions: quiz.questions,
      });

      console.log('Quiz submit response:', response.data);

      const resultData = response.data.data;

      // Store result
      setResult(resultData);

      toast.success('Quiz submitted successfully! 🎉');

    } catch (error) {
      console.error('Quiz submit error:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to submit quiz'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
    ==========================
    SCORE DISPLAY
    ==========================
  */

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50">

        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-5">

            <h1 className="text-xl font-bold text-gray-800">
              AI StudyMate
            </h1>

          </div>
        </header>

        <main className="max-w-xl mx-auto px-6 py-12">

          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10 text-center">

            <div className="text-6xl mb-5">
              🎉
            </div>

            <h1 className="text-3xl font-bold text-gray-800">
              Quiz Completed!
            </h1>

            <p className="text-gray-500 mt-2">
              {quiz.topicName || topic?.topic || 'Quiz'}
            </p>

            {/* SCORE */}
            <div className="mt-10">

              <div className="text-6xl font-bold text-indigo-600">
                {result.score}
                <span className="text-3xl text-gray-400">
                  /{result.totalQuestions}
                </span>
              </div>

              <p className="text-gray-500 mt-3 text-lg">
                Marks Obtained
              </p>

            </div>

            {/* Percentage */}
            {result.percentage !== undefined && (
              <div className="mt-7 bg-indigo-50 rounded-2xl p-5">

                <p className="text-3xl font-bold text-indigo-600">
                  {Number(result.percentage).toFixed(1)}%
                </p>

                <p className="text-gray-600 mt-1">
                  Score
                </p>

              </div>
            )}

            {/* Back */}
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Back to Dashboard
            </button>

          </div>

        </main>

      </div>
    );
  }

  /*
    ==========================
    QUIZ PAGE
    ==========================
  */

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">

        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">

          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>

          <div className="text-center">

            <h1 className="font-bold text-gray-800">
              📝 Quiz
            </h1>

            <p className="text-xs text-gray-500">
              {quiz.questions.length} Questions
            </p>

          </div>

          <div className="w-10" />

        </div>

      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">

        <div className="mb-8">

          <h2 className="text-3xl font-bold text-gray-800">
            {quiz.topicName || topic?.topic || 'Test Your Knowledge'}
          </h2>

          <p className="text-gray-500 mt-2">
            Answer all questions and submit your quiz.
          </p>

        </div>

        <QuizDisplay
          quiz={quiz}
          onSubmit={handleSubmit}
          loading={loading}
        />

      </main>

    </div>
  );
};

export default QuizPage;