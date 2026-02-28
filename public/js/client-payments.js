import { api, fmtMoney, qs } from "./http.js";
import { onLangChange, t, tStatus } from "./i18n.js";

const STORAGE_KEY = "SoftSystem97Tickets";

const loadSaved = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

const renderPayments = async () => {
  const rowsEl = qs("paymentRows");
  qs("paymentMsg").textContent = "";
  const entries = loadSaved();
  if (!entries.length) {
    rowsEl.innerHTML = "";
    qs("paymentMsg").textContent = t("client.no_saved");
    return;
  }

  const detailed = [];
  for (const item of entries) {
    try {
      const data = await api(`/api/client/tickets/${encodeURIComponent(item.ticketId)}?token=${encodeURIComponent(item.token)}`);
      const ticket = data.ticket;
      if (ticket.payment_status === "pending" && Number(ticket.price_cents || 0) > 0) {
        detailed.push({ ticket, token: item.token });
      }
    } catch {
      // ignore
    }
  }

  rowsEl.innerHTML = detailed.map((x) => `
    <tr>
      <td>${x.ticket.ticketId}</td>
      <td>${tStatus(x.ticket.status)}</td>
      <td>${tStatus(x.ticket.payment_status)}</td>
      <td>${fmtMoney(x.ticket.price_cents, x.ticket.currency)}</td>
      <td><a href="/client/${encodeURIComponent(x.ticket.ticketId)}?token=${encodeURIComponent(x.token)}">${t("payments.pay_now")}</a></td>
    </tr>
  `).join("");

  if (!detailed.length) qs("paymentMsg").textContent = t("client.no_pending_payments");
};

await renderPayments();
onLangChange(renderPayments);
