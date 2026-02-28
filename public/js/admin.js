import { api, qs } from "./http.js";
import { onLangChange, t, tStatus } from "./i18n.js";

const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll("\"", "&quot;")
  .replaceAll("'", "&#39;");

const shortText = (value, max = 120) => {
  const txt = String(value ?? "").trim();
  if (!txt) return "-";
  return txt.length > max ? `${txt.slice(0, max)}...` : txt;
};

const load = async () => {
  try {
    await api("/api/admin/session");
    const firstStatusOpt = qs("statusFilter")?.querySelector("option[value='']");
    if (firstStatusOpt) firstStatusOpt.textContent = t("admin.all_status");
    for (const option of qs("statusFilter").options) {
      if (option.value) option.textContent = tStatus(option.value);
    }
    const status = qs("statusFilter").value;
    const tech = qs("techFilter").value;
    const search = qs("search").value.trim();
    const url = `/api/admin/tickets?status=${encodeURIComponent(status)}&technician=${encodeURIComponent(tech)}&search=${encodeURIComponent(search)}`;
    const [data, techs] = await Promise.all([api(url), api("/api/admin/techs")]);
    qs("techFilter").innerHTML = `<option value="">${t("admin.all_techs")}</option>` +
      techs.techs.filter((x) => Number(x.is_active) === 1).map((x) => `<option value="${x.id}" ${String(tech) === String(x.id) ? "selected" : ""}>${x.name}</option>`).join("");
    qs("ticketRows").innerHTML = data.tickets.map((ticket) => `
      <tr>
        <td>${escapeHtml(ticket.ticket_code)}</td>
        <td>${escapeHtml(ticket.client_name || "-")}</td>
        <td>${escapeHtml(ticket.company || "-")}</td>
        <td>${escapeHtml(ticket.client_email || "-")}</td>
        <td title="${escapeHtml(ticket.description || "")}">${escapeHtml(shortText(ticket.description))}</td>
        <td>${escapeHtml(tStatus(ticket.status))}</td>
        <td>${escapeHtml(tStatus(ticket.payment_status))}</td>
        <td>${escapeHtml(ticket.technician_name || "-")}</td>
        <td><a href="/admin/tickets/${ticket.ticket_code}">${t("common.open")}</a></td>
      </tr>
    `).join("");
  } catch {
    window.location.href = "/admin/login";
  }
};

qs("refreshBtn").onclick = load;
qs("statusFilter").onchange = load;
qs("techFilter").onchange = load;
qs("logoutBtn").onclick = async () => { await api("/api/admin/logout", { method: "POST" }); window.location.href = "/admin/login"; };
load();
onLangChange(load);
