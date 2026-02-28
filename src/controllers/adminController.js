import path from "path";
import { env } from "../config/env.js";
import { addInternalNote, addMessage, listMessages } from "../models/messageModel.js";
import { findTicketByCode, listAssignedTickets, listTickets, updateTicketFields } from "../models/ticketModel.js";
import {
  createTechnician,
  getUserByEmail,
  listTechnicians,
  resetTechnicianPassword,
  updateTechnician
} from "../models/userModel.js";
import { logAction } from "../services/logService.js";
import { clean, validateEmail } from "../services/utils.js";
import { getTicketInternalData } from "./publicController.js";

const allowedStatuses = ["new", "in_progress", "waiting_client", "resolved", "closed"];

const parseMoneyInput = (value) => {
  let raw = String(value ?? "").trim();
  if (!raw) return NaN;
  raw = raw.replace(/\s/g, "");

  const hasComma = raw.includes(",");
  const hasDot = raw.includes(".");
  if (hasComma && hasDot) {
    const lastComma = raw.lastIndexOf(",");
    const lastDot = raw.lastIndexOf(".");
    const decimalSep = lastComma > lastDot ? "," : ".";
    const thousandSep = decimalSep === "," ? "." : ",";
    raw = raw.split(thousandSep).join("");
    raw = raw.replace(decimalSep, ".");
  } else if (hasComma) {
    raw = raw.replace(",", ".");
  }

  return Number(raw);
};

const mapTicket = (t) => ({
  ...t,
  attachment_url: t.attachment_path ? `${env.appBaseUrl}/${t.attachment_path}` : null
});

export const adminListTickets = (req, res) => {
  const tickets = listTickets({
    status: clean(req.query.status, 20) || null,
    technicianId: req.query.technician || null,
    search: clean(req.query.search, 120) || null
  }).map(mapTicket);
  res.json({ tickets });
};

export const adminGetTicket = (req, res) => {
  const ticket = findTicketByCode(req.params.ticketId);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });

  const messages = listMessages(ticket.id).map((m) => ({
    ...m,
    attachment_url: m.attachment_path ? `${env.appBaseUrl}/${m.attachment_path}` : null
  }));
  const internal = getTicketInternalData(ticket.id);

  res.json({ ticket: mapTicket(ticket), messages, notes: internal.notes, logs: internal.logs });
};

export const adminTakeCharge = (req, res) => {
  const ticket = findTicketByCode(req.params.ticketId);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });

  const updated = updateTicketFields({ id: ticket.id, fields: { taken_by: req.user.id, status: "in_progress" } });
  logAction({ ticketId: ticket.id, actorId: req.user.id, actorRole: req.user.role, actionType: "ticket_taken_charge" });
  res.json({ ticket: updated });
};

export const adminSetStatus = (req, res) => {
  const ticket = findTicketByCode(req.params.ticketId);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });

  const status = clean(req.body.status, 20);
  if (!allowedStatuses.includes(status)) return res.status(400).json({ message: "Invalid status" });

  const updated = updateTicketFields({ id: ticket.id, fields: { status } });
  logAction({ ticketId: ticket.id, actorId: req.user.id, actorRole: req.user.role, actionType: "status_changed", details: status });
  res.json({ ticket: updated });
};

export const adminAssignTech = (req, res) => {
  const ticket = findTicketByCode(req.params.ticketId);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });

  if (ticket.payment_status !== "paid") {
    return res.status(400).json({ message: "Payment required before assignment" });
  }

  const techId = Number(req.body.techId || 0);
  const tech = listTechnicians().find((t) => Number(t.id) === techId && Number(t.is_active) === 1);
  if (!tech) return res.status(400).json({ message: "Technician not found or inactive" });

  const updated = updateTicketFields({ id: ticket.id, fields: { assigned_to: techId, status: "in_progress" } });
  logAction({
    ticketId: ticket.id,
    actorId: req.user.id,
    actorRole: req.user.role,
    actionType: "assigned_to_technician",
    details: `${tech.id}:${tech.name}`
  });

  res.json({ ticket: updated });
};

