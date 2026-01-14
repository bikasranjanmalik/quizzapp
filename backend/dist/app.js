import express from "express";
import cors from "cors";
import quizRoutes from "./routes/quizRoutes.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/quizzes", quizRoutes);
export default app;
//# sourceMappingURL=app.js.map