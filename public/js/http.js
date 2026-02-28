export const api = async (url, { method = "GET", body, formData } = {}) => {
  const options = { method, credentials: "include", headers: {} };
  if (formData) {
    options.body = formData;
  } else if (body !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
};

export const qs = (id) => document.getElementById(id);
export const fmtMoney = (cents, currency = "usd") => `${(Number(cents || 0) / 100).toFixed(2)} ${String(currency).toUpperCase()}`;