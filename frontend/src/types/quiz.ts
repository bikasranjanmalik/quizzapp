export type QuestionType = "mcq" | "true/false" | "one word";

export interface Question {
  question: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
}

// Question without correct answer (for taking quiz)
export interface QuestionForTaking {
  _id?: string;
  question: string;
  type: QuestionType;
  options?: string[];
}

export interface QuizFormData {
  title: string;
  description?: string;
  questions: Question[];
}

export interface CreateQuizResponse {
  _id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

// Quiz response for taking (without correct answers)
export interface QuizForTaking {
  _id: string;
  title: string;
  description?: string;
  questions: QuestionForTaking[];
  createdAt: string;
  updatedAt: string;
}

// Quiz submission response
export interface QuizResult {
  questionIndex: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface QuizSubmissionResponse {
  score: {
    total: number;
    correct: number;
    percentage: number;
  };
  results: QuizResult[];
}
