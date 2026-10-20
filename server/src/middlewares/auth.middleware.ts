
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";

export interface AuthRequest extends Request {
  userId?: string;
}

export function authMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    next(new AppError(401, "Authentication token is required"));
    return;
  }

  const token = authorization.slice(7);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    next(new Error("JWT_SECRET is not configured"));
    return;
  }

  try {
    const payload = jwt.verify(token, secret);

    if (typeof payload === "string" || typeof payload.sub !== "string") {
      next(new AppError(401, "Invalid authentication token"));
      return;
    }

    req.userId = payload.sub;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(401, "Invalid or expired token"));
      return;
    }

    next(error);
  }
}
