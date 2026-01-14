import mongoose from "mongoose";
export const connectDatabase = async () => {
    let mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/quiz";
    if (mongoUri.endsWith("/")) {
        mongoUri = `${mongoUri}quiz`;
    }
    try {
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
//# sourceMappingURL=database.js.map