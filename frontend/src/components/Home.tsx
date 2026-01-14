import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Home = () => {
  const [quizId, setQuizId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quizId.trim()) {
      navigate(`/quiz/${quizId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Quiz System</h1>
          <p className="text-gray-600">Take a quiz or create a new one</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Take a Quiz</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="quizId" className="block text-sm font-medium text-gray-700 mb-2">
                Enter Quiz ID
              </label>
              <input
                id="quizId"
                type="text"
                value={quizId}
                onChange={(e) => setQuizId(e.target.value)}
                placeholder="Enter quiz ID here"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Start Quiz
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Admin</h2>
          <Link
            to="/admin"
            className="block w-full px-6 py-3 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 text-center focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Create New Quiz
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

