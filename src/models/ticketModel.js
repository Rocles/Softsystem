import { db } from "../config/db.js";

const findByCodeStmt = db.prepare("SELECT * FROM tickets WHERE ticket_code = ?");
const findByIdStmt = db.prepare("SELECT * FROM tickets WHERE id = ?");
const findByCodeAndEmailStmt = db.prepare("SELECT * FROM tickets WHERE ticket_code = ? AND lower(client_email) = lower(?)");
const findTicketByOwnAttachmentStmt = db.prepare("SELECT * FROM tickets WHERE attachment_path = ? LIMIT 1");
const findTicketByMessageAttachmentStmt = db.prepare(`
  SELECT t.*
  FROM tickets t
  JOIN messages m ON m.ticket_id = t.id
  WHERE m.attachment_path = ?
  ORDER BY m.id DESC
  LIMIT 1
`);

export const createTicket = ({
  clientName,
  clientEmail,
  clientPhone,
  company,
  category,
  priority,
  description,
  attachmentPath,
  accessToken,
  clientUserId
}) => {
  const year = new Date().getFullYear();
  const tempCode = `TMP-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const stmt = db.prepare(`
    INSERT INTO tickets (
      ticket_code, client_name, client_email, client_phone, company,
      category, priority, description, attachment_path, access_token, client_user_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    tempCode,
    clientName,
    clientEmail,
    clientPhone || null,
    company || null,
    category,
    priority,
    description,
    attachmentPath || null,
    accessToken,
    clientUserId || null
  );
  const ticketId = Number(result.lastInsertRowid);
  const finalCode = `SS-${year}-${String(ticketId).padStart(5, "0")}`;
  db.prepare("UPDATE tickets SET ticket_code = ? WHERE id = ?").run(finalCode, ticketId);
  return findByIdStmt.get(ticketId);
};

export const findTicketByCode = (ticketCode) => findByCodeStmt.get(ticketCode);
export const findTicketById = (id) => findByIdStmt.get(id);
export const findTicketByCodeAndEmail = (ticketCode, email) => findByCodeAndEmailStmt.get(ticketCode, email);
export const findTicketByAttachmentPath = (attachmentPath) => {
  return findTicketByOwnAttachmentStmt.get(attachmentPath) || findTicketByMessageAttachmentStmt.get(attachmentPath) || null;
};

export const updateTicketFields = ({ id, fields }) => {
  const keys = Object.keys(fields);
  if (!keys.length) return findByIdStmt.get(id);
  const setClause = keys.map((k) => `${k} = ?`).join(", ");
  const values = keys.map((k) => fields[k]);
  const stmt = db.prepare(`UPDATE tickets SET ${setClause}, updated_at = datetime('now') WHERE id = ?`);
  stmt.run(...values, id);
  return findByIdStmt.get(id);
};

export const listTickets = ({ status, technicianId, search }) => {
  let sql = `
    SELECT t.*, u.name AS technician_name
    FROM tickets t
    LEFT JOIN users u ON u.id = t.assigned_to
    WHERE 1=1
  `;
  const params = [];
  if (status) {
    sql += " AND t.status = ?";
    params.push(status);
  }
  if (technicianId) {
    sql += " AND t.assigned_to = ?";
    params.push(technicianId);
  }
  if (search) {
    sql += " AND (t.ticket_code LIKE ? OR t.client_email LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }
  sql += " ORDER BY t.created_at DESC";
  return db.prepare(sql).all(...params);
};

export const listAssignedTickets = ({ technicianId, status }) => {
  let sql = "SELECT * FROM tickets WHERE assigned_to = ?";
  const params = [technicianId];
  if (status) {
    sql += " AND status = ?";
    params.push(status);
  }
  sql += " ORDER BY updated_at DESC";
  return db.prepare(sql).all(...params);
};

export const listClientTickets = ({ clientUserId, status }) => {
  let sql = "SELECT * FROM tickets WHERE client_user_id = ?";
  const params = [clientUserId];
  if (status) {
    sql += " AND status = ?";
    params.push(status);
  }
  sql += " ORDER BY updated_at DESC";
  return db.prepare(sql).all(...params);
};
