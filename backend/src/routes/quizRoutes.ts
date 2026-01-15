import { Router } from "express";
import { createQuiz, getQuiz, submitQuiz, listQuizzes } from "../controllers/quizController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = Router();

router.get("/", requireAdmin, listQuizzes);
router.post("/", requireAdmin, createQuiz);
router.get("/:id", getQuiz);
router.post("/:id/submit", submitQuiz);

export default router;

