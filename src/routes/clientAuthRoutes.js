import { Router } from "express";
import { clientLogin, clientSession, clientSignup, logout } from "../controllers/authController.js";
import { requireSessionRole } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/signup", clientSignup);
router.post("/login", clientLogin);
router.post("/logout", requireSessionRole("client"), logout);
router.get("/session", requireSessionRole("client"), clientSession);

export default router;
