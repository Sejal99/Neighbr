import { Router } from "express";
import { addSocietyMemberController, createSocietyController, getMySocietyController, getSocietyByIdController, getSocietyMembersController, updateSocietyMemberController } from "./controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createSocietyController);
router.get("/me", authMiddleware, getMySocietyController);
router.get("/:societyId", authMiddleware, getSocietyByIdController);
router.get("/:societyId/members",authMiddleware,getSocietyMembersController);
router.post("/:societyId/members",authMiddleware,addSocietyMemberController);
router.patch("/:societyId/members/:membershipId",authMiddleware,updateSocietyMemberController);

export default router;