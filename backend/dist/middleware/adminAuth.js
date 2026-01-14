// Simple admin authentication middleware
export const requireAdmin = (req, res, next) => {
    // Get admin credentials from environment variables
    const adminName = process.env.ADMIN_NAME || "Bikash Malik";
    const adminPassword = process.env.ADMIN_PASSWORD || "BikashMalik@123";
    // Get credentials from request headers
    const providedName = req.headers["x-admin-name"];
    const providedPassword = req.headers["x-admin-password"];
    // Validate credentials
    if (!providedName || !providedPassword) {
        res.status(401).json({ error: "Admin credentials required" });
        return;
    }
    if (providedName !== adminName || providedPassword !== adminPassword) {
        res.status(403).json({ error: "Invalid admin credentials" });
        return;
    }
    // Admin authenticated, proceed
    next();
};
//# sourceMappingURL=adminAuth.js.map