import mongoose, { Schema, Document } from "mongoose";

export type QuestionType = "mcq" | "boolean";

export interface IQuestion {
  _id?: mongoose.Types.ObjectId;
  question: string;
  type: QuestionType;
  options?: string[]; // Required for MCQ
  correctAnswer: string | boolean; // string for MCQ, boolean for boolean type
}

export interface IQuiz extends Document {
  title: string;
  description?: string;
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["mcq", "boolean"],
    required: true,
  },
  options: {
    type: [String],
    required: function (this: IQuestion) {
      return this.type === "mcq";
    },
    validate: {
      validator: function (this: IQuestion, options: string[] | undefined) {
        if (this.type === "mcq") {
          return options && options.length >= 2;
        }
        return true;
      },
      message: "MCQ questions must have at least 2 options",
    },
  },
  correctAnswer: {
    type: Schema.Types.Mixed,
    required: true,
  },
});

const QuizSchema = new Schema<IQuiz>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    questions: {
      type: [QuestionSchema],
      required: true,
      validate: {
        validator: (questions: IQuestion[]) => questions.length > 0,
        message: "Quiz must have at least one question",
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Quiz = mongoose.model<IQuiz>("Quiz", QuizSchema);

