import { api, qs } from "./http.js";
import { onLangChange, t, tStatus } from "./i18n.js";

const load = async () => {
  try {
    await api("/api/tech/session");
    const firstStatusOpt = qs("statusFilter")?.querySelector("option[value='']");
    if (firstStatusOpt) firstStatusOpt.textContent = t("common.all");
    for (const option of qs("statusFilter").options) {
      if (option.value) option.textContent = tStatus(option.value);
    }
    const status = qs("statusFilter").value;
    const data = await api(`/api/tech/tickets?status=${encodeURIComponent(status)}`);
    qs("rows").innerHTML = data.tickets.map((ticket) => `
      <tr>
        <td>${ticket.ticket_code}</td><td>${ticket.client_email}</td><td>${tStatus(ticket.status)}</td><td>${tStatus(ticket.payment_status)}</td>
        <td><a href="/tech/tickets/${ticket.ticket_code}">${t("common.open")}</a></td>
      </tr>`).join("");
  } catch {
    window.location.href = "/tech/login";
  }
};
qs("refreshBtn").onclick = load;
qs("statusFilter").onchange = load;
qs("logoutBtn").onclick = async () => { await api("/api/tech/logout", { method: "POST" }); window.location.href = "/tech/login"; };
load();
onLangChange(load);
