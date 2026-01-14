import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { QuizForTaking, QuizSubmissionResponse } from "../types/quiz";
import { getQuiz, submitQuiz } from "../services/api";

const TakeQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizForTaking | null>(null);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<QuizSubmissionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) {
        setError("Quiz ID is required");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const quizData = await getQuiz(id);
        setQuiz(quizData);
        setAnswers(new Array(quizData.questions.length).fill(null));
      } catch (err: any) {
        let errorMessage = "Failed to load quiz";
        
        if (err.code === "ERR_NETWORK" || err.message?.includes("Network Error")) {
          errorMessage = "Network Error: Unable to connect to the server. Please check your internet connection and try again.";
        } else if (err.response?.status === 404) {
          errorMessage = "Quiz not found. Please check the Quiz ID and try again.";
        } else if (err.response?.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!quiz || !id) return;

    // Check if all questions are answered
    const unanswered = answers.some(answer => answer === null);
    if (unanswered) {
      setError("Please answer all questions before submitting");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const submissionResults = await submitQuiz(id, answers as string[]);
      setResults(submissionResults);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || "Failed to submit quiz";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600">Loading quiz...</div>
        </div>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-4">
            <div className="text-red-600 font-semibold text-lg mb-2">Network Error</div>
            <div className="text-gray-700 text-sm">{error}</div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (results) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz?.title}</h1>
            {quiz?.description && (
              <p className="text-gray-600 mb-6">{quiz.description}</p>
            )}

            {/* Score Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Results</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600">{results.score.correct}</div>
                  <div className="text-sm text-gray-600">Correct</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">{results.score.total}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">{results.score.percentage}%</div>
                  <div className="text-sm text-gray-600">Score</div>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Question Review</h2>
              {results.results.map((result, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${
                    result.isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    {result.isCorrect ? (
                      <span className="text-green-600 font-bold">✓</span>
                    ) : (
                      <span className="text-red-600 font-bold">✗</span>
                    )}
                    <h3 className="font-medium text-gray-900">{result.question}</h3>
                  </div>
                  <div className="ml-6 space-y-1 text-sm">
                    <div>
                      <span className="font-medium">Your answer: </span>
                      <span className={result.isCorrect ? "text-green-700" : "text-red-700"}>
                        {String(result.userAnswer)}
                      </span>
                    </div>
                    {!result.isCorrect && (
                      <div>
                        <span className="font-medium">Correct answer: </span>
                        <span className="text-green-700">{String(result.correctAnswer)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => navigate("/")}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Take Another Quiz
              </button>
              <button
                onClick={() => {
                  setResults(null);
                  setAnswers(new Array(quiz?.questions.length || 0).fill(null));
                }}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
          {quiz.description && (
            <p className="text-gray-600 mb-6">{quiz.description}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {quiz.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Question {questionIndex + 1}: {question.question}
                </h3>

                {/* MCQ Questions */}
                {question.type === "mcq" && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className="flex items-center gap-3 p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`question-${questionIndex}`}
                          value={option}
                          checked={answers[questionIndex] === option}
                          onChange={() => handleAnswerChange(questionIndex, option)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          required
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* True/False Questions */}
                {question.type === "true/false" && (
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer flex-1">
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        value="true"
                        checked={answers[questionIndex] === "true"}
                        onChange={() => handleAnswerChange(questionIndex, "true")}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        required
                      />
                      <span className="text-gray-700 font-medium">True</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer flex-1">
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        value="false"
                        checked={answers[questionIndex] === "false"}
                        onChange={() => handleAnswerChange(questionIndex, "false")}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        required
                      />
                      <span className="text-gray-700 font-medium">False</span>
                    </label>
                  </div>
                )}

                {/* One Word Questions */}
                {question.type === "one word" && (
                  <div>
                    <input
                      type="text"
                      value={answers[questionIndex] || ""}
                      onChange={(e) => handleAnswerChange(questionIndex, e.target.value)}
                      placeholder="Enter your answer (one word)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">Answer will be matched case-insensitively</p>
                  </div>
                )}
              </div>
            ))}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
                {error}
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;

