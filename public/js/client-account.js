import { api, fmtMoney, qs } from "./http.js";
import { onLangChange, t, tStatus } from "./i18n.js";

const setAccountUi = (user) => {
  const guest = qs("accountGuest");
  const logged = qs("accountUser");
  if (!user) {
    guest.style.display = "grid";
    logged.style.display = "none";
    qs("accountUserName").textContent = t("account.logged_in");
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
        <td><a href="/client/${encodeURIComponent(ticket.ticketId)}">${t("common.open")}</a></td>
      </tr>
    `).join("");
    if (!rows.length) qs("accountMsg").textContent = t("client.no_account_tickets");
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

await initAccount();
onLangChange(async () => {
  await renderAccountTickets();
});
