import React, { useState } from 'react';

const QuizDisplay = ({ quiz, onSubmit, loading }) => {
  const [answers, setAnswers] = useState({});

  const handleAnswerSelect = (questionIndex, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length !== quiz.questions.length) {
      alert('Please answer all questions before submitting!');
      return;
    }

    onSubmit(answers);
  };

  return (
    <div className="space-y-6">

      {quiz.questions.map((q, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-5">
            {index + 1}. {q.question}
          </h3>

          <div className="space-y-3">
            {q.options.map((option, optionIndex) => {
              const selected = answers[index] === option;

              return (
                <button
                  key={optionIndex}
                  type="button"
                  onClick={() =>
                    handleAnswerSelect(index, option)
                  }
                  disabled={loading}
                  className={`w-full text-left p-4 rounded-xl border transition ${
                    selected
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-indigo-400 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        selected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {String.fromCharCode(65 + optionIndex)}
                    </div>

                    <span>{option}</span>

                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg transition disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Quiz'}
      </button>

    </div>
  );
};

export default QuizDisplay;