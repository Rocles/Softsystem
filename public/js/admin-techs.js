import { api, qs } from "./http.js";
import { onLangChange, t } from "./i18n.js";

const load = async () => {
  try {
    await api("/api/admin/session");
    const data = await api("/api/admin/techs");
    qs("rows").innerHTML = data.techs.map((tech) => `
      <tr>
        <td>${tech.id}</td><td>${tech.name}</td><td>${tech.email}</td><td>${tech.is_active ? t("common.yes") : t("common.no")}</td>
        <td>
          <button data-act="toggle" data-id="${tech.id}" data-active="${tech.is_active}">${tech.is_active ? t("common.deactivate") : t("common.activate")}</button>
          <button data-act="reset" data-id="${tech.id}" class="secondary">${t("admin.reset_password")}</button>
        </td>
      </tr>`).join("");

    for (const btn of qs("rows").querySelectorAll("button")) {
      btn.onclick = async () => {
        const id = btn.dataset.id;
        if (btn.dataset.act === "toggle") {
          const tech = data.techs.find((x) => String(x.id) === String(id));
          await api(`/api/admin/techs/${id}`, {
            method: "PATCH",
            body: { name: tech.name, email: tech.email, is_active: !Number(tech.is_active) }
          });
        } else {
          const password = prompt(t("admin.prompt_new_password"));
          if (password) await api(`/api/admin/techs/${id}/reset-password`, { method: "POST", body: { password } });
        }
        await load();
      };
    }
  } catch {
    window.location.href = "/admin/login";
  }
};

qs("createForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  qs("createErr").textContent = "";
  try {
    await api("/api/admin/techs", {
      method: "POST",
      body: {
        name: qs("name").value,
        email: qs("email").value,
        password: qs("password").value
      }
    });
    qs("createForm").reset();
    await load();
  } catch (err) {
    qs("createErr").textContent = err.message;
  }
});

qs("logoutBtn").onclick = async () => { await api("/api/admin/logout", { method: "POST" }); window.location.href = "/admin/login"; };
load();
onLangChange(load);
