const API_BASE = "http://localhost:5170/api/auth"; 

async function checkResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw data;
  }
  return data;
}

export async function register(formData) {
  const response = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });
  return checkResponse(response);
}

export async function verifyEmail(token) {
    const response = await fetch(`${API_BASE}/verify-email?token=${encodeURIComponent(token)}`, {
      method: "GET"
    });
    return checkResponse(response); 
}

export async function login(formData) {
  const response = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });
  return checkResponse(response);
}

export async function getProfile() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return checkResponse(response);
}

export async function enableMfa() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/mfa/enable`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
  });
  return checkResponse(response);
}

export async function verifyMfaSetup({ code }) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/mfa/verify-setup`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ code })
  });
  return checkResponse(response);
}

export async function verifyMfaLogin({ code, token }) {
  const response = await fetch(`${API_BASE}/mfa/verify-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ code })
  });
  return checkResponse(response);
}

export async function logout({ token, refreshToken }) {
  const response = await fetch(`${API_BASE}/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ token, refreshToken })
  });
  return checkResponse(response);
}

export async function getAdminData() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/admin-only`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return checkResponse(response);
}

export async function refreshToken({ token, refreshToken }) {
  const response = await fetch(`${API_BASE}/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, refreshToken })
  });
  return checkResponse(response);
}
