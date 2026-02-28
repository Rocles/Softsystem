import { Router } from "express";
import { requireSessionRole } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  adminAddNote,
  adminAssignTech,
  adminCreateTech,
  adminGetTicket,
  adminListTechs,
  adminListTickets,
  adminPostMessage,
  adminResetTechPassword,
  adminSetPrice,
  adminSetStatus,
  adminTakeCharge,
  adminUpdateTech
} from "../controllers/adminController.js";

const router = Router();
router.use(requireSessionRole("admin"));

router.get("/tickets", adminListTickets);
router.get("/tickets/:ticketId", adminGetTicket);
router.post("/tickets/:ticketId/take-charge", adminTakeCharge);
router.patch("/tickets/:ticketId/status", adminSetStatus);
router.patch("/tickets/:ticketId/assign", adminAssignTech);
router.patch("/tickets/:ticketId/price", adminSetPrice);
router.post("/tickets/:ticketId/messages", upload.single("attachment"), adminPostMessage);
router.post("/tickets/:ticketId/notes", adminAddNote);

router.get("/techs", adminListTechs);
router.post("/techs", adminCreateTech);
router.patch("/techs/:id", adminUpdateTech);
router.post("/techs/:id/reset-password", adminResetTechPassword);

export default router;