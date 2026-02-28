import crypto from "crypto";

export const generateTicketCode = () => {
  const year = new Date().getFullYear();
  const rand = String(Math.floor(10000 + Math.random() * 90000));
  return `SS-${year}-${rand}`;
};

export const generateToken = () => crypto.randomBytes(24).toString("hex");

export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());

export const clean = (value, max = 2000) => String(value || "").trim().slice(0, max);