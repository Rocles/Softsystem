import { db } from "../config/db.js";

export const listMessages = (ticketId) => {
  const sql = `
    SELECT m.*, u.name AS sender_name
    FROM messages m
    LEFT JOIN users u ON u.id = m.sender_id
    WHERE m.ticket_id = ?
    ORDER BY m.created_at ASC
  `;
  return db.prepare(sql).all(ticketId);
};

export const addMessage = ({ ticketId, senderType, senderId = null, message, attachmentPath = null }) => {
  const stmt = db.prepare(`
    INSERT INTO messages (ticket_id, sender_type, sender_id, message, attachment_path)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(ticketId, senderType, senderId, message, attachmentPath);
  return db.prepare("SELECT * FROM messages WHERE id = ?").get(result.lastInsertRowid);
};

export const listInternalNotes = (ticketId) => {
  const sql = `
    SELECT n.*, u.name AS tech_name
    FROM internal_notes n
    JOIN users u ON u.id = n.tech_id
    WHERE n.ticket_id = ?
    ORDER BY n.created_at ASC
  `;
  return db.prepare(sql).all(ticketId);
};

export const addInternalNote = ({ ticketId, techId, note }) => {
  const stmt = db.prepare("INSERT INTO internal_notes (ticket_id, tech_id, note) VALUES (?, ?, ?)");
  const result = stmt.run(ticketId, techId, note);
  return db.prepare("SELECT * FROM internal_notes WHERE id = ?").get(result.lastInsertRowid);
};

export const listActionLogs = (ticketId) => db.prepare("SELECT * FROM action_logs WHERE ticket_id = ? ORDER BY created_at ASC").all(ticketId);