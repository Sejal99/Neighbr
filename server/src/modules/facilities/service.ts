import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";

export const createFacility = async (
  userId: string,
  name: string,
  description?: string,
) => {
  const membership = await prisma.society_memberships.findFirst({
    where: {
      user_id: userId,
      role: "admin",
    },
  });

  if (!membership) {
    throw new AppError(403, "Only admins can create facilities");
  }

  return prisma.facilities.create({
    data: {
      society_id: membership.society_id,
      name,
      description,
    },
  });
};

export const getFacilities = async (userId: string) => {
  const membership = await prisma.society_memberships.findFirst({
    where: {
      user_id: userId,
    },
  });

  if (!membership) {
    throw new AppError(400, "You do not belong to any society");
  }

  return prisma.facilities.findMany({
    where: {
      society_id: membership.society_id,
    },
    orderBy: {
      name: "asc",
    },
  });
};

export const getFacilityById = async (userId: string, facilityId: string) => {
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
      society_id: membership.society_id,
    },
  });

  if (!facility) {
    throw new AppError(404, "Facility not found");
  }

  return facility;
};

export const updateFacility = async (
  userId: string,
  facilityId: string,
  data: { name?: string; description?: string },
) => {
  const facility = await getFacilityById(userId, facilityId);

  const membership = await prisma.society_memberships.findFirst({
    where: {
      user_id: userId,
      role: "admin",
      society_id: facility.society_id,
    },
  });

  if (!membership) {
    throw new AppError(403, "Only admins can update facilities");
  }

  return prisma.facilities.update({
    where: { id: facilityId },
    data,
  });
};

export const updateFacilityAvailability = async (
  userId: string,
  facilityId: string,
  isActive: boolean,
) => {
  const facility = await getFacilityById(userId, facilityId);

  const membership = await prisma.society_memberships.findFirst({
    where: {
      user_id: userId,
      role: "admin",
      society_id: facility.society_id,
    },
  });

  if (!membership) {
    throw new AppError(403, "Only admins can update facility availability");
  }

  return prisma.facilities.update({
    where: { id: facilityId },
    data: { is_active: isActive },
  });
};





