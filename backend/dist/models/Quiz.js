import mongoose, { Schema, Document } from "mongoose";
const QuestionSchema = new Schema({
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
        required: false,
        validate: {
            validator: function (options) {
                const question = this;
                if (question.type === "mcq") {
                    return options !== undefined && options.length >= 2;
                }
                return true;
            },
            message: "MCQ questions must have at least 2 options",
        },
    },
    correctAnswer: {
        type: String,
        required: [true, "Correct answer is required"],
        validate: {
            validator: function (correctAnswer) {
                const question = this;
                if (question.type === "mcq") {
                    return question.options?.includes(correctAnswer) ?? false;
                }
                if (question.type === "true/false") {
                    return correctAnswer === "true" || correctAnswer === "false";
                }
                if (question.type === "one word") {
                    return typeof correctAnswer === "string" && correctAnswer.trim().length > 0;
                }
                return false;
            },
            message: function () {
                const question = this;
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
}, {
    _id: true,
});
const QuizSchema = new Schema({
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
            validator: function (questions) {
                return Array.isArray(questions) && questions.length > 0;
            },
            message: "Quiz must contain at least one question",
        },
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});
// Create and export the model
export const Quiz = mongoose.model("Quiz", QuizSchema);
//# sourceMappingURL=Quiz.js.map