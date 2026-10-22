import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware";
import { AppError } from "../../utils/AppError";
import { addSocietyMemberSchema, createSocietySchema, updateSocietyMemberSchema } from "./schema";
import {
  addSocietyMember,
  createSociety,
  getMySociety,
  getSocietyById,
  getSocietyMembers,
  updateSocietyMember,
} from "./service";

export const createSocietyController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.userId) {
      throw new AppError(401, "Authentication required");
    }

    const input = createSocietySchema.parse(req.body);
    const society = await createSociety(input, req.userId);

    res.status(201).json({
      message: "Society created successfully",
      society,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({
        message: "Invalid society details",
      });
      return;
    }

    next(error);
  }
};

export const getMySocietyController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.userId) {
      throw new AppError(401, "Authentication required");
    }

    const membership = await getMySociety(req.userId);

    if (!membership) {
      res.status(404).json({
        message: "You do not belong to any society",
      });
      return;
    }

    res.status(200).json({
      society: membership.societies,
      membership: {
        role: membership.role,
        unitNumber: membership.unit_number,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSocietyByIdController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const societyId = String(req.params.societyId);

    const society = await getSocietyById(societyId);

    if (!society) {
      throw new AppError(404, "Society not found");
    }

    res.status(200).json({ society });
  } catch (error) {
    next(error);
  }
};

export const getSocietyMembersController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const societyId = String(req.params.societyId);
    const memberDetails = await getSocietyMembers(societyId);
    res.status(200).json({ memberDetails });
  } catch (error) {
    next(error);
  }
};

export const addSocietyMemberController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const societyId = String(req.params.societyId);
    const input = addSocietyMemberSchema.parse(req.body);

    const membership = await addSocietyMember(
      societyId,
      input.userId,
      input.role,
      input.unitNumber,
      req.userId,
    );
    res.status(201).json({
      message: "Member added successfully",
      membership,
    });
  } catch (error) {
    next(error);
  }
};


export const updateSocietyMemberController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const societyId = String(req.params.societyId);
  const membershipId = String(req.params.membershipId);
    const input = updateSocietyMemberSchema.parse(req.body);

    const membership = await updateSocietyMember(
      societyId,
      membershipId,
      req.userId!,
      input,
    );

    res.status(200).json({
      message: "Society member updated successfully",
      membership,
    });
  } catch (error) {
    next(error);
  }
};