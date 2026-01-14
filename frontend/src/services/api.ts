import axios from "axios";
import type { QuizFormData, CreateQuizResponse, QuizForTaking, QuizSubmissionResponse } from "../types/quiz";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createQuiz = async (quizData: QuizFormData): Promise<CreateQuizResponse> => {
  const response = await api.post<CreateQuizResponse>("/api/quizzes", quizData);
  return response.data;
};

export const getQuiz = async (id: string): Promise<QuizForTaking> => {
  const response = await api.get<QuizForTaking>(`/api/quizzes/${id}`);
  return response.data;
};

export const submitQuiz = async (id: string, answers: (string | boolean)[]): Promise<QuizSubmissionResponse> => {
  const response = await api.post<QuizSubmissionResponse>(`/api/quizzes/${id}/submit`, { answers });
  return response.data;
};

