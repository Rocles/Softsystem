import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || "development",
  appBaseUrl: process.env.APP_BASE_URL || "http://localhost:4000",
  sessionSecret: process.env.SESSION_SECRET || "change_this_secret",
  dbPath: process.env.DB_PATH || "./db/softsystem.sqlite",
  uploadDir: process.env.UPLOAD_DIR || "./uploads",
  receiptDir: process.env.RECEIPT_DIR || "./receipts",
  smtpHost: process.env.SMTP_HOST,
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  smtpFrom: process.env.SMTP_FROM || "SoftSystem97 <no-reply@SoftSystem97.local>",
  supportInboxEmail: process.env.SUPPORT_INBOX_EMAIL || "cybermoses45@gmail.com",
  recruitmentInboxEmail: process.env.RECRUITMENT_INBOX_EMAIL || "contact@softsystem97.com",
  assessmentUrl: process.env.ASSESSMENT_URL || "",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  mockPayments: String(process.env.MOCK_PAYMENTS || "true").toLowerCase() === "true"
};


