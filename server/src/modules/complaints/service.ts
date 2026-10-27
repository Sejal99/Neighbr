import { prisma } from "../../config/prisma";
import { AppError } from "../../utils/AppError";

export const createComplaint = async (
  userId: string,
  title: string,
  description: string,
  category: string,
) => {
  const membership = await prisma.society_memberships.findFirst({
    where: {
      user_id: userId,
    },
  });

  if (!membership) {
    throw new AppError(400, "You do not belong to any society");
  }

  const complaint = await prisma.complaints.create({
    data: {
      society_id: membership.society_id,
      user_id: userId,
      title,
      description,
      category,
    },
  });

  return complaint;
};

export const getComplaints = async (userId: string) => {
  const membership = await prisma.society_memberships.findFirst({
    where: {
      user_id: userId,
    },
  });

  if (!membership) {
    throw new AppError(400, "You do not belong to any society");
  }

  const complaints = await prisma.complaints.findMany({
    where: {
      society_id: membership.society_id,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return complaints;
};

export const getComplaintById = async (complaintId: string, userId: string) => {
  const membership = await prisma.society_memberships.findFirst({
    where: {
      user_id: userId,
    },
  });

  if (!membership) {
    throw new AppError(400, "You do not belong to any society");
  }

  const complaint = await prisma.complaints.findFirst({
    where: {
      id: complaintId,
      society_id: membership.society_id,
    },
    include: {
      assigned_user: {
        select: {
          id: true,
          full_name: true,
          email: true,
        },
      },
    },
  });

  if (!complaint) {
    throw new AppError(404, "Complaint not found");
  }

  return complaint;
};

export const updateComplaintStatus = async (
  complaintId: string,
  userId: string,
  status: "open" | "in_progress" | "resolved" | "closed",
) => {
  const membership = await prisma.society_memberships.findFirst({
    where: {
      user_id: userId,
      role: {
        in: ["admin", "staff"],
      },
    },
  });

  if (!membership) {
    throw new AppError(403, "Only admins or staff can update complaint status");
  }

  const complaint = await prisma.complaints.findFirst({
    where: {
      id: complaintId,
      society_id: membership.society_id,
    },
  });

  if (!complaint) {
    throw new AppError(404, "Complaint not found");
  }

  return prisma.complaints.update({
    where: {
      id: complaintId,
    },
    data: {
      status,
      updated_at: new Date(),
    },
  });
};

export const assignComplaint = async (
  userId: string,
  complaintId: string,
  assignedTo: string,
) => {
  const membership = await prisma.society_memberships.findFirst({
    where: {
      user_id: userId,
      role: "admin",
    },
  });

  if (!membership) {
    throw new AppError(403, "Only admins can assign complaints");
  }

  const staffMembership = await prisma.society_memberships.findFirst({
    where: {
      user_id: assignedTo,
      society_id: membership.society_id,
      role: "staff",
    },
  });

  if (!staffMembership) {
    throw new AppError(400, "Assigned user must be staff in your society");
  }

  const complaint = await prisma.complaints.findFirst({
    where: {
      id: complaintId,
      society_id: membership.society_id,
    },
  });

  if (!complaint) {
    throw new AppError(404, "Complaint not found");
  }

  return prisma.complaints.update({
    where: {
      id: complaintId,
    },
    data: {
      assigned_to: assignedTo,
    },
  });
};
