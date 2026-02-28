import path from "path";
import { env } from "../config/env.js";
import { createContractRequest } from "../models/contractModel.js";
import { createCompanyInquiry, createJobApplication } from "../models/leadModel.js";
import { listActionLogs, listInternalNotes, listMessages, addMessage } from "../models/messageModel.js";
import { createTicket, findTicketByCode, findTicketByCodeAndEmail, listClientTickets, updateTicketFields } from "../models/ticketModel.js";
import { getUserById } from "../models/userModel.js";
import { sendMail } from "../services/emailService.js";
import { logAction } from "../services/logService.js";
import { createReceiptPdf } from "../services/receiptService.js";
import { isStripeConfigured, stripe } from "../services/stripeService.js";
import { clean, generateToken, validateEmail } from "../services/utils.js";

const allowedCategories = ["network", "internet outage", "app", "hardware", "other"];
const allowedPriorities = ["low", "medium", "high"];
const allowedCvExtensions = [".pdf", ".doc", ".docx"];
const assessmentAnswerKey = {
  q1: "dns_recursive",
  q2: "mesh",
  q3: "tcpip_settings",
  q4: "port_22",
  q5: "clear_dns_cache",
  q6: "hardware_driver",
  q7: "run_as_admin",
  q8: "event_viewer",
  q9: "use_another_cable",
  q10: "max_ram",
  q11: "ping_server",
  q12: "fix_subnet_gateway",
  q13: "public_dns",
  q14: "templates",
  q15: "rsa",
  q16: "global_admin",
  q17: "sharepoint_onedrive",
  q18: "shared_mailbox",
  q19: "rules",
  q20: "mfa"
};

const publicTicket = (ticket) => ({
  ticketId: ticket.ticket_code,
  client_name: ticket.client_name,
  client_email: ticket.client_email,
  client_phone: ticket.client_phone,
  company: ticket.company,
  category: ticket.category,
  priority: ticket.priority,
  description: ticket.description,
  status: ticket.status,
  payment_status: ticket.payment_status,
  price_cents: ticket.price_cents,
  currency: ticket.currency,
  attachment_url: ticket.attachment_path ? `${env.appBaseUrl}/${ticket.attachment_path}` : null,
  created_at: ticket.created_at,
  updated_at: ticket.updated_at
});

const canAccessClientTicket = (req, ticket, token) => {
  if (!ticket) return false;
  const sessionUserId = Number(req.session?.userId || 0);
  const sessionRole = String(req.session?.role || "");
  if (sessionRole === "client" && sessionUserId > 0 && Number(ticket.client_user_id) === sessionUserId) {
    return true;
  }
  return Boolean(token && ticket.access_token === token);
};

