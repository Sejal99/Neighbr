import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware";
import { createBookingSchema } from "./schema";
import {
  cancelBooking,
  createBooking,
  getBookingById,
  getBookings,
  getFacilityBookings,
} from "./service";

export const createBookingController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const input = createBookingSchema.parse(req.body);

    const booking = await createBooking(
      req.userId!,
      input.facility_id,
      input.booking_date,
      input.start_time,
      input.end_time,
    );

    res.status(201).json({
      message: "Facility booked successfully",
      booking,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingsController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const booking = await getBookings(req.userId!);
    res.status(200).json({ booking });
  } catch (error) {
    next(error);
  }
};

export const getBookingsControllerById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bookingId = String(req.params.bookingId);
    const booking = await getBookingById(req.userId!, bookingId);
    res.status(200).json({ booking });
  } catch (error) {
    next(error);
  }
};

export const cancelBookingController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bookingId = String(req.params.bookingId);

    const booking = await cancelBooking(req.userId!, bookingId);

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    next(error);
  }
};

export const getFacilityBookingsController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const facilityId = String(req.params.facilityId);

    const bookings = await getFacilityBookings(
      req.userId!,
      facilityId,
    );

    res.status(200).json({ bookings });
  } catch (error) {
    next(error);
  }
};