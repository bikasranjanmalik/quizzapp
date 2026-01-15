import express from "express";
import cors from "cors";
import quizRoutes from "./routes/quizRoutes.js";
const app = express();
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://quizzapp-owq6.vercel.app",
    "https://hilarious-zuccutto-b708da.netlify.app",
];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) {
            callback(null, true);
            return;
        }
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        if (origin.includes(".vercel.app") || origin.includes(".netlify.app")) {
            callback(null, true);
            return;
        }
        callback(null, true);
    },
    credentials: true,
}));
app.use(express.json());
app.use("/api/quizzes", quizRoutes);
export default app;
//# sourceMappingURL=app.js.map