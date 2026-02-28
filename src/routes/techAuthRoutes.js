import { Router } from "express";
import { techLogin, techSession, logout } from "../controllers/authController.js";
import { requireSessionRole } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login", techLogin);
router.post("/logout", requireSessionRole("tech"), logout);
router.get("/session", requireSessionRole("tech"), techSession);

export default router;