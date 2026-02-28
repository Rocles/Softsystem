import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { env } from "../config/env.js";

export const createReceiptPdf = async ({ ticketCode, clientName, amountCents, currency, paymentRef }) => {
  const dir = path.resolve(process.cwd(), env.receiptDir);
  fs.mkdirSync(dir, { recursive: true });

  const filename = `receipt-${ticketCode}-${Date.now()}.pdf`;
  const fullPath = path.join(dir, filename);

  await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(fullPath);
    doc.pipe(stream);

    doc.fontSize(20).text("SoftSystem97 Payment Receipt", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Ticket: ${ticketCode}`);
    doc.text(`Client: ${clientName}`);
    doc.text(`Amount: ${(amountCents / 100).toFixed(2)} ${currency.toUpperCase()}`);
    doc.text(`Payment Reference: ${paymentRef}`);
    doc.text(`Date: ${new Date().toISOString()}`);
    doc.end();

    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  return { filename, relativePath: path.join(path.basename(env.receiptDir), filename).replace(/\\/g, "/") };
};
