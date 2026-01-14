
we are building  quiz mangement  System-Plan

# assumptions
-no authentication requried 
-single admin
-user can take quiz anonymoulsy


##scope
#Included 
-create quiz with mcq and true/false question
 -public  quiz-taking page
 -score calculation and display

 # excluded 
 -auth
 -editing quizzes
 -timer
 -advance ui


 ##Architeture
 ##frontent : React+typescript
 backend :Node.js +express +typescript
database-MongoDB atlas
  add more details in it 







































import mongoose, { Schema, Document } from "mongoose";

// Question Type Definitions
export type QuestionType = "mcq" | "true/false" | "one word";

// Base Question Interface - Flat structure
export interface IQuestion {
  _id?: mongoose.Types.ObjectId;
  question: string;
  type: QuestionType;
  // For MCQ: options array and correctAnswer as string (one of the options)
  // For true/false: correctAnswer as string ("true" or "false"), no options needed
  // For one word: correctAnswer as string (case insensitive match), no options needed
  options?: string[];
  correctAnswer: string;
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
        values: ["mcq", "true/false", "one word"],
        message: "Question type must be 'mcq', 'true/false', or 'one word'",
      },
      required: [true, "Question type is required"],
    },
    options: {
      type: [String],
      required: false, // Only required for MCQ
      validate: {
        validator: function (options: string[] | undefined) {
          const question = this as unknown as IQuestion;
          // For MCQ: options are required and must have at least 2
          if (question.type === "mcq") {
            return options !== undefined && options.length >= 2;
          }
          // For other types: options are not needed
          return true;
        },
        message: "MCQ questions must have at least 2 options",
      },
    },
    correctAnswer: {
      type: String,
      required: [true, "Correct answer is required"],
      validate: {
        validator: function (correctAnswer: string) {
          const question = this as unknown as IQuestion;
          // For MCQ: correctAnswer must be in options
          if (question.type === "mcq") {
            return question.options?.includes(correctAnswer) ?? false;
          }
          // For true/false: correctAnswer must be "true" or "false"
          if (question.type === "true/false") {
            return correctAnswer === "true" || correctAnswer === "false";
          }
          // For one word: correctAnswer must be a non-empty string
          if (question.type === "one word") {
            return typeof correctAnswer === "string" && correctAnswer.trim().length > 0;
          }
          return false;
        },
        message: function (this: unknown) {
          const question = this as unknown as IQuestion;
          if (question.type === "mcq") {
            return "MCQ correct answer must match one of the options";
          }
          if (question.type === "true/false") {
            return "True/false correct answer must be 'true' or 'false'";
          }
          return "One word correct answer must be a non-empty string";
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

  this is my sechema i want to add rough idea in plan.md about this sechema 