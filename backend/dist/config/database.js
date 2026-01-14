import mongoose from "mongoose";
export const connectDatabase = async () => {
    let mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error("MONGODB_URI environment variable is not set");
        process.exit(1);
        return;
    }
    if (mongoUri.endsWith("/")) {
        mongoUri = `${mongoUri}quiz`;
    }
    else if (!mongoUri.includes("/") || mongoUri.match(/\/$/)) {
        if (!mongoUri.endsWith("/quiz") && !mongoUri.includes("?")) {
            mongoUri = `${mongoUri}/quiz`;
        }
    }
    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("Connected to MongoDB successfully");
    }
    catch (error) {
        console.error("MongoDB connection error:", error.message);
        console.error("Attempted URI:", mongoUri.replace(/:[^:@]+@/, ":****@"));
        process.exit(1);
    }
};
//# sourceMappingURL=database.js.map