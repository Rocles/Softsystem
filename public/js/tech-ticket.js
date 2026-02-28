import { api, qs } from "./http.js";
import { onLangChange, t as tr, tStatus } from "./i18n.js";
const ticketId = window.location.pathname.split("/").pop();

const render = async () => {
  try {
    for (const option of qs("statusSel").options) {
      option.textContent = tStatus(option.value);
    }
    await api("/api/tech/session");
    const data = await api(`/api/tech/tickets/${ticketId}`);
    const t = data.ticket;
    qs("ticketTitle").textContent = t.ticket_code;
    qs("ticketMeta").textContent = `${t.client_name} (${t.client_email}) | ${t.category} | ${t.priority} | ${tr("common.status").toLowerCase()}: ${tStatus(t.status)}`;
    qs("statusSel").value = t.status;
    qs("chatBox").innerHTML = (data.messages || []).map((m) => `<div class='msg ${m.sender_type === "client" ? "client" : "support"}'><b>${m.sender_type === "client" ? tr("admin.col_client") : tr("nav.technician")}</b><p>${m.message}</p>${m.attachment_url ? `<a href='${m.attachment_url}' target='_blank'>${tr("common.attachment")}</a>` : ""}<br/><small>${m.created_at}</small></div>`).join("");
    qs("notesBox").innerHTML = (data.notes || []).map((n) => `<div class='msg support'><b>${n.tech_name}</b><p>${n.note}</p><small>${n.created_at}</small></div>`).join("");
  } catch {
    window.location.href = "/tech/login";
  }
};

qs("statusBtn").onclick = async () => { await api(`/api/tech/tickets/${ticketId}/status`, { method: "PATCH", body: { status: qs("statusSel").value } }); await render(); };
qs("chatForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  qs("chatErr").textContent = "";
  try {
    const formData = new FormData();
    formData.append("message", qs("chatMsg").value);
    const file = qs("chatFile").files[0];
    if (file) formData.append("attachment", file);
    await api(`/api/tech/tickets/${ticketId}/messages`, { method: "POST", formData });
    qs("chatForm").reset();
    await render();
  } catch (err) { qs("chatErr").textContent = err.message; }
});
qs("noteForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  qs("noteErr").textContent = "";
  try {
    await api(`/api/tech/tickets/${ticketId}/notes`, { method: "POST", body: { note: qs("noteMsg").value } });
    qs("noteForm").reset();
    await render();
  } catch (err) { qs("noteErr").textContent = err.message; }
});

render();
setInterval(render, 5000);
onLangChange(render);
