import Stripe from "stripe";
import { env } from "../config/env.js";

export const stripe = env.stripeSecretKey && !env.stripeSecretKey.includes("xxx")
  ? new Stripe(env.stripeSecretKey)
  : null;

export const isStripeConfigured = Boolean(stripe && env.stripeWebhookSecret && !env.stripeWebhookSecret.includes("xxx"));