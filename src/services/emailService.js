import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter = null;
if (env.smtpHost) {
  const hasAuth = Boolean(env.smtpUser && env.smtpPass);
  transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    ...(hasAuth ? { auth: { user: env.smtpUser, pass: env.smtpPass } } : {})
  });
}

export const isMailConfigured = Boolean(transporter);

export const sendMail = async ({ to, subject, text, html }) => {
  if (!transporter) {
    console.log("[mail disabled] SMTP not configured", { to, subject });
    return;
  }
  await transporter.sendMail({ from: env.smtpFrom, to, subject, text, html });
};
