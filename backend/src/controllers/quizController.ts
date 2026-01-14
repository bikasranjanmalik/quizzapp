import type { Request, Response } from "express";
import { Quiz } from "../models/Quiz.js";
import type { IQuestion } from "../models/Quiz.js";

interface CreateQuizRequest {
  title: string;
  description?: string;
  questions: IQuestion[];
}

interface SubmitAnswerRequest {
  answers: string[];
}

export const createQuiz = async (
  req: Request<{}, {}, CreateQuizRequest>,
  res: Response
): Promise<void> => {
  try {
    const { title, questions } = req.body;

    // Minimal validation
    if (!title || !title.trim()) {
      res.status(400).json({ error: "Title is required" });
      return;
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      res.status(400).json({ error: "At least one question is required" });
      return;
    }

    // Validate each question
    for (const question of questions) {
      if (!question.question || !question.question.trim()) {
        res.status(400).json({ error: "Question text is required for all questions" });
        return;
      }

      if (!question.type || !["mcq", "true/false", "one word"].includes(question.type)) {
        res.status(400).json({ error: "Question type must be 'mcq', 'true/false', or 'one word'" });
        return;
      }

      if (question.type === "mcq") {
        if (!question.options || question.options.length < 2) {
          res.status(400).json({ error: "MCQ questions must have at least 2 options" });
          return;
        }
        if (typeof question.correctAnswer !== "string") {
          res.status(400).json({ error: "MCQ correctAnswer must be a string" });
          return;
        }
        if (!question.options.includes(question.correctAnswer)) {
          res.status(400).json({ error: "Correct answer must be one of the options" });
          return;
        }
      } else if (question.type === "true/false") {
        if (typeof question.correctAnswer !== "string") {
          res.status(400).json({ error: "True/false correctAnswer must be a string" });
          return;
        }
        if (question.correctAnswer !== "true" && question.correctAnswer !== "false") {
          res.status(400).json({ error: "True/false correctAnswer must be 'true' or 'false'" });
          return;
        }
      } else if (question.type === "one word") {
        if (typeof question.correctAnswer !== "string" || !question.correctAnswer.trim()) {
          res.status(400).json({ error: "One word correctAnswer must be a non-empty string" });
          return;
        }
      }
    }

    const quiz = new Quiz({
      title: title.trim(),
      description: req.body.description?.trim(),
      questions,
    });

    const savedQuiz = await quiz.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ error: "Failed to create quiz" });
  }
};

export const getQuiz = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "Quiz ID is required" });
      return;
    }

    const quiz = await Quiz.findById(id);

    if (!quiz) {
      res.status(404).json({ error: "Quiz not found" });
      return;
    }

    // Return quiz without correct answers for taking
    const quizForTaking = {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions.map((q) => ({
        _id: q._id,
        question: q.question,
        type: q.type,
        options: q.options,
        // Don't include correctAnswer
      })),
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    };

    res.json(quizForTaking);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
};

export const submitQuiz = async (
  req: Request<{ id: string }, {}, SubmitAnswerRequest>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    if (!id) {
      res.status(400).json({ error: "Quiz ID is required" });
      return;
    }

    if (!answers || !Array.isArray(answers)) {
      res.status(400).json({ error: "Answers array is required" });
      return;
    }

    const quiz = await Quiz.findById(id);

    if (!quiz) {
      res.status(404).json({ error: "Quiz not found" });
      return;
    }

    if (answers.length !== quiz.questions.length) {
      res.status(400).json({ error: "Number of answers must match number of questions" });
      return;
    }

    let correctCount = 0;
    const results = quiz.questions.map((question, index) => {
      const userAnswer = answers[index] || "";
      let isCorrect = false;

      // Handle different question types
      if (question.type === "mcq" || question.type === "true/false") {
        // Exact match for MCQ and true/false
        isCorrect = question.correctAnswer === userAnswer;
      } else if (question.type === "one word") {
        // Case insensitive match for one word
        isCorrect = question.correctAnswer.trim().toLowerCase() === userAnswer.trim().toLowerCase();
      }
      
      if (isCorrect) {
        correctCount++;
      }

      return {
        questionIndex: index,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
      };
    });

    const score = {
      total: quiz.questions.length,
      correct: correctCount,
      percentage: Math.round((correctCount / quiz.questions.length) * 100),
    };

    res.json({
      score,
      results,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    res.status(500).json({ error: "Failed to submit quiz" });
  }
};

