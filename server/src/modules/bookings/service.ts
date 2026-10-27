import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";

export const createBooking = async (
  userId: string,
  facilityId: string,
  bookingDate: string,
  startTime: string,
  endTime: string,
) => {
  const membership = await prisma.society_memberships.findFirst({
    where: {
      user_id: userId,
    },
  });

  if (!membership) {
    throw new AppError(400, "You do not belong to any society");
  }

  const facility = await prisma.facilities.findFirst({
    where: {
      id: facilityId,
      societyId: membership.society_id,
      is_active: true,
    },
  });

  if (!facility) {
    throw new AppError(404, "Active facility not found");
  }

  if (endTime <= startTime) {
    throw new AppError(400, "End time must be after start time");
  }

  const existingBooking = await prisma.facility_bookings.findFirst({
    where: {
      facility_id: facilityId,
      booking_date: new Date(`${bookingDate}T00:00:00.000Z`),
      status: "confirmed",
      start_time: { lt: new Date(`1970-01-01T${endTime}Z`) },
      end_time: { gt: new Date(`1970-01-01T${startTime}Z`) },
    },
  });

  if (existingBooking) {
    throw new AppError(409, "This time slot is already booked");
  }

  return prisma.facility_bookings.create({
    data: {
      facility_id: facilityId,
      user_id: userId,
      booking_date: new Date(`${bookingDate}T00:00:00.000Z`),
      start_time: new Date(`1970-01-01T${startTime}Z`),
      end_time: new Date(`1970-01-01T${endTime}Z`),
    },
  });
};

export const getBookings = async (userId: string) => {
  return prisma.facility_bookings.findMany({
    where: {
      user_id: userId,
    },
    include: { facilities: true },
    orderBy: { booking_date: "desc" },
  });
};

export const getBookingById = async (userId: string, bookingId: string) => {
  const booking = await prisma.facility_bookings.findFirst({
    where: {
      id: bookingId,
      user_id: userId,
    },
    include: { facilities: true },
  });

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  return booking;
};

export const cancelBooking = async (userId: string, bookingId: string) => {
  const booking = await prisma.facility_bookings.findFirst({
    where: {
      id: bookingId,
      user_id: userId,
      status: "confirmed",
    },
  });

  if (!booking) {
    throw new AppError(404, "Active booking not found");
  }

  return prisma.facility_bookings.update({
    where: { id: bookingId },
    data: { status: "cancelled" },
  });
};

export const getFacilityBookings = async (
  userId: string,
  facilityId: string,
) => {
  const facility = await prisma.facilities.findFirst({
    where: {
      id: facilityId,
      society_id: (
        await prisma.society_memberships.findFirst({
          where: { user_id: userId },
        })
      )?.society_id,
    },
  });

  if (!facility) {
    throw new AppError(404, "Facility not found");
  }

  return prisma.facility_bookings.findMany({
    where: {
      facility_id: facilityId,
    },
    orderBy: {
      booking_date: "asc",
    },
  });
};