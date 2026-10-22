
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import type { RegisterInput, LoginInput } from "./schema";
import { AppError } from "../../utils/AppError";
import { prisma } from "../../config/prisma";

export const registerUser = async (input: RegisterInput) => {
  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();

  const existingUser = await prisma.users.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    throw new AppError(409, "Email is already registered");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  try {
    return await prisma.users.create({
      data: {
        full_name: fullName,
        email,
        password_hash: passwordHash,
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        created_at: true,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(409, "Email is already registered");
    }

    throw error;
  }
};

export const loginUser = async (input: LoginInput) => {
  const email = input.email.trim().toLowerCase();

  const user = await prisma.users.findUnique({
    where: { email },
    select: {
      id: true,
      full_name: true,
      email: true,
      password_hash: true,
    },
  });

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    input.password,
    user.password_hash,
  );

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password");
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign(
    { sub: user.id },
    secret,
    { expiresIn: "1h" },
  );

  return {
    token,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
    },
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      full_name: true,
      email: true,
      created_at: true,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;
};
