import fs from "fs";
import path from "path";
import express from "express";
import session from "express-session";
import { env } from "./config/env.js";
import publicRoutes from "./routes/publicRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import techAuthRoutes from "./routes/techAuthRoutes.js";
import clientAuthRoutes from "./routes/clientAuthRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import techRoutes from "./routes/techRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { findTicketByAttachmentPath } from "./models/ticketModel.js";

const app = express();

const requirePageRole = (role, loginPath) => (req, res, next) => {
  const sessionRole = String(req.session?.role || "");
  const sessionUserId = Number(req.session?.userId || 0);
  if (sessionUserId > 0 && sessionRole === role) return next();
  return res.redirect(loginPath);
};

const redirectIfAlreadyRole = (role, targetPath) => (req, res, next) => {
  const sessionRole = String(req.session?.role || "");
  const sessionUserId = Number(req.session?.userId || 0);
  if (sessionUserId > 0 && sessionRole === role) return res.redirect(targetPath);
  return next();
};

fs.mkdirSync(path.resolve(process.cwd(), env.uploadDir), { recursive: true });
fs.mkdirSync(path.resolve(process.cwd(), env.receiptDir), { recursive: true });

app.use(session({
  secret: env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: env.nodeEnv === "production"
  }
}));

app.use("/api/payments", paymentRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "SoftSystem97" });
});
app.get("/api/customer", (_req, res) => {
  res.json({ message: "Use customer web portal", portal: "/client" });
});
app.get("/api/client", (_req, res) => {
  res.json({ message: "Use client web portal", portal: "/client" });
});

app.use("/api", publicRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/tech", techAuthRoutes);
app.use("/api/customer", clientAuthRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tech", techRoutes);

app.get(`/${path.basename(env.uploadDir)}/:file`, (req, res, next) => {
  const fileName = path.basename(String(req.params.file || ""));
  if (!fileName || fileName !== req.params.file) {
    return res.status(400).json({ message: "Invalid file path" });
  }

  const attachmentPath = `${path.basename(env.uploadDir)}/${fileName}`.replace(/\\/g, "/");
  const ticket = findTicketByAttachmentPath(attachmentPath);

  // Non-ticket files (ex: CV uploads) keep existing behavior through static middleware below.
  if (!ticket) return next();

  const sessionRole = String(req.session?.role || "");
  const sessionUserId = Number(req.session?.userId || 0);
  const token = String(req.query.token || "");

  const isAdmin = sessionRole === "admin" && sessionUserId > 0;
  const isAssignedTech = sessionRole === "tech" && sessionUserId > 0 && Number(ticket.assigned_to) === sessionUserId;
  const isClientOwner = sessionRole === "client" && sessionUserId > 0 && Number(ticket.client_user_id) === sessionUserId;
  const isClientToken = Boolean(token) && token === ticket.access_token;

  if (!(isAdmin || isAssignedTech || isClientOwner || isClientToken)) {
    return res.status(403).json({ message: "Forbidden file access" });
  }

  const filePath = path.resolve(process.cwd(), env.uploadDir, fileName);
  return res.sendFile(filePath);
});

app.use(`/${path.basename(env.uploadDir)}`, express.static(path.resolve(process.cwd(), env.uploadDir)));
app.use(`/${path.basename(env.receiptDir)}`, express.static(path.resolve(process.cwd(), env.receiptDir)));
app.use(express.static(path.resolve(process.cwd(), "public")));

app.get("/support", (_req, res) => {
  res.redirect("/client/tickets");
});
app.get("/careers", (_req, res) => {
  res.redirect("/jobs");
});
app.get("/open-ticket", (_req, res) => {
  res.redirect("/client/tickets");
});
app.get("/tickets/new", (_req, res) => {
  res.redirect("/client/tickets");
});
app.get("/client", (_req, res) => {
  res.sendFile(path.resolve(process.cwd(), "public", "client-portal.html"));
});
app.get("/client/account", (_req, res) => {
  res.sendFile(path.resolve(process.cwd(), "public", "client-account.html"));
});
app.get("/client/tickets", (_req, res) => {
  res.sendFile(path.resolve(process.cwd(), "public", "client-tickets.html"));
});
app.get("/client/payments", (_req, res) => {
  res.sendFile(path.resolve(process.cwd(), "public", "client-payments.html"));
});
app.get("/jobs", (_req, res) => {
  res.sendFile(path.resolve(process.cwd(), "public", "jobs.html"));
});
app.get("/assessment", (_req, res) => {
  res.sendFile(path.resolve(process.cwd(), "public", "assessment.html"));
});
app.get("/company", (_req, res) => {
  res.sendFile(path.resolve(process.cwd(), "public", "company.html"));
});
app.get("/espace-interne", (_req, res) => {
  res.sendFile(path.resolve(process.cwd(), "public", "internal.html"));
});
app.get("/internal", (_req, res) => {
  res.redirect("/espace-interne");
});
app.get("/customer", (_req, res) => {
  return res.redirect("/client");
});
app.get("/client/:ticketId", (_req, res) => {
  res.sendFile(path.resolve(process.cwd(), "public", "client.html"));
});
app.get("/customer/:ticketId", (req, res) => {
  const token = req.query.token ? `?token=${encodeURIComponent(String(req.query.token))}` : "";
  res.redirect(`/client/${encodeURIComponent(req.params.ticketId)}${token}`);
});
app.get("/admin/login", redirectIfAlreadyRole("admin", "/admin"), (_req, res) => {
  res.sendFile(path.resolve(process.cwd(), "public", "admin-login.html"));
});
app.get("/admin", requirePageRole("admin", "/admin/login"), (_req, res) => {
  res.sendFile(path.resolve(process.cwd(), "public", "admin.html"));
});
app.get("/admin/techs", requirePageRole("admin", "/admin/login"), (_req, res) => {
  res.sendFile(path.resolve(process.cwd(), "public", "admin-techs.html"));
});
app.get("/admin/tickets/:ticketId", requirePageRole("admin", "/admin/login"), (_req, res) => {
  res.sendFile(path.resolve(process.cwd(), "public", "admin-ticket.html"));
});
app.get("/tech/login", redirectIfAlreadyRole("tech", "/tech"), (_req, res) => {
  res.sendFile(path.resolve(process.cwd(), "public", "tech-login.html"));
});
app.get("/tech", requirePageRole("tech", "/tech/login"), (_req, res) => {
  res.sendFile(path.resolve(process.cwd(), "public", "tech.html"));
});
app.get("/tech/tickets/:ticketId", requirePageRole("tech", "/tech/login"), (_req, res) => {
  res.sendFile(path.resolve(process.cwd(), "public", "tech-ticket.html"));
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;

