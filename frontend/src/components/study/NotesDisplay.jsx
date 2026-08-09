import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const NotesDisplay = ({ notes, topic, onGenerateQuiz, loading }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          <div>
            <p className="text-sm text-blue-600 font-medium mb-1">
              AI Generated Study Notes
            </p>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {topic || 'Study Notes'}
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Personalized notes generated for your topic
            </p>
          </div>

          <button
            onClick={onGenerateQuiz}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Generating...
              </>
            ) : (
              <>
                📝 Take Quiz
              </>
            )}
          </button>

        </div>
      </div>

      {/* Notes Content */}
      <div className="p-6 md:p-8">
        <article className="study-notes">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-6 pb-3 border-b border-gray-200">
                  {children}
                </h1>
              ),

              h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">
                  {children}
                </h2>
              ),

              h3: ({ children }) => (
                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                  {children}
                </h3>
              ),

              h4: ({ children }) => (
                <h4 className="text-lg font-semibold text-gray-800 mt-5 mb-2">
                  {children}
                </h4>
              ),

              p: ({ children }) => (
                <p className="text-gray-700 leading-8 mb-4 text-[15px] md:text-base">
                  {children}
                </p>
              ),

              ul: ({ children }) => (
                <ul className="list-disc pl-6 space-y-2 mb-5 text-gray-700">
                  {children}
                </ul>
              ),

              ol: ({ children }) => (
                <ol className="list-decimal pl-6 space-y-2 mb-5 text-gray-700">
                  {children}
                </ol>
              ),

              li: ({ children }) => (
                <li className="leading-7 pl-1">
                  {children}
                </li>
              ),

              strong: ({ children }) => (
                <strong className="font-semibold text-gray-900">
                  {children}
                </strong>
              ),

              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 bg-blue-50 px-5 py-4 rounded-r-xl my-5 text-gray-700">
                  {children}
                </blockquote>
              ),

              code: ({ inline, children }) => {
                if (inline) {
                  return (
                    <code className="bg-gray-100 text-blue-700 px-1.5 py-0.5 rounded-md text-sm font-mono">
                      {children}
                    </code>
                  );
                }

                return (
                  <code className="block text-sm font-mono text-gray-100 whitespace-pre">
                    {children}
                  </code>
                );
              },

              pre: ({ children }) => (
                <pre className="bg-gray-900 rounded-xl p-5 overflow-x-auto my-6 shadow-sm">
                  {children}
                </pre>
              ),

              table: ({ children }) => (
                <div className="overflow-x-auto my-6">
                  <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
                    {children}
                  </table>
                </div>
              ),

              thead: ({ children }) => (
                <thead className="bg-gray-50">
                  {children}
                </thead>
              ),

              th: ({ children }) => (
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-800">
                  {children}
                </th>
              ),

              td: ({ children }) => (
                <td className="border border-gray-200 px-4 py-3 text-gray-700">
                  {children}
                </td>
              ),

              hr: () => (
                <hr className="my-8 border-gray-200" />
              ),
            }}
          >
            {typeof notes === 'string'
              ? notes
              : JSON.stringify(notes, null, 2)}
          </ReactMarkdown>
        </article>
      </div>

      {/* Bottom Quiz CTA */}
      <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-gray-800">
            Ready to test yourself?
          </p>
          <p className="text-sm text-gray-500">
            Take an AI-generated quiz based on {topic || 'this topic'}.
          </p>
        </div>

        <button
          onClick={onGenerateQuiz}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Preparing Quiz...' : 'Take Quiz →'}
        </button>
      </div>
    </div>
  );
};

export default NotesDisplay;