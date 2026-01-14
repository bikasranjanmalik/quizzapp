import mongoose, { Schema, Document } from "mongoose";

// Question Type Definitions
export type QuestionType = "mcq" | "boolean";

// Base Question Interface - Flat structure
export interface IQuestion {
  _id?: mongoose.Types.ObjectId;
  question: string;
  type: QuestionType;
  // For MCQ: options array and correctAnswer as string (one of the options)
  // For Boolean: correctAnswer as boolean, options can be undefined
  options?: string[];
  correctAnswer: string | boolean;
}

// Quiz Interface
export interface IQuiz extends Document {
  title: string;
  description?: string; // Optional description
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

// Question Schema - Flat and simple
const QuestionSchema = new Schema<IQuestion>(
  {
    question: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
      minlength: [1, "Question text cannot be empty"],
    },
    type: {
      type: String,
      enum: {
        values: ["mcq", "boolean"],
        message: "Question type must be either 'mcq' or 'boolean'",
      },
      required: [true, "Question type is required"],
    },
    options: {
      type: [String],
      required: false, // Not always required, validated conditionally
      validate: {
        validator: function (options: string[] | undefined) {
          const question = this as unknown as IQuestion;
          // For MCQ: options are required and must have at least 2
          if (question.type === "mcq") {
            return options !== undefined && options.length >= 2;
          }
          // For Boolean: options are not needed
          return true;
        },
        message: "MCQ questions must have at least 2 options",
      },
    },
    correctAnswer: {
      type: Schema.Types.Mixed,
      required: [true, "Correct answer is required"],
      validate: {
        validator: function (correctAnswer: string | boolean) {
          const question = this as unknown as IQuestion;
          // For MCQ: correctAnswer must be a string and must be in options
          if (question.type === "mcq") {
            if (typeof correctAnswer !== "string") {
              return false;
            }
            return question.options?.includes(correctAnswer) ?? false;
          }
          // For Boolean: correctAnswer must be a boolean
          if (question.type === "boolean") {
            return typeof correctAnswer === "boolean";
          }
          return false;
        },
        message: function (this: unknown) {
          const question = this as unknown as IQuestion;
          if (question.type === "mcq") {
            return "MCQ correct answer must be a string that matches one of the options";
          }
          return "Boolean correct answer must be true or false";
        },
      },
    },
  },
  {
    _id: true, // Explicitly enable _id for subdocuments
  }
);

// Quiz Schema - Clean and flat
const QuizSchema = new Schema<IQuiz>(
  {
    title: {
      type: String,
      required: [true, "Quiz title is required"],
      trim: true,
      minlength: [1, "Quiz title cannot be empty"],
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    questions: {
      type: [QuestionSchema],
      required: [true, "Quiz must have at least one question"],
      validate: {
        validator: function (questions: IQuestion[]) {
          return Array.isArray(questions) && questions.length > 0;
        },
        message: "Quiz must contain at least one question",
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create and export the model
export const Quiz = mongoose.model<IQuiz>("Quiz", QuizSchema);

