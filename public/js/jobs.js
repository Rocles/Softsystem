import { t } from "./i18n.js";
const byId = (id) => document.getElementById(id);

const jobForm = byId("jobForm");
const jobErr = byId("jobErr");
const jobOk = byId("jobOk");

if (jobForm) {
  jobForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    jobErr.textContent = "";
    jobOk.textContent = "";

    const data = new FormData();
    data.append("fullName", byId("fullName").value.trim());
    data.append("email", byId("email").value.trim());
    data.append("phone", byId("phone").value.trim());
    data.append("location", byId("location").value.trim());
    data.append("yearsExperience", byId("yearsExperience").value.trim());
    data.append("skills", byId("skills").value.trim());
    data.append("message", byId("message").value.trim());

    const cv = byId("cv").files?.[0];
    if (!cv) {
      jobErr.textContent = t("jobs.err_cv");
      return;
    }
    data.append("cv", cv);

    try {
      const res = await fetch("/api/jobs/apply", {
        method: "POST",
        body: data
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || t("jobs.err_submit"));
      jobOk.textContent = t("jobs.ok_submit");
      jobForm.reset();
    } catch (err) {
      jobErr.textContent = err.message;
    }
  });
}
