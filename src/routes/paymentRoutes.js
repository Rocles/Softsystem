import express, { Router } from "express";
import { stripeWebhook } from "../controllers/paymentController.js";

const router = Router();
router.post("/stripe/webhook", express.raw({ type: "application/json" }), stripeWebhook);

export default router;