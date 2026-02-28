import { api, qs } from "./http.js";
import { onLangChange, t as tr, tStatus } from "./i18n.js";

const ticketId = window.location.pathname.split("/").pop();
let editingPrice = false;

const parseMoneyInput = (value) => {
  let raw = String(value || "").trim();
  if (!raw) return NaN;
  raw = raw.replace(/\s/g, "");

  const hasComma = raw.includes(",");
  const hasDot = raw.includes(".");
  if (hasComma && hasDot) {
    const lastComma = raw.lastIndexOf(",");
    const lastDot = raw.lastIndexOf(".");
    const decimalSep = lastComma > lastDot ? "," : ".";
    const thousandSep = decimalSep === "," ? "." : ",";
    raw = raw.split(thousandSep).join("");
    raw = raw.replace(decimalSep, ".");
  } else if (hasComma) {
    raw = raw.replace(",", ".");
  }
  return Number(raw);
};

const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll("\"", "&quot;")
  .replaceAll("'", "&#39;");

const render = async () => {
  try {
    for (const option of qs("statusSel").options) {
      option.textContent = tStatus(option.value);
    }
    await api("/api/admin/session");
    const [ticketData, techData] = await Promise.all([
      api(`/api/admin/tickets/${ticketId}`),
      api("/api/admin/techs")
    ]);

    const t = ticketData.ticket;
    qs("ticketTitle").textContent = t.ticket_code;
    qs("ticketMeta").textContent = `${t.client_name} (${t.client_email}) | ${t.category} | ${t.priority} | ${tr("client.payment_prefix").toLowerCase()}:${tStatus(t.payment_status)}`;
    qs("ticketDetails").innerHTML = `
      <div><b>${tr("admin.col_client")}:</b> ${escapeHtml(t.client_name || "-")}</div>
      <div><b>${tr("common.email")}:</b> ${escapeHtml(t.client_email || "-")}</div>
      <div><b>${tr("admin.col_company")}:</b> ${escapeHtml(t.company || "-")}</div>
      <div><b>${tr("support.phone_optional").replace(" (optional)","").replace(" (optionnel)","")}:</b> ${escapeHtml(t.client_phone || "-")}</div>
      <div><b>${tr("support.category")}:</b> ${escapeHtml(t.category || "-")}</div>
      <div><b>${tr("support.priority")}:</b> ${escapeHtml(t.priority || "-")}</div>
      <div style="grid-column:1/-1;"><b>${tr("admin.col_description")}:</b><br/>${escapeHtml(t.description || "-")}</div>
      <div style="grid-column:1/-1;"><b>${tr("common.attachment")}:</b> ${t.attachment_url ? `<a href="${t.attachment_url}" target="_blank">${tr("common.open")}</a>` : "-"}</div>
    `;
    qs("statusSel").value = t.status;
    if (!editingPrice) {
      qs("priceInput").value = t.price_cents ? (t.price_cents / 100).toFixed(2) : "";
    }

    qs("techSel").innerHTML = `<option value="">-- ${tr("common.open")} --</option>` + techData.techs
      .filter((x) => Number(x.is_active) === 1)
      .map((x) => `<option value="${x.id}" ${Number(t.assigned_to) === Number(x.id) ? "selected" : ""}>${x.name}</option>`)
      .join("");

    qs("chatBox").innerHTML = (ticketData.messages || []).map((m) => `<div class="msg ${m.sender_type === "client" ? "client" : "support"}"><b>${m.sender_type === "client" ? tr("admin.col_client") : tr("nav.technician")}</b><p>${m.message}</p>${m.attachment_url ? `<a href='${m.attachment_url}' target='_blank'>${tr("common.attachment")}</a>` : ""}<br/><small>${m.created_at}</small></div>`).join("");
    qs("notesBox").innerHTML = (ticketData.notes || []).map((n) => `<div class="msg support"><b>${n.tech_name}</b><p>${n.note}</p><small>${n.created_at}</small></div>`).join("");
    qs("logsBox").innerHTML = (ticketData.logs || []).map((l) => `<div class="msg"><b>${l.action_type}</b><p>${l.details || ""}</p><small>${l.created_at}</small></div>`).join("");
  } catch {
    window.location.href = "/admin/login";
  }
};

qs("takeChargeBtn").onclick = async () => { await api(`/api/admin/tickets/${ticketId}/take-charge`, { method: "POST" }); await render(); };
qs("statusBtn").onclick = async () => { await api(`/api/admin/tickets/${ticketId}/status`, { method: "PATCH", body: { status: qs("statusSel").value } }); await render(); };
qs("priceInput").addEventListener("focus", () => { editingPrice = true; });
qs("priceInput").addEventListener("blur", () => { editingPrice = false; });
qs("setPriceBtn").onclick = async () => {
  qs("priceErr").textContent = "";
  qs("priceMsg").textContent = "";
  try {
    const parsed = parseMoneyInput(qs("priceInput").value);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      qs("priceErr").textContent = tr("ticket.price_invalid");
      return;
    }
    const data = await api(`/api/admin/tickets/${ticketId}/price`, { method: "PATCH", body: { price: parsed } });
    qs("priceMsg").textContent = `${tr("client.payment_page")}: ${data.paymentLink}`;
    editingPrice = false;
    await render();
  } catch (err) {
    qs("priceErr").textContent = err.message;
  }
};
qs("assignBtn").onclick = async () => { await api(`/api/admin/tickets/${ticketId}/assign`, { method: "PATCH", body: { techId: Number(qs("techSel").value) } }); await render(); };

qs("chatForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  qs("chatErr").textContent = "";
  try {
    const formData = new FormData();
    formData.append("message", qs("chatMsg").value);
    const file = qs("chatFile").files[0];
    if (file) formData.append("attachment", file);
    await api(`/api/admin/tickets/${ticketId}/messages`, { method: "POST", formData });
    qs("chatForm").reset();
    await render();
  } catch (err) { qs("chatErr").textContent = err.message; }
});

qs("noteForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  qs("noteErr").textContent = "";
  try {
    await api(`/api/admin/tickets/${ticketId}/notes`, { method: "POST", body: { note: qs("noteMsg").value } });
    qs("noteForm").reset();
    await render();
  } catch (err) { qs("noteErr").textContent = err.message; }
});

render();
setInterval(render, 5000);
onLangChange(render);
