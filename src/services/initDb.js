import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { db } from "../config/db.js";

const schemaPath = path.resolve(process.cwd(), "db", "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf8");
db.exec(schema);

const hasColumn = (tableName, columnName) => {
  const cols = db.prepare(`PRAGMA table_info(${tableName})`).all();
  return cols.some((c) => c.name === columnName);
};

const migrateUsersRoleToIncludeClient = () => {
  const row = db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'users'").get();
  const createSql = String(row?.sql || "");
  if (createSql.includes("'client'")) return;

  db.exec("PRAGMA foreign_keys = OFF");
  db.exec(`
    BEGIN;
    CREATE TABLE users_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL CHECK (role IN ('admin','tech','client')),
      password_hash TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    INSERT INTO users_new (id, name, email, role, password_hash, is_active, created_at)
    SELECT id, name, email, role, password_hash, is_active, created_at FROM users;
    DROP TABLE users;
    ALTER TABLE users_new RENAME TO users;
    COMMIT;
  `);
  db.exec("PRAGMA foreign_keys = ON");
};

const migrateTicketsForClientUser = () => {
  if (!hasColumn("tickets", "client_user_id")) {
    db.exec("ALTER TABLE tickets ADD COLUMN client_user_id INTEGER REFERENCES users(id)");
  }
  db.exec("CREATE INDEX IF NOT EXISTS idx_tickets_client_user ON tickets(client_user_id)");
};

migrateUsersRoleToIncludeClient();
migrateTicketsForClientUser();

const adminEmail = "admin@softsystem.local";
const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(adminEmail);
if (!existing) {
  const hash = bcrypt.hashSync("Admin123!", 10);
  db.prepare("INSERT INTO users (name, email, role, password_hash, is_active) VALUES (?, ?, 'admin', ?, 1)")
    .run("SoftSystem97 Admin", adminEmail, hash);
}

const techEmail = "tech@softsystem.local";
const existingTech = db.prepare("SELECT id FROM users WHERE email = ?").get(techEmail);
if (!existingTech) {
  const hash = bcrypt.hashSync("Tech123!", 10);
  db.prepare("INSERT INTO users (name, email, role, password_hash, is_active) VALUES (?, ?, 'tech', ?, 1)")
    .run("Default Technician", techEmail, hash);
}

console.log("Database initialized.");
console.log("Admin: admin@softsystem.local / Admin123!");
console.log("Tech: tech@softsystem.local / Tech123!");


