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

const rememberTicket = (ticketId, token) => {
  if (!ticketId || !token) return;
  const list = loadSaved();
  const next = [{ ticketId, token }, ...list.filter((x) => x.ticketId !== ticketId)].slice(0, 25);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
};

const prefillFromClientSession = async () => {
  try {
    const session = await api("/api/customer/session");
    const user = session?.user;
    if (!user) return;
    if (!qs("fullName").value) qs("fullName").value = user.name || "";
    if (!qs("email").value) qs("email").value = user.email || "";
    qs("email").readOnly = true;
  } catch {
    // guest user
  }
};

const renderSaved = async () => {
  const list = loadSaved();
  const rowsEl = qs("savedRows");
  qs("portalMsg").textContent = "";
  if (!list.length) {
    rowsEl.innerHTML = "";
    qs("portalMsg").textContent = t("client.no_saved");
    return;
  }

  const detailed = [];
  for (const item of list) {
    try {
      const data = await api(`/api/client/tickets/${encodeURIComponent(item.ticketId)}?token=${encodeURIComponent(item.token)}`);
      detailed.push({ ...item, ticket: data.ticket });
    } catch {
      // ignore invalid items
    }
  }

  rowsEl.innerHTML = detailed.map((x) => `
    <tr>
      <td>${x.ticket.ticketId}</td>
      <td>${tStatus(x.ticket.status)}</td>
      <td>${tStatus(x.ticket.payment_status)}</td>
      <td>${fmtMoney(x.ticket.price_cents, x.ticket.currency)}</td>
      <td><a href="/client/${encodeURIComponent(x.ticket.ticketId)}?token=${encodeURIComponent(x.token)}">${t("common.open")}</a></td>
    </tr>
  `).join("");

  if (!detailed.length) qs("portalMsg").textContent = t("client.no_accessible_tickets");
};

qs("ticketForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  qs("ticketError").textContent = "";
  try {
    const formData = new FormData();
    formData.append("fullName", qs("fullName").value);
    formData.append("email", qs("email").value);
    formData.append("phone", qs("phone").value);
    formData.append("company", qs("company").value);
    formData.append("category", qs("category").value);
    formData.append("priority", qs("priority").value);
    formData.append("description", qs("description").value);
    const file = qs("attachment").files[0];
    if (file) formData.append("attachment", file);

    const data = await api("/api/tickets", { method: "POST", formData });
    rememberTicket(data.ticketId, data.accessToken);
    qs("ticketForm").reset();
    await renderSaved();
  } catch (error) {
    qs("ticketError").textContent = error.message;
  }
});

qs("accessForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  qs("accessError").textContent = "";
  try {
    const data = await api("/api/client/access", {
      method: "POST",
      body: {
        ticketId: qs("accessTicketId").value,
        email: qs("accessEmail").value
      }
    });
    rememberTicket(data.ticketId, data.accessToken);
    qs("accessForm").reset();
    await renderSaved();
  } catch (error) {
    qs("accessError").textContent = error.message;
  }
});

await renderSaved();
await prefillFromClientSession();
onLangChange(renderSaved);
