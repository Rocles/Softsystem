import bcrypt from "bcryptjs";
import { db } from "../config/db.js";

const findByEmailStmt = db.prepare("SELECT * FROM users WHERE email = ?");
const findByIdStmt = db.prepare("SELECT id, name, email, role, is_active, created_at FROM users WHERE id = ?");
const listTechStmt = db.prepare("SELECT id, name, email, role, is_active, created_at FROM users WHERE role = 'tech' ORDER BY name");
const createClientStmt = db.prepare("INSERT INTO users (name, email, role, password_hash, is_active) VALUES (?, ?, 'client', ?, 1)");

export const getUserByEmail = (email) => findByEmailStmt.get(email);
export const getUserById = (id) => findByIdStmt.get(id);
export const listTechnicians = () => listTechStmt.all();

export const createTechnician = ({ name, email, password }) => {
  const passwordHash = bcrypt.hashSync(password, 10);
  const stmt = db.prepare("INSERT INTO users (name, email, role, password_hash, is_active) VALUES (?, ?, 'tech', ?, 1)");
  const result = stmt.run(name, email, passwordHash);
  return getUserById(result.lastInsertRowid);
};

export const updateTechnician = ({ id, name, email, isActive }) => {
  const stmt = db.prepare("UPDATE users SET name = ?, email = ?, is_active = ? WHERE id = ? AND role = 'tech'");
  stmt.run(name, email, isActive ? 1 : 0, id);
  return getUserById(id);
};

export const resetTechnicianPassword = ({ id, password }) => {
  const passwordHash = bcrypt.hashSync(password, 10);
  const stmt = db.prepare("UPDATE users SET password_hash = ? WHERE id = ? AND role = 'tech'");
  stmt.run(passwordHash, id);
};

export const createClient = ({ name, email, password }) => {
  const passwordHash = bcrypt.hashSync(password, 10);
  const result = createClientStmt.run(name, email, passwordHash);
  return getUserById(result.lastInsertRowid);
};
