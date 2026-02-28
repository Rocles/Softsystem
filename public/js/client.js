import { api, fmtMoney, qs } from "./http.js";
import { onLangChange, t as tr, tStatus } from "./i18n.js";

const ticketId = window.location.pathname.split("/").pop();
const token = new URLSearchParams(window.location.search).get("token") || "";
const STORAGE_KEY = "SoftSystem97Tickets";

const rememberTicket = () => {
  if (!ticketId || !token) return;
  const raw = localStorage.getItem(STORAGE_KEY);
  const list = raw ? JSON.parse(raw) : [];
  const next = [{ ticketId, token }, ...list.filter((x) => x.ticketId !== ticketId)].slice(0, 25);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
};

if (!token) {
  qs("summary").textContent = tr("client.loading_ticket");
}

const renderMessages = (items) => {
  const box = qs("messages");
  box.innerHTML = items.map((m) => `
    <div class="msg ${m.sender_type === "client" ? "client" : "support"}">
      <strong>${m.sender_type === "client" ? tr("chat.client") : (m.sender_name || tr("chat.support"))}</strong>
      <p>${m.message}</p>
      ${m.attachment_url ? `<a href="${m.attachment_url}" target="_blank">${tr("common.attachment")}</a>` : ""}
      <br/><small>${m.created_at}</small>
    </div>
  `).join("");
};

const load = async () => {
  try {
    const data = await api(`/api/client/tickets/${ticketId}?token=${encodeURIComponent(token)}`);
    rememberTicket();
    const t = data.ticket;
    qs("title").textContent = t.ticketId;
    qs("summary").textContent = `${t.category} | ${t.priority} | ${t.description}`;
    qs("status").textContent = `${tr("client.status_prefix")}: ${tStatus(t.status)}`;
    qs("payment").textContent = `${tr("client.payment_prefix")}: ${tStatus(t.payment_status)}`;
    qs("price").textContent = `${tr("client.price_prefix")}: ${fmtMoney(t.price_cents, t.currency)}`;
    renderMessages(data.messages || []);

    const actions = qs("paymentActions");
    actions.innerHTML = "";
    if (t.payment_status === "pending" && t.price_cents > 0) {
      const payBtn = document.createElement("button");
      payBtn.textContent = tr("client.pay_card");
      payBtn.onclick = async () => {
        const result = await api(`/api/client/tickets/${ticketId}/pay/checkout?token=${encodeURIComponent(token)}`, { method: "POST" });
        if (result.provider === "stripe" && result.checkoutUrl) {
          window.location.href = result.checkoutUrl;
          return;
        }
        qs("paymentMsg").textContent = result.message || tr("client.checkout_unavailable");
      };
      actions.appendChild(payBtn);

      const mockBtn = document.createElement("button");
      mockBtn.className = "secondary";
      mockBtn.textContent = tr("client.mock_pay");
      mockBtn.onclick = async () => {
        await api(`/api/client/tickets/${ticketId}/pay/mock?token=${encodeURIComponent(token)}`, { method: "POST" });
        await load();
      };
      actions.appendChild(mockBtn);
    }

    if (t.payment_status === "paid") {
      const receipt = document.createElement("a");
      receipt.href = `/api/client/tickets/${ticketId}/receipt?token=${encodeURIComponent(token)}`;
      receipt.textContent = tr("client.download_receipt");
      receipt.target = "_blank";
      actions.appendChild(receipt);
    }
  } catch (err) {
    qs("summary").textContent = err.message;
  }
};

qs("msgForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  qs("msgError").textContent = "";
  try {
    const formData = new FormData();
    formData.append("message", qs("message").value);
    const file = qs("msgFile").files[0];
    if (file) formData.append("attachment", file);
    await api(`/api/client/tickets/${ticketId}/messages?token=${encodeURIComponent(token)}`, { method: "POST", formData });
    qs("message").value = "";
    qs("msgFile").value = "";
    await load();
  } catch (err) {
    qs("msgError").textContent = err.message;
  }
});

load();
setInterval(load, 5000);
onLangChange(load);

