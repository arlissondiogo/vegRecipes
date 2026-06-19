const BASE_URL = "http://localhost:3000";

async function request(method, path, body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body !== null) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, options);

  if (res.status === 204) return null;

  const data = await res.json();

  if (!res.ok) {
    const msg =
      data?.error || data?.erro || data?.message || `Erro ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

export const api = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  delete: (path, body = null) => request("DELETE", path, body),
};