export const createTicketPublic = async (req, res, next) => {
  try {
    const payload = req.body;
    const sessionUserId = req.session?.role === "client" ? Number(req.session.userId || 0) : 0;
    const clientUser = sessionUserId ? getUserById(sessionUserId) : null;
    const clientName = clean(payload.fullName, 120);
    const clientEmail = clientUser ? String(clientUser.email).toLowerCase() : clean(payload.email, 190).toLowerCase();
    const clientPhone = clean(payload.phone, 40);
    const company = clean(payload.company, 120);
    const category = clean(payload.category, 60).toLowerCase();
    const priority = clean(payload.priority, 10).toLowerCase();
    const description = clean(payload.description, 4000);

    if (!clientName || !validateEmail(clientEmail) || !description) {
      return res.status(400).json({ message: "fullName, valid email and description are required" });
    }
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }
    if (!allowedPriorities.includes(priority)) {
      return res.status(400).json({ message: "Invalid priority" });
    }

    const token = generateToken();
    const attachmentPath = req.file ? `${path.basename(env.uploadDir)}/${req.file.filename}`.replace(/\\/g, "/") : null;

    const ticket = createTicket({
      clientName,
      clientEmail,
      clientPhone,
      company,
      category,
      priority,
      description,
      attachmentPath,
      accessToken: token,
      clientUserId: sessionUserId || null
    });

    logAction({ ticketId: ticket.id, actorRole: "client", actionType: "ticket_created", details: ticket.ticket_code });

    const ticketUrl = `${env.appBaseUrl}/client/${ticket.ticket_code}?token=${token}`;
    try {
      await sendMail({
        to: clientEmail,
        subject: `SoftSystem97 Ticket Created - ${ticket.ticket_code}`,
        text: `Your ticket ${ticket.ticket_code} has been created.\nOpen: ${ticketUrl}`,
        html: `<p>Your ticket <strong>${ticket.ticket_code}</strong> has been created.</p><p><a href="${ticketUrl}">Open your ticket</a></p>`
      });

      await sendMail({
        to: env.supportInboxEmail,
        subject: `New Support Ticket - ${ticket.ticket_code}`,
        text: [
          `New ticket: ${ticket.ticket_code}`,
          `Client: ${ticket.client_name}`,
          `Email: ${ticket.client_email}`,
          `Phone: ${ticket.client_phone || "-"}`,
          `Company: ${ticket.company || "-"}`,
          `Category: ${ticket.category}`,
          `Priority: ${ticket.priority}`,
          `Description: ${ticket.description}`,
          `Attachment: ${ticket.attachment_path ? `${env.appBaseUrl}/${ticket.attachment_path}` : "-"}`,
          `Open in app: ${ticketUrl}`
        ].join("\n"),
        html: `
          <p><strong>New ticket:</strong> ${ticket.ticket_code}</p>
          <p><strong>Client:</strong> ${ticket.client_name}</p>
          <p><strong>Email:</strong> ${ticket.client_email}</p>
          <p><strong>Phone:</strong> ${ticket.client_phone || "-"}</p>
          <p><strong>Company:</strong> ${ticket.company || "-"}</p>
          <p><strong>Category:</strong> ${ticket.category}</p>
          <p><strong>Priority:</strong> ${ticket.priority}</p>
          <p><strong>Description:</strong><br/>${ticket.description}</p>
          <p><strong>Attachment:</strong> ${ticket.attachment_path ? `<a href="${env.appBaseUrl}/${ticket.attachment_path}" target="_blank">Open file</a>` : "-"}</p>
          <p><a href="${ticketUrl}">Open ticket in app</a></p>
        `
      });
    } catch (mailError) {
      console.error("[mail error] Ticket created but confirmation email failed", {
        ticket: ticket.ticket_code,
        to: `${clientEmail}, ${env.supportInboxEmail}`,
        error: mailError.message
      });
    }

    res.status(201).json({
      message: "Ticket created",
      ticketId: ticket.ticket_code,
      accessToken: token,
      redirectUrl: `/client/${ticket.ticket_code}?token=${token}`
    });
  } catch (error) {
    next(error);
  }
};

export const accessClientTicket = (req, res) => {
  const ticketCode = clean(req.body.ticketId, 50);
  const email = clean(req.body.email, 190).toLowerCase();
  if (!ticketCode || !email) {
    return res.status(400).json({ message: "ticketId and email are required" });
  }
  const ticket = findTicketByCodeAndEmail(ticketCode, email);
  if (!ticket) {
    return res.status(401).json({ message: "Invalid ticket access" });
  }
  res.json({ ticketId: ticket.ticket_code, accessToken: ticket.access_token, redirectUrl: `/client/${ticket.ticket_code}?token=${ticket.access_token}` });
};

export const getClientTicket = (req, res) => {
  const ticketCode = req.params.ticketId;
  const token = String(req.query.token || "");
  const ticket = findTicketByCode(ticketCode);
  if (!canAccessClientTicket(req, ticket, token)) {
    return res.status(401).json({ message: "Unauthorized ticket access" });
  }

  const messages = listMessages(ticket.id).map((m) => ({
    ...m,
    attachment_url: m.attachment_path ? `${env.appBaseUrl}/${m.attachment_path}` : null
  }));

  res.json({
    ticket: publicTicket(ticket),
    messages,
    receiptUrl: ticket.payment_status === "paid" ? `${env.appBaseUrl}/api/client/tickets/${ticket.ticket_code}/receipt?token=${token}` : null
  });
};

export const postClientMessage = (req, res) => {
  const ticketCode = req.params.ticketId;
  const token = String(req.query.token || req.body.token || "");
  const message = clean(req.body.message, 3000);
  const ticket = findTicketByCode(ticketCode);
  if (!canAccessClientTicket(req, ticket, token)) {
    return res.status(401).json({ message: "Unauthorized ticket access" });
  }
  if (!message && !req.file) {
    return res.status(400).json({ message: "Message or attachment required" });
  }

  const attachmentPath = req.file ? `${path.basename(env.uploadDir)}/${req.file.filename}`.replace(/\\/g, "/") : null;
  addMessage({ ticketId: ticket.id, senderType: "client", message: message || "[Attachment]", attachmentPath });
  logAction({ ticketId: ticket.id, actorRole: "client", actionType: "client_message", details: message.slice(0, 80) });

  res.status(201).json({ message: "Message sent" });
};

