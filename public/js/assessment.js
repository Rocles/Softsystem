import { api, qs } from "./http.js";

const form = qs("assessmentForm");
const errEl = qs("assessErr");
const okEl = qs("assessOk");

const params = new URLSearchParams(window.location.search);
const emailFromUrl = params.get("email") || "";
const nameFromUrl = params.get("name") || "";
const appIdFromUrl = params.get("applicationId") || "";

if (emailFromUrl) qs("candidateEmail").value = emailFromUrl;
if (nameFromUrl) qs("candidateName").value = nameFromUrl;
if (appIdFromUrl) qs("applicationId").value = appIdFromUrl;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errEl.textContent = "";
  okEl.textContent = "";

  try {
    const answers = {};
    for (let i = 1; i <= 20; i += 1) {
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      if (!selected) throw new Error(`Question ${i} is required`);
      answers[`q${i}`] = selected.value;
    }

    const payload = {
      candidateName: qs("candidateName").value.trim(),
      candidateEmail: qs("candidateEmail").value.trim(),
      applicationId: qs("applicationId").value.trim(),
      answers
    };

    const data = await api("/api/jobs/assessment/submit", { method: "POST", body: payload });
    okEl.textContent = `Assessment submitted successfully. Score recorded: ${data.score}/${data.total}`;
    form.reset();
  } catch (error) {
    errEl.textContent = error.message;
  }
});

