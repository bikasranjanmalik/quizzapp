import axios from "axios";
import type { QuizFormData, CreateQuizResponse, QuizForTaking, QuizSubmissionResponse } from "../types/quiz";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://quizzapp-1-3yt4.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Get admin credentials from sessionStorage
const getAdminHeaders = () => {
  const adminName = sessionStorage.getItem("adminName");
  const adminPassword = sessionStorage.getItem("adminPassword");
  
  if (adminName && adminPassword) {
    return {
      "x-admin-name": adminName,
      "x-admin-password": adminPassword,
    };
  }
  return {};
};

export const createQuiz = async (quizData: QuizFormData): Promise<CreateQuizResponse> => {
  const response = await api.post<CreateQuizResponse>("/api/quizzes", quizData, {
    headers: getAdminHeaders(),
  });
  return response.data;
};

export const getQuiz = async (id: string): Promise<QuizForTaking> => {
  const response = await api.get<QuizForTaking>(`/api/quizzes/${id}`);
  return response.data;
};

export const submitQuiz = async (id: string, answers: string[]): Promise<QuizSubmissionResponse> => {
  const response = await api.post<QuizSubmissionResponse>(`/api/quizzes/${id}/submit`, { answers });
  return response.data;
};

