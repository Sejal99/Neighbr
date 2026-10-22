import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";
import type { CreateSocietyInput } from "./schema";

export const createSociety = async (
  input: CreateSocietyInput,
  userId: string,
) => {
  const society = await prisma.societies.create({
    data: {
      name: input.name,
      address: input.address,
      timezone: input.timezone,
      society_memberships: {
        create: {
          user_id: userId,
          role: "admin",
        },
      },
    },
    include: {
      society_memberships: true,
    },
  });

  return society;
};

export const getMySociety = async (userId: string) => {
  const membership = await prisma.society_memberships.findFirst({
    where: {
      user_id: userId,
    },
    include: {
      societies: true,
    },
  });

  return membership;
};

export const getSocietyById = async (societyId: string) => {
  const societyDetails = await prisma.societies.findUnique({
    where: {
      id: societyId,
    },
    include: {
      society_memberships: true,
    },
  });
  return societyDetails;
};

export const getSocietyMembers = async (societyId: string) => {
  const memberDetails = await prisma.society_memberships.findMany({
    where: { id: societyId },
    include: {
      users: {
        select: {
          id: true,
          full_name: true,
          email: true,
        },
      },
    },
  });
  return memberDetails;
};


export const addSocietyMember = async (
  societyId: string,
  userId: string,
  role: string,
  unitNumber?: string,
  requesterId?: string,
) => {
  const requester = await prisma.society_memberships.findFirst({
    where: {
      society_id: societyId,
      user_id: requesterId,
      role: "admin",
    },
  });

  if (!requester) {
    throw new AppError(403, "Only society admins can add members");
  }

  const membership = await prisma.society_memberships.create({
    data: {
      society_id: societyId,
      user_id: userId,
      role,
      unit_number: unitNumber,
    },
  });

  return membership;
};

export const updateSocietyMember = async (
  societyId: string,
  membershipId: string,
  requesterId: string,
  input: {
    role?: "resident" | "staff";
    unitNumber?: string | null;
  },
) => {
  const requester = await prisma.society_memberships.findFirst({
    where: {
      society_id: societyId,
      user_id: requesterId,
      role: "admin",
    },
  });

  if (!requester) {
    throw new AppError(403, "Only society admins can update members");
  }

  const membership = await prisma.society_memberships.updateMany({
    where: {
      id: membershipId,
      society_id: societyId,
    },
    data: {
      ...(input.role !== undefined && { role: input.role }),
      ...(input.unitNumber !== undefined && {
        unit_number: input.unitNumber,
      }),
    },
  });

  if (membership.count === 0) {
    throw new AppError(404, "Society member not found");
  }

  return prisma.society_memberships.findUnique({
    where: {
      id: membershipId,
    },
  });
};
