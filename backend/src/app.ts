import express from "express";
import cors from "cors";
import quizRoutes from "./routes/quizRoutes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://quizzapp-mocha.vercel.app",
  "https://hilarious-zuccutto-b708da.netlify.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/quizzes", quizRoutes);

export default app;