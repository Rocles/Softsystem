import { Router } from "express";
import { adminLogin, adminSession, logout } from "../controllers/authController.js";
import { requireSessionRole } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login", adminLogin);
router.post("/logout", requireSessionRole("admin"), logout);
router.get("/session", requireSessionRole("admin"), adminSession);

export default router;