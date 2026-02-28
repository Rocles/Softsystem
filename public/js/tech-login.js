import { api, qs } from "./http.js";
qs("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  qs("err").textContent = "";
  try {
    await api("/api/tech/login", { method: "POST", body: { email: qs("email").value, password: qs("password").value } });
    window.location.href = "/tech";
  } catch (err) {
    qs("err").textContent = err.message;
  }
});