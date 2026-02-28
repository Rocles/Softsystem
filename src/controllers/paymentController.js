import { findTicketByCode, updateTicketFields } from "../models/ticketModel.js";
import { getTicketByStripeSession } from "../models/paymentModel.js";
import { stripe, isStripeConfigured } from "../services/stripeService.js";
import { logAction } from "../services/logService.js";

export const stripeWebhook = (req, res) => {
  if (!isStripeConfigured) {
    return res.status(400).send("Stripe webhook not configured");
  }

  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const ticket = getTicketByStripeSession(session.id);
    if (ticket) {
      updateTicketFields({
        id: ticket.id,
        fields: {
          payment_status: "paid",
          stripe_payment_intent_id: session.payment_intent || null
        }
      });
      logAction({ ticketId: ticket.id, actorRole: "system", actionType: "stripe_payment_confirmed", details: session.id });
    }
  }

  res.json({ received: true });
};

export const clientPaymentStatus = (req, res) => {
  const ticket = findTicketByCode(req.params.ticketId);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });
  res.json({ payment_status: ticket.payment_status, stripe_payment_intent_id: ticket.stripe_payment_intent_id });
};