import { Router } from "express";
import { createQuiz, getQuiz, submitQuiz } from "../controllers/quizController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = Router();

// Admin-only route: Create quiz
router.post("/", requireAdmin, createQuiz);

// Public routes: Get quiz and submit answers

router.get("/:id", getQuiz);

router.post("/:id/submit", submitQuiz);

export default router;

