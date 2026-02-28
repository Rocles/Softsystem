import { t } from "./i18n.js";
const byId = (id) => document.getElementById(id);

const companyForm = byId("companyForm");
const companyErr = byId("companyErr");
const companyOk = byId("companyOk");
const openBecomeClientBtn = byId("openBecomeClientBtn");
const becomeClientPanel = byId("becomeClientPanel");

const showBecomeClientForm = () => {
  if (!becomeClientPanel) return;
  becomeClientPanel.style.display = "block";
  byId("become-client")?.scrollIntoView({ behavior: "smooth", block: "start" });
};

if (openBecomeClientBtn) {
  openBecomeClientBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showBecomeClientForm();
  });
}

if (window.location.hash === "#become-client") {
  showBecomeClientForm();
}

if (companyForm) {
  companyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    companyErr.textContent = "";
    companyOk.textContent = "";

    const payload = {
      firstName: byId("firstName").value.trim(),
      lastName: byId("lastName").value.trim(),
      companyName: byId("companyName").value.trim(),
      positionTitle: byId("positionTitle").value.trim(),
      website: byId("website").value.trim(),
      phone: byId("phone").value.trim(),
      workEmail: byId("workEmail").value.trim(),
      needs: byId("needs").value.trim(),
      hearAbout: byId("hearAbout").value.trim()
    };

    try {
      const res = await fetch("/api/companies/become-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || t("company.err_submit"));
      companyOk.textContent = t("company.ok_submit");
      companyForm.reset();
    } catch (err) {
      companyErr.textContent = err.message;
    }
  });
}
