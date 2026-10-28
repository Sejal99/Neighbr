import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { assignComplaintController, createComplaintCommentController, createComplaintController, getComplaintByIdController, getComplaintCommentsController, getComplaintsController, getComplaintStatusHistoryController, updateComplaintStatusController } from "./controller";

const router = Router();

router.post("/", authMiddleware, createComplaintController);
router.get("/", authMiddleware, getComplaintsController);
router.get("/:complaintId",authMiddleware,getComplaintByIdController);
router.patch("/:complaintId/status",authMiddleware,updateComplaintStatusController);
router.patch(":complaintId/assign",authMiddleware,assignComplaintController);
router.get("/:complaintId/history",authMiddleware,getComplaintStatusHistoryController);
router.post("/:complaintId/comments",authMiddleware,createComplaintCommentController);
router.get("/:complaintId/comments",authMiddleware,getComplaintCommentsController);

export default router;