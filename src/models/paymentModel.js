import { db } from "../config/db.js";

export const getTicketByStripeSession = (sessionId) => {
  return db.prepare("SELECT * FROM tickets WHERE stripe_checkout_session_id = ?").get(sessionId);
};