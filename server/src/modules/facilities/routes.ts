import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createFacilityController, getFacilitiesController, getFacilityByIdController, updateFacilityAvailabilityController, updateFacilityController } from "./controller";

const router = Router();

router.post("/", authMiddleware, createFacilityController);
router.get("/getFacilities",authMiddleware,getFacilitiesController);
router.get("/:facilityId", authMiddleware, getFacilityByIdController);
router.patch("/:facilityId",authMiddleware,updateFacilityController);
router.patch("/:facilityId/availability",authMiddleware,updateFacilityAvailabilityController);

export default router;