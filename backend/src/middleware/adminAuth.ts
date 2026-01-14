import type { Request, Response, NextFunction } from "express";

// Simple admin authentication middleware
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  // Get admin credentials from environment variables
  const adminName = process.env.ADMIN_NAME || "Bikash Malik";
  const adminPassword = process.env.ADMIN_PASSWORD || "BikashMalik@123";

  // Get credentials from request headers
  const providedName = req.headers["x-admin-name"] as string;
  const providedPassword = req.headers["x-admin-password"] as string;

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

