import mongoose, { Schema, Document } from "mongoose";
const QuestionSchema = new Schema({
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
        required: function () {
            return this.type === "mcq";
        },
        validate: {
            validator: function (options) {
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
const QuizSchema = new Schema({
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
            validator: (questions) => questions.length > 0,
            message: "Quiz must have at least one question",
        },
    },
}, {
    timestamps: true,
});
export const Quiz = mongoose.model("Quiz", QuizSchema);
//# sourceMappingURL=Quiz.js.map