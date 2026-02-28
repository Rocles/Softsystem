import { getUserById } from "../models/userModel.js";
import { findTicketByCode, findTicketByCodeAndEmail } from "../models/ticketModel.js";

export const requireSessionRole = (roleOrRoles) => (req, res, next) => {
  const roles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
  if (!req.session?.userId || !roles.includes(req.session?.role)) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const user = getUserById(req.session.userId);
  if (!user || !user.is_active) {
    req.session.destroy(() => {});
    return res.status(401).json({ message: "Session expired" });
  }
  req.user = user;
  next();
};

export const requireClientTicketAccess = (req, res, next) => {
  const ticketCode = req.params.ticketId;
  const token = String(req.query.token || req.body.token || "");
  const email = String(req.body.email || "").trim();
  const sessionUserId = Number(req.session?.userId || 0);
  const sessionRole = String(req.session?.role || "");

  if (ticketCode && sessionRole === "client" && sessionUserId > 0) {
    const ticket = findTicketByCode(ticketCode);
    if (ticket && Number(ticket.client_user_id) === sessionUserId) {
      req.clientToken = ticket.access_token;
      req.clientSessionAuth = true;
      return next();
    }
  }

  if (token) {
    req.clientToken = token;
    return next();
  }

  if (!email) {
    return res.status(401).json({ message: "Ticket token or email required" });
  }

  const ticket = findTicketByCodeAndEmail(ticketCode, email);
  if (!ticket) {
    return res.status(401).json({ message: "Invalid ticket credentials" });
  }

  req.clientToken = ticket.access_token;
  next();
};
