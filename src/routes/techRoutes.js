import { Router } from "express";
import { requireSessionRole } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  techAddNote,
  techGetTicket,
  techListTickets,
  techPostMessage,
  techUpdateStatus
} from "../controllers/techController.js";

const router = Router();
router.use(requireSessionRole("tech"));

router.get("/tickets", techListTickets);
router.get("/tickets/:ticketId", techGetTicket);
router.post("/tickets/:ticketId/messages", upload.single("attachment"), techPostMessage);
router.post("/tickets/:ticketId/notes", techAddNote);
router.patch("/tickets/:ticketId/status", techUpdateStatus);

export default router;