export const createCheckoutSession = async (req, res, next) => {
  try {
    const ticketCode = req.params.ticketId;
    const token = String(req.query.token || req.body.token || "");
    const ticket = findTicketByCode(ticketCode);
    if (!canAccessClientTicket(req, ticket, token)) {
      return res.status(401).json({ message: "Unauthorized ticket access" });
    }
    if (ticket.payment_status === "paid") {
      return res.status(400).json({ message: "Ticket already paid" });
    }
    if (!ticket.price_cents || ticket.price_cents <= 0) {
      return res.status(400).json({ message: "Price not set by support team" });
    }

    if (!isStripeConfigured) {
      if (!env.mockPayments) return res.status(400).json({ message: "Stripe not configured" });
      return res.json({
        provider: "mock",
        checkoutUrl: `${env.appBaseUrl}/client/${ticket.ticket_code}?token=${ticket.access_token}`,
        message: "Stripe not configured; use mock payment endpoint"
      });
    }

    const successUrl = `${env.appBaseUrl}/client/${ticket.ticket_code}?token=${ticket.access_token}&paid=1`;
    const cancelUrl = `${env.appBaseUrl}/client/${ticket.ticket_code}?token=${ticket.access_token}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      customer_email: ticket.client_email,
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: ticket.currency,
            unit_amount: ticket.price_cents,
            product_data: {
              name: `SoftSystem97 Support - ${ticket.ticket_code}`,
              description: `Category: ${ticket.category}`
            }
          }
        }
      ],
      metadata: {
        ticketId: String(ticket.id),
        ticketCode: ticket.ticket_code
      }
    });

    updateTicketFields({
      id: ticket.id,
      fields: { stripe_checkout_session_id: session.id }
    });
    logAction({ ticketId: ticket.id, actorRole: "client", actionType: "stripe_checkout_created", details: session.id });

    res.json({ provider: "stripe", checkoutUrl: session.url });
  } catch (error) {
    next(error);
  }
};

export const mockPayTicket = async (req, res, next) => {
  try {
    if (!env.mockPayments) return res.status(403).json({ message: "Mock payment disabled" });

    const ticketCode = req.params.ticketId;
    const token = String(req.query.token || req.body.token || "");
    const ticket = findTicketByCode(ticketCode);
    if (!canAccessClientTicket(req, ticket, token)) {
      return res.status(401).json({ message: "Unauthorized ticket access" });
    }

    updateTicketFields({ id: ticket.id, fields: { payment_status: "paid", stripe_payment_intent_id: `mock_${Date.now()}` } });
    logAction({ ticketId: ticket.id, actorRole: "client", actionType: "mock_payment_confirmed" });

    res.json({ message: "Payment confirmed", status: "paid" });
  } catch (error) {
    next(error);
  }
};

export const downloadReceipt = async (req, res, next) => {
  try {
    const ticketCode = req.params.ticketId;
    const token = String(req.query.token || "");
    const ticket = findTicketByCode(ticketCode);
    if (!canAccessClientTicket(req, ticket, token)) {
      return res.status(401).json({ message: "Unauthorized ticket access" });
    }
    if (ticket.payment_status !== "paid") {
      return res.status(400).json({ message: "Ticket is not paid" });
    }

    const receipt = await createReceiptPdf({
      ticketCode: ticket.ticket_code,
      clientName: ticket.client_name,
      amountCents: ticket.price_cents,
      currency: ticket.currency,
      paymentRef: ticket.stripe_payment_intent_id || ticket.stripe_checkout_session_id || "manual"
    });

    res.download(path.resolve(process.cwd(), env.receiptDir, receipt.filename), receipt.filename);
  } catch (error) {
    next(error);
  }
};

export const getTicketInternalData = (ticketId) => {
  const logs = listActionLogs(ticketId);
  const notes = listInternalNotes(ticketId);
  return { logs, notes };
};

export const listMyTickets = (req, res) => {
  const sessionUserId = Number(req.session?.userId || 0);
  if (!sessionUserId || req.session?.role !== "client") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const status = clean(req.query.status, 20) || null;
  const tickets = listClientTickets({ clientUserId: sessionUserId, status }).map(publicTicket);
  res.json({ tickets });
};

export const submitContractRequest = async (req, res, next) => {
  try {
    const contactName = clean(req.body.contactName, 120);
    const companyName = clean(req.body.companyName, 160);
    const email = clean(req.body.email, 190).toLowerCase();
    const phone = clean(req.body.phone, 40);
    const teamSize = clean(req.body.teamSize, 80);
    const needs = clean(req.body.needs, 5000);

    if (!contactName || !companyName || !validateEmail(email) || !needs) {
      return res.status(400).json({ message: "contactName, companyName, valid email and needs are required" });
    }

    const request = createContractRequest({
      contactName,
      companyName,
      email,
      phone,
      teamSize,
      needs
    });

    try {
      await sendMail({
        to: env.supportInboxEmail,
        subject: `New Contract Request - ${companyName}`,
        text: [
          `Contact: ${contactName}`,
          `Company: ${companyName}`,
          `Email: ${email}`,
          `Phone: ${phone || "-"}`,
          `Team size: ${teamSize || "-"}`,
          `Needs: ${needs}`
        ].join("\n"),
        html: `
          <p><strong>Contact:</strong> ${contactName}</p>
          <p><strong>Company:</strong> ${companyName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "-"}</p>
          <p><strong>Team size:</strong> ${teamSize || "-"}</p>
          <p><strong>Needs:</strong><br/>${needs}</p>
        `
      });
    } catch (mailError) {
      console.error("[mail error] Contract request saved but email notification failed", {
        requestId: request.id,
        error: mailError.message
      });
    }

    res.status(201).json({ message: "Contract request submitted", requestId: request.id });
  } catch (error) {
    next(error);
  }
};

export const submitJobApplication = async (req, res, next) => {
  try {
    const fullName = clean(req.body.fullName, 120);
    const email = clean(req.body.email, 190).toLowerCase();
    const phone = clean(req.body.phone, 40);
    const location = clean(req.body.location, 120);
    const yearsExperience = clean(req.body.yearsExperience, 40);
    const skills = clean(req.body.skills, 500);
    const message = clean(req.body.message, 5000);

    if (!fullName || !validateEmail(email)) {
      return res.status(400).json({ message: "fullName and valid email are required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "CV file is required" });
    }

    const ext = path.extname(req.file.originalname || "").toLowerCase();
    if (!allowedCvExtensions.includes(ext)) {
      return res.status(400).json({ message: "CV must be PDF, DOC or DOCX" });
    }

    const cvPath = `${path.basename(env.uploadDir)}/${req.file.filename}`.replace(/\\/g, "/");

    const application = createJobApplication({
      fullName,
      email,
      phone,
      location,
      yearsExperience,
      skills,
      message,
      cvPath
    });

    try {
      await sendMail({
        to: env.recruitmentInboxEmail,
        subject: `New Job Application - ${fullName}`,
        text: [
          `A new candidate has applied.`,
          `Application ID: ${application.id}`,
          `Name: ${fullName}`,
          `Email: ${email}`,
          `Phone: ${phone || "-"}`,
          `Location: ${location || "-"}`,
          `Experience: ${yearsExperience || "-"}`,
          `Skills: ${skills || "-"}`,
          `Message: ${message || "-"}`,
          `CV: ${env.appBaseUrl}/${cvPath}`
        ].join("\n"),
        html: `
          <p><strong>A new candidate has applied.</strong></p>
          <p><strong>Application ID:</strong> ${application.id}</p>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "-"}</p>
          <p><strong>Location:</strong> ${location || "-"}</p>
          <p><strong>Experience:</strong> ${yearsExperience || "-"}</p>
          <p><strong>Skills:</strong> ${skills || "-"}</p>
          <p><strong>Message:</strong><br/>${message || "-"}</p>
          <p><strong>CV:</strong> <a href="${env.appBaseUrl}/${cvPath}" target="_blank">Open CV</a></p>
        `
      });

      {
        const assessmentBase = `${env.appBaseUrl}/assessment`;
        const sep = assessmentBase.includes("?") ? "&" : "?";
        const assessmentLink = `${assessmentBase}${sep}applicationId=${encodeURIComponent(String(application.id))}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(fullName)}`;
        await sendMail({
          to: email,
          subject: "SoftSystem97 - Invitation a l'evaluation",
          text: [
            `Bonjour ${fullName},`,
            "",
            "Merci pour votre candidature.",
            "Veuillez completer l'evaluation technique en utilisant le lien securise ci-dessous :",
            assessmentLink,
            "",
            "Cordialement,",
            "Equipe de recrutement de SoftSystem97"
          ].join("\n"),
          html: `
            <p>Bonjour <strong>${fullName}</strong>,</p>
            <p>Merci pour votre candidature.</p>
            <p>Veuillez completer l'evaluation technique en utilisant le lien securise ci-dessous :</p>
            <p><a href="${assessmentLink}" target="_blank">Evaluation initiale</a></p>
            <p>Cordialement,<br/>Equipe de recrutement de SoftSystem97</p>
          `
        });
      }
    } catch (mailError) {
      console.error("[mail error] Job application saved but email notification/invite failed", {
        applicationId: application.id,
        error: mailError.message
      });
    }

    res.status(201).json({ message: "Application submitted", applicationId: application.id });
  } catch (error) {
    next(error);
  }
};

export const submitCompanyInquiry = async (req, res, next) => {
  try {
    const firstName = clean(req.body.firstName, 80);
    const lastName = clean(req.body.lastName, 80);
    const companyName = clean(req.body.companyName, 160);
    const positionTitle = clean(req.body.positionTitle, 120);
    const website = clean(req.body.website, 180);
    const phone = clean(req.body.phone, 40);
    const workEmail = clean(req.body.workEmail, 190).toLowerCase();
    const needs = clean(req.body.needs, 5000);
    const hearAbout = clean(req.body.hearAbout, 250);

    if (!firstName || !lastName || !companyName || !positionTitle || !website || !validateEmail(workEmail) || !needs || !hearAbout) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const inquiry = createCompanyInquiry({
      firstName,
      lastName,
      companyName,
      positionTitle,
      website,
      phone,
      workEmail,
      needs,
      hearAbout
    });

    try {
      await sendMail({
        to: env.supportInboxEmail,
        subject: `New Company Inquiry - ${companyName}`,
        text: [
          `Contact: ${firstName} ${lastName}`,
          `Company: ${companyName}`,
          `Position: ${positionTitle}`,
          `Website: ${website}`,
          `Phone: ${phone || "-"}`,
          `Work email: ${workEmail}`,
          `Needs: ${needs}`,
          `How they heard about us: ${hearAbout}`
        ].join("\n"),
        html: `
          <p><strong>Contact:</strong> ${firstName} ${lastName}</p>
          <p><strong>Company:</strong> ${companyName}</p>
          <p><strong>Position:</strong> ${positionTitle}</p>
          <p><strong>Website:</strong> ${website}</p>
          <p><strong>Phone:</strong> ${phone || "-"}</p>
          <p><strong>Work email:</strong> ${workEmail}</p>
          <p><strong>Needs:</strong><br/>${needs}</p>
          <p><strong>How they heard about us:</strong> ${hearAbout}</p>
        `
      });
    } catch (mailError) {
      console.error("[mail error] Company inquiry saved but email notification failed", {
        inquiryId: inquiry.id,
        error: mailError.message
      });
    }

    res.status(201).json({ message: "Inquiry submitted", inquiryId: inquiry.id });
  } catch (error) {
    next(error);
  }
};

export const submitAssessmentResult = async (req, res, next) => {
  try {
    const candidateName = clean(req.body.candidateName, 120);
    const candidateEmail = clean(req.body.candidateEmail, 190).toLowerCase();
    const applicationId = clean(req.body.applicationId, 40);
    const answers = req.body.answers && typeof req.body.answers === "object" ? req.body.answers : {};

    if (!candidateName || !validateEmail(candidateEmail)) {
      return res.status(400).json({ message: "Valid candidateName and candidateEmail are required" });
    }

    const keys = Object.keys(assessmentAnswerKey);
    let score = 0;
    for (const key of keys) {
      if (String(answers[key] || "") === assessmentAnswerKey[key]) score += 1;
    }
    const total = keys.length;

    try {
      await sendMail({
        to: env.recruitmentInboxEmail,
        subject: `Assessment Completed - ${candidateName}`,
        text: [
          `A candidate completed the assessment.`,
          `Candidate: ${candidateName}`,
          `Email: ${candidateEmail}`,
          `Application ID: ${applicationId || "-"}`,
          `Score: ${score}/${total}`,
          ``,
          `Answers:`,
          ...keys.map((k) => `${k}: ${String(answers[k] || "-")}`)
        ].join("\n")
      });

      await sendMail({
        to: candidateEmail,
        subject: "SoftSystem97 - Assessment received",
        text: [
          `Hello ${candidateName},`,
          ``,
          `We confirm that we received your assessment.`,
          `Result recorded: ${score}/${total}.`,
          ``,
          `Our team will review your profile and contact you with next steps.`,
          ``,
          `SoftSystem97 Recruitment Team`
        ].join("\n")
      });
    } catch (mailError) {
      console.error("[mail error] Assessment submitted but notification failed", {
        candidateEmail,
        error: mailError.message
      });
    }

    res.json({ message: "Assessment submitted", score, total });
  } catch (error) {
    next(error);
  }
};

