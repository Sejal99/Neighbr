
import type { Request, Response, NextFunction } from "express";
import { loginSchema, registerSchema } from "./auth.schema";
import { getCurrentUser, loginUser, registerUser } from "./auth.service";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { AppError } from "../../utils/AppError";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const input = registerSchema.parse(req.body);
    const user = await registerUser(input);

    res.status(201).json({message: "Registration successful",user});
    
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({
        message: "Invalid registration details",
      });
      return;
    }

    next(error);
  }
}


export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const input = loginSchema.parse(req.body);
    const result = await loginUser(input);

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({
        message: "Invalid login details",
      });
      return;
    }

    next(error);
  }
}


export async function getMe(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.userId) {
      throw new AppError(401, "Authentication required");
    }

    const user = await getCurrentUser(req.userId);

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}


