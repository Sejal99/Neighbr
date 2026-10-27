
import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { cancelBookingController, createBookingController, getBookingsController, getBookingsControllerById, getFacilityBookingsController } from "./controller";

const router = Router();

router.post("/", authMiddleware, createBookingController);
router.get("/getBookings",authMiddleware,getBookingsController);
router.get("/:bookingId",authMiddleware,getBookingsControllerById);
router.patch("/:bookingId/cancel", authMiddleware, cancelBookingController);
router.get("/facilityId/bookings",authMiddleware,getFacilityBookingsController)

export default router;
