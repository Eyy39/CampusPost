const API_BASE = "http://localhost:4000/api";

function getToken() {
  return localStorage.getItem("campuspost_token");
}

async function request(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${path}`, config);
  if (res.status === 204) return null;

  let data;
  try {
    data = await res.json();
  } catch {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  if (!res.ok) {
    if (res.status === 401 && data.message === "User not found") {
      throw new Error("Account not found");
    }
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export const api = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  delete: (path) => request("DELETE", path),
};
