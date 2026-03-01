import { api, qs } from "./http.js";

const form = qs("assessmentForm");
const errEl = qs("assessErr");
const okEl = qs("assessOk");
const timerBadge = qs("timerBadge");
const submitBtn = qs("submitAssessmentBtn");
const resultBox = qs("assessResult");

const params = new URLSearchParams(window.location.search);
const emailFromUrl = params.get("email") || "";
const nameFromUrl = params.get("name") || "";
const appIdFromUrl = params.get("applicationId") || "";

if (emailFromUrl) qs("candidateEmail").value = emailFromUrl;
if (nameFromUrl) qs("candidateName").value = nameFromUrl;
if (appIdFromUrl) qs("applicationId").value = appIdFromUrl;

const TIME_LIMIT_SECONDS = 20 * 60;
const attemptKey = `softsystem97_assessment_started_${appIdFromUrl || "na"}_${emailFromUrl || "na"}`;
const persistedStart = Number(sessionStorage.getItem(attemptKey) || 0);
const startedAt = persistedStart > 0 ? persistedStart : Date.now();
if (!persistedStart) sessionStorage.setItem(attemptKey, String(startedAt));

const formatRemaining = (seconds) => {
  const safe = Math.max(0, seconds);
  const mm = String(Math.floor(safe / 60)).padStart(2, "0");
  const ss = String(safe % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};

let submitting = false;
let timerHandle = null;

const buildAnswers = ({ requireAll }) => {
  const answers = {};
  for (let i = 1; i <= 20; i += 1) {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (!selected && requireAll) {
      const firstOption = document.querySelector(`input[name="q${i}"]`);
      if (firstOption) firstOption.scrollIntoView({ behavior: "smooth", block: "center" });
      throw new Error(`Please answer question ${i}.`);
    }
    answers[`q${i}`] = selected ? selected.value : "";
  }
  return answers;
};

const renderResult = (data) => {
  const statusText = data.passed ? "PASSED" : "NOT PASSED";
  const statusColor = data.passed ? "#0f7a35" : "#b42318";
  const nextStep = data.passed
    ? `
      <h4 style="margin:12px 0 6px;color:#0f7a35;">Congratulations! You passed the first stage.</h4>
      <p style="margin:0 0 8px;">Please record a <strong>5-minute</strong> video introduction in English, then send your video link to <strong>${data.recruitmentEmail}</strong>.</p>
      <ul style="margin:0 0 8px 18px;">
        <li>Present yourself and your IT support background.</li>
        <li>Explain one real troubleshooting case you handled.</li>
        <li>Talk about your experience without mentioning company names.</li>
      </ul>
      <p style="margin:0 0 8px;">You can share a Google Drive or unlisted YouTube link by email.</p>
      <p style="margin:0;"><a href="${data.videoPresentationUrl}" target="_blank" rel="noreferrer">Click here to record your video</a></p>
    `
    : `<p style="margin:10px 0 0;">Thank you for your effort. We encourage you to continue practicing and apply again.</p>`;

  resultBox.innerHTML = `
    <h3 style="margin:0 0 8px;">Assessment Result</h3>
    <p style="margin:0 0 4px;"><strong>Status:</strong> <span style="color:${statusColor};">${statusText}</span></p>
    <p style="margin:0 0 4px;"><strong>Score:</strong> ${data.score}/${data.total} (${data.percentage}%)</p>
    <p style="margin:0 0 4px;"><strong>Pass mark:</strong> ${data.passScore}/${data.total}</p>
    <p style="margin:0 0 4px;"><strong>Time used:</strong> ${Math.max(0, Number(data.elapsedSeconds || 0))} seconds</p>
    ${nextStep}
  `;
  resultBox.style.display = "block";
};

const submitAssessment = async ({ force = false } = {}) => {
  if (submitting) return;
  submitting = true;
  errEl.textContent = "";
  okEl.textContent = "";
  if (submitBtn) submitBtn.disabled = true;

  try {
    const candidateName = qs("candidateName").value.trim();
    const candidateEmail = qs("candidateEmail").value.trim();
    if (!candidateName) {
      qs("candidateName").focus();
      throw new Error("Full name is required.");
    }
    if (!candidateEmail || !candidateEmail.includes("@")) {
      qs("candidateEmail").focus();
      throw new Error("A valid email is required.");
    }

    const answers = buildAnswers({ requireAll: !force });
    const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);

    const payload = {
      candidateName,
      candidateEmail,
      applicationId: qs("applicationId").value.trim(),
      answers,
      elapsedSeconds,
      timedOut: force
    };

    const data = await api("/api/jobs/assessment/submit", { method: "POST", body: payload });
    okEl.textContent = "Assessment submitted successfully.";
    form.style.display = "none";
    if (timerHandle) clearInterval(timerHandle);
    renderResult(data);
    sessionStorage.removeItem(attemptKey);
  } catch (error) {
    errEl.textContent = error.message;
    if (submitBtn) submitBtn.disabled = false;
    submitting = false;
  }
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await submitAssessment({ force: false });
});

const tickTimer = () => {
  const elapsed = Math.floor((Date.now() - startedAt) / 1000);
  const remaining = TIME_LIMIT_SECONDS - elapsed;
  if (timerBadge) timerBadge.textContent = formatRemaining(remaining);
  if (remaining <= 0) {
    if (timerHandle) clearInterval(timerHandle);
    submitAssessment({ force: true });
  }
};

tickTimer();
timerHandle = setInterval(tickTimer, 1000);
