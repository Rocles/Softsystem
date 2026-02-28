import { Router } from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import { requireSessionRole } from "../middleware/authMiddleware.js";
import {
  accessClientTicket,
  createCheckoutSession,
  createTicketPublic,
  downloadReceipt,
  getClientTicket,
  listMyTickets,
  mockPayTicket,
  postClientMessage,
  submitCompanyInquiry,
  submitContractRequest,
  submitAssessmentResult,
  submitJobApplication
} from "../controllers/publicController.js";

const router = Router();

router.post("/tickets", upload.single("attachment"), createTicketPublic);
router.post("/contracts/request", submitContractRequest);
router.post("/jobs/apply", upload.single("cv"), submitJobApplication);
router.post("/jobs/assessment/submit", submitAssessmentResult);
router.post("/companies/become-client", submitCompanyInquiry);
router.post("/client/access", accessClientTicket);
router.get("/client/my/tickets", requireSessionRole("client"), listMyTickets);
router.get("/customer/tickets", requireSessionRole("client"), listMyTickets);
router.get("/client/tickets/:ticketId", getClientTicket);
router.post("/client/tickets/:ticketId/messages", upload.single("attachment"), postClientMessage);
router.post("/client/tickets/:ticketId/pay/checkout", createCheckoutSession);
router.post("/client/tickets/:ticketId/pay/mock", mockPayTicket);
router.get("/client/tickets/:ticketId/receipt", downloadReceipt);

export default router;
