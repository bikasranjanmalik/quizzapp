import { Router } from "express";
import { createQuiz, getQuiz, submitQuiz } from "../controllers/quizController.js";

const router = Router();

// Simple admin check - can be extended with proper auth later
// For now, check for admin header (can be removed if not needed)
const isAdmin = (req: any): boolean => {
  // Simple check - can be extended with proper authentication
  // For now, allow all requests (as per "no authentication" requirement)
  // If you want admin-only creation, uncomment and set ADMIN_KEY in env:
  // return req.headers["x-admin-key"] === process.env.ADMIN_KEY;
  return true;
};

router.post("/", (req, res, next) => {
  if (!isAdmin(req)) {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  next();
}, createQuiz);

router.get("/:id", getQuiz);

router.post("/:id/submit", submitQuiz);

export default router;

