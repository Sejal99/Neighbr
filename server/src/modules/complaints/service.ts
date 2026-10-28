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
  return prisma.$transaction(async (tx) => {
    const updatedComplaint = await tx.complaints.update({
      where: {
        id: complaintId,
      },
      data: {
        status,
        updated_at: new Date(),
      },
    });

    await tx.complaint_status_history.create({
      data: {
        complaint_id: complaintId,
        changed_by: userId,
        old_status: complaint.status,
        new_status: status,
      },
    });

    return updatedComplaint;
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

export const getComplaintStatusHistory = async (
  complaintId: string,
  userId: string,
) => {
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
  });

  if (!complaint) {
    throw new AppError(404, "Complaint not found");
  }

  return prisma.complaint_status_history.findMany({
    where: {
      complaint_id: complaintId,
    },
    orderBy: {
      created_at: "asc",
    },
  });
};

export const createComplaintComment = async (
  complaintId: string,
  userId: string,
  comment: string,
) => {
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
  });

  if (!complaint) {
    throw new AppError(404, "Complaint not found");
  }

  const addComment = await prisma.complaint_comments.create({
    data: {
      complaint_id: complaintId,
      user_id: userId,
      comment,
    },
    include: {
      users: {
        select: {
          id: true,
          full_name: true,
        },
      },
    },
  });
  return addComment;
};

export const getComplaintComments = async (
  complaintId: string,
  userId: string,
) => {
  const membership = await prisma.society_memberships.findFirst({
    where: { user_id: userId },
  });

  if (!membership) {
    throw new AppError(400, "You do not belong to any society");
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

  return prisma.complaint_comments.findMany({
    where: { complaint_id: complaintId },
    include: {
      users: {
        select: {
          id: true,
          full_name: true,
        },
      },
    },
    orderBy: { created_at: "asc" },
  });
};
