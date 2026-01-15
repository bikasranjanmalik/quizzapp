import type { Request, Response } from "express";
import type { IQuestion } from "../models/Quiz.js";
interface CreateQuizRequest {
    title: string;
    description?: string;
    questions: IQuestion[];
}
interface SubmitAnswerRequest {
    answers: string[];
}
export declare const createQuiz: (req: Request<{}, {}, CreateQuizRequest>, res: Response) => Promise<void>;
export declare const getQuiz: (req: Request<{
    id: string;
}>, res: Response) => Promise<void>;
export declare const listQuizzes: (req: Request, res: Response) => Promise<void>;
export declare const submitQuiz: (req: Request<{
    id: string;
}, {}, SubmitAnswerRequest>, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=quizController.d.ts.map