const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
async function request(path, { method = "GET", body, token } = {}) {
    const headers = { "Content-Type": "application/json" };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    let res;
    try {
        res = await fetch(`${API_URL}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });
    } catch {
        throw new Error(`Cannot reach the API at ${API_URL}. Check that the backend is running.`);
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.message || `API request failed (${res.status} ${res.statusText})`);
    }
    return data;
}
export async function registerUser(name, email, password, phone) {
    return request("/auth/register", {
        method: "POST",
        body: { name, email, password, phone },
    });
}
export async function loginUser(email, password) {
    return request("/auth/login", {
        method: "POST",
        body: { email, password },
    });
}
export async function getMe(token) {
    return request("/auth/me", { token });
}
