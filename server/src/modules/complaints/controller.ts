import type { Request, Response, NextFunction } from "express";
import { assignComplaintSchema, createComplaintCommentSchema, createComplaintSchema, updateComplaintStatusSchema } from "./schema";
import {
  assignComplaint,
  createComplaint,
  createComplaintComment,
  getComplaintById,
  getComplaintComments,
  getComplaints,
  getComplaintStatusHistory,
  updateComplaintStatus,
} from "./service";
import type { AuthRequest } from "../../middlewares/auth.middleware";

export const createComplaintController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const input = createComplaintSchema.parse(req.body);

    const complaint = await createComplaint(
      req.userId!,
      input.title,
      input.description,
      input.category,
    );

    res.status(201).json({
      message: "Complaint created successfully",
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

export const getComplaintsController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const complaints = await getComplaints(req.userId!);

    res.status(200).json({ complaints });
  } catch (error) {
    next(error);
  }
};

export const getComplaintByIdController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const complaintId = String(req.params.complaintId);

    const complaint = await getComplaintById(complaintId, req.userId!);

    res.status(200).json({ complaint });
  } catch (error) {
    next(error);
  }
};

export const updateComplaintStatusController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const complaintId = String(req.params.complaintId);
    const input = updateComplaintStatusSchema.parse(req.body);

    const complaint = await updateComplaintStatus(
      complaintId,
      req.userId!,
      input.status,
    );

    res.status(200).json({
      message: "Complaint status updated successfully",
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

export const assignComplaintController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const input = assignComplaintSchema.parse(req.body);
    const complaintId = String(req.params.complaintId);

    const complaint = await assignComplaint(
      req.userId!,
      complaintId,
      input.assigned_to,
    );

    res.status(200).json({
      message: "Complaint assigned successfully",
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

export const getComplaintStatusHistoryController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const complaintId = String(req.params.complaintId);

    const history = await getComplaintStatusHistory(
      complaintId,
      req.userId!,
    );

    res.status(200).json({ history });
  } catch (error) {
    next(error);
  }
};

export const createComplaintCommentController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const input = createComplaintCommentSchema.parse(req.body);
    const complaintId = String(req.params.complaintId);

    const comment = await createComplaintComment(
      complaintId,
      req.userId!,
      input.comment,
    );

    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    next(error);
  }
};

export const getComplaintCommentsController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const complaintId = String(req.params.complaintId);

    const comments = await getComplaintComments(
      complaintId,
      req.userId!,
    );

    res.status(200).json({ comments });
  } catch (error) {
    next(error);
  }
};
