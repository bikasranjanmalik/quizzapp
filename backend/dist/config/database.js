import mongoose from "mongoose";
export const connectDatabase = async () => {
    let mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error("MONGODB_URI environment variable is not set");
        process.exit(1);
        return;
    }
    // Remove any existing database name from URI and ensure we connect to 'test' database
    // Remove trailing slash
    mongoUri = mongoUri.trim().replace(/\/$/, "");
    // Extract base URI (without database name)
    const baseUriMatch = mongoUri.match(/^(mongodb\+srv:\/\/[^/]+)/);
    if (!baseUriMatch) {
        console.error("Invalid MongoDB URI format");
        process.exit(1);
        return;
    }
    const baseUri = baseUriMatch[1];
    const queryString = mongoUri.includes("?") ? mongoUri.substring(mongoUri.indexOf("?")) : "";
    // Construct URI with 'test' database
    const finalUri = `${baseUri}/test${queryString}`;
    try {
        await mongoose.connect(finalUri, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
        const dbName = mongoose.connection.db?.databaseName;
        console.log("Connected to MongoDB successfully");
        console.log("Database:", dbName || "unknown");
        console.log("Collection name: quizzes");
        console.log("Connection URI (masked):", finalUri.replace(/:[^:@]+@/, ":****@"));
    }
    catch (error) {
        console.error("MongoDB connection error:", error.message);
        console.error("Attempted URI (masked):", finalUri.replace(/:[^:@]+@/, ":****@"));
        process.exit(1);
    }
};
//# sourceMappingURL=database.js.map