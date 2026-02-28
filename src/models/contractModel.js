import { db } from "../config/db.js";

const createContractStmt = db.prepare(`
  INSERT INTO contract_requests (
    contact_name, company_name, email, phone, team_size, needs, status
  ) VALUES (?, ?, ?, ?, ?, ?, 'new')
`);

export const createContractRequest = ({
  contactName,
  companyName,
  email,
  phone,
  teamSize,
  needs
}) => {
  const result = createContractStmt.run(
    contactName,
    companyName,
    email,
    phone || null,
    teamSize || null,
    needs
  );
  return db.prepare("SELECT * FROM contract_requests WHERE id = ?").get(result.lastInsertRowid);
};
