import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { Question, QuestionType, QuizFormData } from "../types/quiz";
import { createQuiz } from "../services/api";

const CreateQuiz = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Add a new question
  const addQuestion = () => {
    const newQuestion: Question = {
      question: "",
      type: "mcq",
      options: ["", ""],
      correctAnswer: "",
    };
    setQuestions([...questions, newQuestion]);
  };

  // Remove a question by index
  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // Update question field
  const updateQuestion = (index: number, field: keyof Question, value: string | QuestionType | string[] | boolean) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };
    setQuestions(updatedQuestions);
  };

  // Update option in MCQ question
  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].options) {
      const newOptions = [...updatedQuestions[questionIndex].options!];
      newOptions[optionIndex] = value;
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: newOptions,
      };
      setQuestions(updatedQuestions);
    }
  };

  // Add option to MCQ question
  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: [...updatedQuestions[questionIndex].options!, ""],
      };
      setQuestions(updatedQuestions);
    }
  };

  // Remove option from MCQ question
  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].options && updatedQuestions[questionIndex].options!.length > 2) {
      const newOptions = updatedQuestions[questionIndex].options!.filter((_, i) => i !== optionIndex);
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: newOptions,
        // Reset correctAnswer if it was the removed option
        correctAnswer: updatedQuestions[questionIndex].correctAnswer === updatedQuestions[questionIndex].options![optionIndex] 
          ? "" 
          : updatedQuestions[questionIndex].correctAnswer,
      };
      setQuestions(updatedQuestions);
    }
  };

  // Handle question type change
  const handleTypeChange = (index: number, newType: QuestionType) => {
    if (newType === "mcq") {
      updateQuestion(index, "type", "mcq");
      updateQuestion(index, "options", ["", ""]);
      updateQuestion(index, "correctAnswer", "");
    } else {
      updateQuestion(index, "type", "boolean");
      updateQuestion(index, "options", undefined);
      updateQuestion(index, "correctAnswer", false);
    }
  };

  // Validate form
  const validateForm = (): string | null => {
    if (!title.trim()) {
      return "Quiz title is required";
    }

    if (questions.length === 0) {
      return "At least one question is required";
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      
      if (!q.question.trim()) {
        return `Question ${i + 1}: Question text is required`;
      }

      if (q.type === "mcq") {
        if (!q.options || q.options.length < 2) {
          return `Question ${i + 1}: MCQ must have at least 2 options`;
        }
        
        const hasEmptyOption = q.options.some(opt => !opt.trim());
        if (hasEmptyOption) {
          return `Question ${i + 1}: All options must be filled`;
        }

        if (!q.correctAnswer || typeof q.correctAnswer !== "string") {
          return `Question ${i + 1}: Please select a correct answer`;
        }

        if (!q.options.includes(q.correctAnswer)) {
          return `Question ${i + 1}: Correct answer must be one of the options`;
        }
      } else {
        if (typeof q.correctAnswer !== "boolean") {
          return `Question ${i + 1}: Please select a correct answer (true or false)`;
        }
      }
    }

    return null;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);

    const validationError = validateForm();
    if (validationError) {
      setSubmitMessage({ type: "error", text: validationError });
      return;
    }

    setIsSubmitting(true);

    try {
      const quizData: QuizFormData = {
        title: title.trim(),
        description: description.trim() || undefined,
        questions: questions.map(q => ({
          question: q.question.trim(),
          type: q.type,
          options: q.type === "mcq" ? q.options : undefined,
          correctAnswer: q.correctAnswer,
        })),
      };

      const response = await createQuiz(quizData);
      setSubmitMessage({ 
        type: "success", 
        text: `Quiz created successfully!`,
        quizId: response._id
      });

      // Reset form
      setTitle("");
      setDescription("");
      setQuestions([]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || "Failed to create quiz";
      setSubmitMessage({ type: "error", text: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm">← Back to Home</Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Quiz</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Quiz Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Quiz Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Quiz Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Questions */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Questions</h2>
            
            {questions.map((question, questionIndex) => (
              <div key={questionIndex} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <h3 className="text-lg font-medium text-gray-800">Question {questionIndex + 1}</h3>

                {/* Question Text */}
                <div>
                  <label htmlFor={`question-${questionIndex}`} className="block text-sm font-medium text-gray-700 mb-2">
                    Question Text *
                  </label>
                  <textarea
                    id={`question-${questionIndex}`}
                    value={question.question}
                    onChange={(e) => updateQuestion(questionIndex, "question", e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Question Type */}
                <div>
                  <label htmlFor={`type-${questionIndex}`} className="block text-sm font-medium text-gray-700 mb-2">
                    Question Type *
                  </label>
                  <select
                    id={`type-${questionIndex}`}
                    value={question.type}
                    onChange={(e) => handleTypeChange(questionIndex, e.target.value as QuestionType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="mcq">Multiple Choice (MCQ)</option>
                    <option value="boolean">True/False</option>
                  </select>
                </div>

                {/* MCQ Options */}
                {question.type === "mcq" && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Options *</label>
                    {question.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                          placeholder={`Option ${optionIndex + 1}`}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${questionIndex}`}
                            checked={question.correctAnswer === option}
                            onChange={() => updateQuestion(questionIndex, "correctAnswer", option)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            required
                          />
                          <label className="text-sm text-gray-700">Correct</label>
                        </div>
                        {question.options && question.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(questionIndex, optionIndex)}
                            className="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addOption(questionIndex)}
                      className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded hover:bg-blue-50"
                    >
                      Add Option
                    </button>
                  </div>
                )}

                {/* Boolean Answer */}
                {question.type === "boolean" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer *</label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`boolean-${questionIndex}`}
                          checked={question.correctAnswer === true}
                          onChange={() => updateQuestion(questionIndex, "correctAnswer", true)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          required
                        />
                        <span className="text-gray-700">True</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`boolean-${questionIndex}`}
                          checked={question.correctAnswer === false}
                          onChange={() => updateQuestion(questionIndex, "correctAnswer", false)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          required
                        />
                        <span className="text-gray-700">False</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Remove Question Button */}
                <button
                  type="button"
                  onClick={() => removeQuestion(questionIndex)}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50"
                >
                  Remove Question
                </button>
              </div>
            ))}

            {/* Add Question Button */}
            <button
              type="button"
              onClick={addQuestion}
              className="w-full px-4 py-2 text-blue-600 hover:text-blue-800 border-2 border-dashed border-blue-300 rounded hover:bg-blue-50 font-medium"
            >
              + Add Question
            </button>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Quiz"}
            </button>
          </div>
        </form>

        {/* Submit Message */}
        {submitMessage && (
          <div className={`mt-4 p-4 rounded-md ${
            submitMessage.type === "success" 
              ? "bg-green-50 text-green-800 border border-green-200" 
              : "bg-red-50 text-red-800 border border-red-200"
          }`}>
            <p className="mb-2">{submitMessage.text}</p>
            {submitMessage.type === "success" && submitMessage.quizId && (
              <div className="mt-3 space-y-2">
                <p className="text-sm font-medium">Quiz ID: <span className="font-mono bg-white px-2 py-1 rounded">{submitMessage.quizId}</span></p>
                <Link
                  to={`/quiz/${submitMessage.quizId}`}
                  className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                >
                  Take Quiz
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateQuiz;

