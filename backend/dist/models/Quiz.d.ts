import mongoose, { Document } from "mongoose";
export type QuestionType = "mcq" | "true/false" | "one word";
export interface IQuestion {
    _id?: mongoose.Types.ObjectId;
    question: string;
    type: QuestionType;
    options?: string[];
    correctAnswer: string;
}
export interface IQuiz extends Document {
    title: string;
    description?: string;
    questions: IQuestion[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const Quiz: mongoose.Model<IQuiz, {}, {}, {}, mongoose.Document<unknown, {}, IQuiz, {}, mongoose.DefaultSchemaOptions> & IQuiz & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IQuiz>;
//# sourceMappingURL=Quiz.d.ts.map