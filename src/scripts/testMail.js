import { env } from "../config/env.js";
import { isMailConfigured, sendMail } from "../services/emailService.js";

const run = async () => {
  if (!isMailConfigured) {
    console.log("SMTP not configured. Check SMTP_HOST/SMTP_USER/SMTP_PASS in .env");
    process.exit(1);
  }

  const to = env.recruitmentInboxEmail || env.supportInboxEmail;
  if (!to) {
    console.log("No destination email configured. Set RECRUITMENT_INBOX_EMAIL or SUPPORT_INBOX_EMAIL.");
    process.exit(1);
  }

  await sendMail({
    to,
    subject: "SoftSystem97 - SMTP test",
    text: "SMTP is working. This is a test message from SoftSystem97.",
    html: "<p><strong>SMTP is working.</strong> This is a test message from SoftSystem97.</p>"
  });

  console.log(`Test email sent to ${to}`);
};

run().catch((error) => {
  console.error("Mail test failed:", error.message);
  process.exit(1);
});

