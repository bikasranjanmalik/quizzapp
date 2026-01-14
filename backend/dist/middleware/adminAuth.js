export const requireAdmin = (req, res, next) => {
    const adminName = process.env.ADMIN_NAME || "Bikash Malik";
    const adminPassword = process.env.ADMIN_PASSWORD || "BikashMalik@123";
    const providedName = req.headers["x-admin-name"];
    const providedPassword = req.headers["x-admin-password"];
    if (!providedName || !providedPassword) {
        res.status(401).json({ error: "Admin credentials required" });
        return;
    }
    if (providedName !== adminName || providedPassword !== adminPassword) {
        res.status(403).json({ error: "Invalid admin credentials" });
        return;
    }
    next();
};
//# sourceMappingURL=adminAuth.js.map