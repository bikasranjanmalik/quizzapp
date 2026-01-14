import { Router } from "express";
import { createQuiz, getQuiz, submitQuiz } from "../controllers/quizController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = Router();

router.post("/", requireAdmin, createQuiz);
router.get("/:id", getQuiz);

router.post("/:id/submit", submitQuiz);

export default router;

