import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
const PORT = process.env.PORT || 3000;
const startServer = async () => {
    await connectDatabase();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map