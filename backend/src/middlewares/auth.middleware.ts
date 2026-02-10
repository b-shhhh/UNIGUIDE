import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/index"; // adjust path if needed
import { HttpError } from "../errors/http-error";

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: { id: string };
}

interface JwtPayload {
  userId: string;
}

// Protect middleware
export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new HttpError(401, "Not authorized"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = { id: decoded.userId }; // attach user info
    next();
  } catch (err) {
    return next(new HttpError(401, "Token invalid or expired"));
  }
};
