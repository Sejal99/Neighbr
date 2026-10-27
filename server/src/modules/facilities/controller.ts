import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware";
import { createFacilitySchema, updateFacilityAvailabilitySchema, updateFacilitySchema } from "./schema";
import { createFacility, getFacilities, getFacilityById, updateFacility, updateFacilityAvailability } from "./service";
import { AppError } from "../../utils/AppError";

export const createFacilityController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const input = createFacilitySchema.parse(req.body);

    const facility = await createFacility(
      req.userId!,
      input.name,
      input.description,
    );

    res.status(201).json({
      message: "Facility created successfully",
      facility,
    });
  } catch (error) {
    next(error);
  }
};

export const getFacilitiesController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const facilities = await getFacilities(req.userId!);
    res.status(200).json({ facilities });
  } catch (error) {
    next(error);
  }
};

export const getFacilityByIdController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const facilityId = String(req.params.facilityId);

    const facility = await getFacilityById(req.userId!, facilityId);

    res.status(200).json({ facility });
  } catch (error) {
    next(error);
  }
};

export const updateFacilityController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const input = updateFacilitySchema.parse(req.body);
    const facilityId = String(req.params.facilityId);

    if (Object.keys(input).length === 0) {
      throw new AppError(400, "Provide at least one field to update");
    }

    const facility = await updateFacility(
      req.userId!,
      facilityId,
      input,
    );

    res.status(200).json({
      message: "Facility updated successfully",
      facility,
    });
  } catch (error) {
    next(error);
  }
};


export const updateFacilityAvailabilityController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const input = updateFacilityAvailabilitySchema.parse(req.body);
    const facilityId = String(req.params.facilityId);

    const facility = await updateFacilityAvailability(
      req.userId!,
      facilityId,
      input.is_active,
    );

    res.status(200).json({
      message: "Facility availability updated successfully",
      facility,
    });
  } catch (error) {
    next(error);
  }
};