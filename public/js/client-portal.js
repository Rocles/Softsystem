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

const renderSaved = async (mode = "all") => {
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
      // ignore invalid old entries
    }
  }

  const filtered = mode === "payment"
    ? detailed.filter((x) => x.ticket.payment_status === "pending" && Number(x.ticket.price_cents || 0) > 0)
    : detailed;

  rowsEl.innerHTML = filtered.map((x) => `
      <tr>
        <td>${x.ticket.ticketId}</td>
        <td>${tStatus(x.ticket.status)}</td>
        <td>${tStatus(x.ticket.payment_status)}</td>
        <td>${fmtMoney(x.ticket.price_cents, x.ticket.currency)}</td>
      <td>
        <a href="/client/${encodeURIComponent(x.ticket.ticketId)}?token=${encodeURIComponent(x.token)}">Open</a>
      </td>
    </tr>
  `).join("");

  if (!filtered.length) {
    qs("portalMsg").textContent = mode === "payment" ? t("client.no_pending_payments") : t("client.no_accessible_tickets");
  }
};

const setAccountUi = (user) => {
  const guest = qs("accountGuest");
  const logged = qs("accountUser");
  if (!user) {
    guest.style.display = "grid";
    logged.style.display = "none";
    qs("accountUserName").textContent = "Logged in";
    return;
  }
  guest.style.display = "none";
  logged.style.display = "block";
  qs("accountUserName").textContent = `${t("common.logged_in_as")} ${user.name} (${user.email})`;
};

const renderAccountTickets = async () => {
  const tbody = qs("accountRows");
  qs("accountMsg").textContent = "";
  try {
    const data = await api("/api/client/my/tickets");
    const rows = data.tickets || [];
    tbody.innerHTML = rows.map((ticket) => `
      <tr>
        <td>${ticket.ticketId}</td>
        <td>${tStatus(ticket.status)}</td>
        <td>${tStatus(ticket.payment_status)}</td>
        <td>${fmtMoney(ticket.price_cents, ticket.currency)}</td>
        <td><a href="/client/${encodeURIComponent(ticket.ticketId)}">Open</a></td>
      </tr>
    `).join("");
    if (!rows.length) {
      qs("accountMsg").textContent = t("client.no_account_tickets");
    }
  } catch (error) {
    tbody.innerHTML = "";
    qs("accountMsg").textContent = error.message;
  }
};

const initAccount = async () => {
  try {
    const session = await api("/api/customer/session");
    setAccountUi(session.user);
    await renderAccountTickets();
  } catch {
    setAccountUi(null);
  }
};

qs("accountLoginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  qs("accountLoginError").textContent = "";
  try {
    const data = await api("/api/customer/login", {
      method: "POST",
      body: {
        email: qs("accountLoginEmail").value,
        password: qs("accountLoginPassword").value
      }
    });
    setAccountUi(data.user);
    await renderAccountTickets();
  } catch (error) {
    qs("accountLoginError").textContent = error.message;
  }
});

qs("accountSignupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  qs("accountSignupError").textContent = "";
  try {
    const data = await api("/api/customer/signup", {
      method: "POST",
      body: {
        name: qs("accountSignupName").value,
        email: qs("accountSignupEmail").value,
        password: qs("accountSignupPassword").value
      }
    });
    setAccountUi(data.user);
    await renderAccountTickets();
  } catch (error) {
    qs("accountSignupError").textContent = error.message;
  }
});

qs("accountLogoutBtn").addEventListener("click", async () => {
  await api("/api/customer/logout", { method: "POST" });
  setAccountUi(null);
});

qs("viewTicketsBtn").onclick = () => renderSaved("all");
qs("paymentsBtn").onclick = () => renderSaved("payment");
qs("openTicketBtn").onclick = () => {
  document.getElementById("openTicketSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
    await renderSaved("all");
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
    await renderSaved("all");
  } catch (error) {
    qs("accessError").textContent = error.message;
  }
});
qs("contractRequestForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  qs("contractErr").textContent = "";
  qs("contractOk").textContent = "";
  try {
    await api("/api/contracts/request", {
      method: "POST",
      body: {
        contactName: qs("contractContactName").value,
        companyName: qs("contractCompanyName").value,
        email: qs("contractEmail").value,
        phone: qs("contractPhone").value,
        teamSize: qs("contractTeamSize").value,
        needs: qs("contractNeeds").value
      }
    });
    qs("contractRequestForm").reset();
    qs("contractOk").textContent = t("contract.success");
  } catch (error) {
    qs("contractErr").textContent = error.message;
  }
});

onLangChange(async () => {
  await renderSaved("all");
  try {
    await renderAccountTickets();
  } catch {
    // ignore
  }
});

await initAccount();
await renderSaved("all");

