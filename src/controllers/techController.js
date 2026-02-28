import path from "path";
import { env } from "../config/env.js";
import { addInternalNote, addMessage, listActionLogs, listInternalNotes, listMessages } from "../models/messageModel.js";
import { findTicketByCode, listAssignedTickets, updateTicketFields } from "../models/ticketModel.js";
import { logAction } from "../services/logService.js";
import { clean } from "../services/utils.js";

const allowedStatuses = ["in_progress", "waiting_client", "resolved", "closed"];

const mapTicket = (t) => ({
  ...t,
  attachment_url: t.attachment_path ? `${env.appBaseUrl}/${t.attachment_path}` : null
});

const ensureAssigned = (ticket, userId) => ticket && Number(ticket.assigned_to) === Number(userId);

export const techListTickets = (req, res) => {
  const status = clean(req.query.status, 20) || null;
  const tickets = listAssignedTickets({ technicianId: req.user.id, status }).map(mapTicket);
  res.json({ tickets });
};

export const techGetTicket = (req, res) => {
  const ticket = findTicketByCode(req.params.ticketId);
  if (!ensureAssigned(ticket, req.user.id)) return res.status(404).json({ message: "Ticket not found" });

  const messages = listMessages(ticket.id).map((m) => ({ ...m, attachment_url: m.attachment_path ? `${env.appBaseUrl}/${m.attachment_path}` : null }));
  const notes = listInternalNotes(ticket.id);
  const logs = listActionLogs(ticket.id);
  res.json({ ticket: mapTicket(ticket), messages, notes, logs });
};

export const techPostMessage = (req, res) => {
  const ticket = findTicketByCode(req.params.ticketId);
  if (!ensureAssigned(ticket, req.user.id)) return res.status(404).json({ message: "Ticket not found" });

  const message = clean(req.body.message, 3000);
  if (!message && !req.file) return res.status(400).json({ message: "Message or attachment required" });

  const attachmentPath = req.file ? `${path.basename(env.uploadDir)}/${req.file.filename}`.replace(/\\/g, "/") : null;
  addMessage({ ticketId: ticket.id, senderType: "tech", senderId: req.user.id, message: message || "[Attachment]", attachmentPath });
  logAction({ ticketId: ticket.id, actorId: req.user.id, actorRole: "tech", actionType: "tech_message" });
  res.status(201).json({ message: "Sent" });
};

export const techAddNote = (req, res) => {
  const ticket = findTicketByCode(req.params.ticketId);
  if (!ensureAssigned(ticket, req.user.id)) return res.status(404).json({ message: "Ticket not found" });

  const note = clean(req.body.note, 4000);
  if (!note) return res.status(400).json({ message: "Note required" });

  addInternalNote({ ticketId: ticket.id, techId: req.user.id, note });
  logAction({ ticketId: ticket.id, actorId: req.user.id, actorRole: "tech", actionType: "tech_internal_note" });
  res.status(201).json({ message: "Note saved" });
};

export const techUpdateStatus = (req, res) => {
  const ticket = findTicketByCode(req.params.ticketId);
  if (!ensureAssigned(ticket, req.user.id)) return res.status(404).json({ message: "Ticket not found" });

  const status = clean(req.body.status, 20);
  if (!allowedStatuses.includes(status)) return res.status(400).json({ message: "Invalid status" });

  const updated = updateTicketFields({ id: ticket.id, fields: { status } });
  logAction({ ticketId: ticket.id, actorId: req.user.id, actorRole: "tech", actionType: "tech_status_update", details: status });
  res.json({ ticket: updated });
};