import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Home = () => {
  const [quizId, setQuizId] = useState("");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const demoQuizId = "6967440e522837e5e325b611";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quizId.trim()) {
      navigate(`/quiz/${quizId.trim()}`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fillDemoQuizId = () => {
    setQuizId(demoQuizId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Quiz System</h1>
          <p className="text-gray-600">Take a quiz or create a new one</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <h2 className="text-sm font-semibold text-green-900 mb-3">Demo Quiz ID (for testing)</h2>
          <div className="flex items-center justify-between bg-white rounded px-3 py-2 border border-green-200 mb-2">
            <div className="flex-1">
              <div className="text-xs text-gray-600 mb-1">Quiz ID</div>
              <div className="text-sm font-mono text-gray-900 break-all">{demoQuizId}</div>
            </div>
            <button
              onClick={() => copyToClipboard(demoQuizId)}
              className="ml-3 px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 whitespace-nowrap"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <button
            onClick={fillDemoQuizId}
            className="w-full px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Fill Demo Quiz ID
          </button>
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
            to="/admin/login"
            className="block w-full px-6 py-3 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 text-center focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

