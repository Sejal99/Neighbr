
import { Router } from "express";
import { getMe, login, register } from "./controller";
import { authMiddleware, type AuthRequest } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);

export default router;
