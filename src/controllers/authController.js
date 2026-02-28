import bcrypt from "bcryptjs";
import { createClient, getUserByEmail } from "../models/userModel.js";
import { clean, validateEmail } from "../services/utils.js";

const loginWithRole = (role) => (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  const user = getUserByEmail(email);
  if (!user || user.role !== role) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  if (!user.is_active) {
    return res.status(403).json({ message: "Account inactive" });
  }
  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  req.session.userId = user.id;
  req.session.role = user.role;
  req.session.userName = user.name;

  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};

export const adminLogin = loginWithRole("admin");
export const techLogin = loginWithRole("tech");
export const clientLogin = loginWithRole("client");

export const clientSignup = (req, res) => {
  const name = clean(req.body.name, 120);
  const email = clean(req.body.email, 190).toLowerCase();
  const password = String(req.body.password || "");

  if (!name || !validateEmail(email) || password.length < 8) {
    return res.status(400).json({ message: "Valid name/email and password >= 8 required" });
  }
  if (getUserByEmail(email)) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const user = createClient({ name, email, password });
  req.session.userId = user.id;
  req.session.role = "client";
  req.session.userName = user.name;
  res.status(201).json({ user });
};

export const logout = (req, res) => {
  req.session.destroy(() => res.json({ message: "Logged out" }));
};

export const adminSession = (req, res) => {
  res.json({ user: { id: req.user.id, name: req.user.name, role: req.user.role } });
};

export const techSession = (req, res) => {
  res.json({ user: { id: req.user.id, name: req.user.name, role: req.user.role } });
};

export const clientSession = (req, res) => {
  res.json({ user: { id: req.user.id, name: req.user.name, email: req.user.email, role: req.user.role } });
};
