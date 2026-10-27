import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createComplaintController, getComplaintByIdController, getComplaintsController, updateComplaintStatusController } from "./controller";

const router = Router();

router.post("/", authMiddleware, createComplaintController);
router.get("/", authMiddleware, getComplaintsController);
router.get("/:complaintId",authMiddleware,getComplaintByIdController);
router.patch("/:complaintId/status",authMiddleware,updateComplaintStatusController);

export default router;