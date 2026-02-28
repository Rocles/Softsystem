import { db } from "../config/db.js";

const stmt = db.prepare(`INSERT INTO action_logs (ticket_id, actor_id, actor_role, action_type, details) VALUES (?, ?, ?, ?, ?)`);

export const logAction = ({ ticketId = null, actorId = null, actorRole = null, actionType, details = "" }) => {
  stmt.run(ticketId, actorId, actorRole, actionType, details);
};