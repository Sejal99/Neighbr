
import bcrypt from "bcrypt";
import { pool } from "../../config/database";
import type { RegisterInput,LoginInput } from "./auth.schema";
import { AppError } from "../../utils/AppError";
import jwt from "jsonwebtoken";

export async function registerUser(input: RegisterInput) {
  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();

  const existingUser = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email],
  );

  if (existingUser.rowCount && existingUser.rowCount > 0) {
    const error = new Error("Email is already registered");
    Object.assign(error, { statusCode: 409 });
    throw error;
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const result = await pool.query(
    `INSERT INTO users (full_name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, full_name, email, created_at`,
    [fullName, email, passwordHash],
  );

  return result.rows[0];
}



export async function loginUser(input: LoginInput) {
  const email = input.email.trim().toLowerCase();

  const result = await pool.query(
    `SELECT id, full_name, email, password_hash
     FROM users
     WHERE email = $1`,
    [email],
  );

  const user = result.rows[0];

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
}


export async function getCurrentUser(userId: string) {
  const result = await pool.query(
    `SELECT id, full_name, email, created_at
     FROM users
     WHERE id = $1`,
    [userId],
  );

  const user = result.rows[0];

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;
}