export const adminSetPrice = (req, res) => {
  const ticket = findTicketByCode(req.params.ticketId);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });

  const price = parseMoneyInput(req.body.price);
  if (!Number.isFinite(price) || price <= 0) return res.status(400).json({ message: "Invalid price" });

  const priceCents = Math.round(price * 100);
  const updated = updateTicketFields({ id: ticket.id, fields: { price_cents: priceCents, payment_status: "pending" } });
  logAction({ ticketId: ticket.id, actorId: req.user.id, actorRole: req.user.role, actionType: "price_set", details: String(priceCents) });

  res.json({ ticket: updated, paymentLink: `${env.appBaseUrl}/client/${ticket.ticket_code}?token=${ticket.access_token}` });
};

export const adminPostMessage = (req, res) => {
  const ticket = findTicketByCode(req.params.ticketId);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });
  const message = clean(req.body.message, 3000);
  if (!message && !req.file) return res.status(400).json({ message: "Message or attachment required" });

  const attachmentPath = req.file ? `${path.basename(env.uploadDir)}/${req.file.filename}`.replace(/\\/g, "/") : null;
  addMessage({ ticketId: ticket.id, senderType: "tech", senderId: req.user.id, message: message || "[Attachment]", attachmentPath });
  logAction({ ticketId: ticket.id, actorId: req.user.id, actorRole: req.user.role, actionType: "support_message" });
  res.status(201).json({ message: "Sent" });
};

export const adminAddNote = (req, res) => {
  const ticket = findTicketByCode(req.params.ticketId);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });
  const note = clean(req.body.note, 4000);
  if (!note) return res.status(400).json({ message: "Note required" });

  addInternalNote({ ticketId: ticket.id, techId: req.user.id, note });
  logAction({ ticketId: ticket.id, actorId: req.user.id, actorRole: req.user.role, actionType: "internal_note" });
  res.status(201).json({ message: "Note saved" });
};

export const adminListTechs = (_req, res) => {
  res.json({ techs: listTechnicians() });
};

export const adminCreateTech = (req, res) => {
  const name = clean(req.body.name, 120);
  const email = clean(req.body.email, 190).toLowerCase();
  const password = String(req.body.password || "");

  if (!name || !validateEmail(email) || password.length < 8) {
    return res.status(400).json({ message: "Valid name/email and password >= 8 required" });
  }

  const existing = getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ message: "Email already exists" });
  }

  try {
    const tech = createTechnician({ name, email, password });
    logAction({ actorId: req.user.id, actorRole: req.user.role, actionType: "tech_created", details: `${tech.id}` });
    res.status(201).json({ tech });
  } catch (error) {
    if (String(error.message || "").toLowerCase().includes("unique")) {
      return res.status(409).json({ message: "Email already exists" });
    }
    throw error;
  }
};

export const adminUpdateTech = (req, res) => {
  const id = Number(req.params.id || 0);
  const name = clean(req.body.name, 120);
  const email = clean(req.body.email, 190).toLowerCase();
  const isActive = Boolean(req.body.is_active);
  if (!id || !name || !validateEmail(email)) return res.status(400).json({ message: "Invalid payload" });

  const tech = updateTechnician({ id, name, email, isActive });
  logAction({ actorId: req.user.id, actorRole: req.user.role, actionType: "tech_updated", details: `${id}` });
  res.json({ tech });
};

export const adminResetTechPassword = (req, res) => {
  const id = Number(req.params.id || 0);
  const password = String(req.body.password || "");
  if (!id || password.length < 8) return res.status(400).json({ message: "Invalid payload" });

  resetTechnicianPassword({ id, password });
  logAction({ actorId: req.user.id, actorRole: req.user.role, actionType: "tech_password_reset", details: `${id}` });
  res.json({ message: "Password reset" });
};

export const adminTechTickets = (req, res) => {
  const tickets = listAssignedTickets({ technicianId: req.user.id, status: null }).map(mapTicket);
  res.json({ tickets });
};
