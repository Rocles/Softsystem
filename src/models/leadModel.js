import { db } from "../config/db.js";

const insertJobApplicationStmt = db.prepare(`
  INSERT INTO job_applications (
    full_name, email, phone, location, years_experience, skills, message, cv_path, status
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')
`);

const insertCompanyInquiryStmt = db.prepare(`
  INSERT INTO company_inquiries (
    first_name, last_name, company_name, position_title, website, phone, work_email, needs, hear_about, status
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')
`);

export const createJobApplication = ({
  fullName,
  email,
  phone,
  location,
  yearsExperience,
  skills,
  message,
  cvPath
}) => {
  const result = insertJobApplicationStmt.run(
    fullName,
    email,
    phone || null,
    location || null,
    yearsExperience || null,
    skills || null,
    message || null,
    cvPath
  );
  return db.prepare("SELECT * FROM job_applications WHERE id = ?").get(result.lastInsertRowid);
};

export const createCompanyInquiry = ({
  firstName,
  lastName,
  companyName,
  positionTitle,
  website,
  phone,
  workEmail,
  needs,
  hearAbout
}) => {
  const result = insertCompanyInquiryStmt.run(
    firstName,
    lastName,
    companyName,
    positionTitle,
    website,
    phone || null,
    workEmail,
    needs,
    hearAbout
  );
  return db.prepare("SELECT * FROM company_inquiries WHERE id = ?").get(result.lastInsertRowid);
};
