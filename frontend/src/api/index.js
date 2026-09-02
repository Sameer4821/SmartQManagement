// API helper — all calls go through the Express backend at /api
const BASE_URL = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Request failed');
  return json;
}

// ── Queue API ─────────────────────────────────────────
export const queueApi = {
  getAll: () => request('/api/queue'),
  getNextSequence: (type) => request(`/api/queue/next-sequence?type=${encodeURIComponent(type || 'common')}`),
  getByDepartment: (dept) => request(`/api/queue/department/${encodeURIComponent(dept)}`),
  insert: (payload) => request('/api/queue', { method: 'POST', body: payload }),
  updateStatus: (tokenId, status) => request(`/api/queue/${tokenId}/status`, { method: 'PATCH', body: { status } }),
  remove: (tokenId) => request(`/api/queue/${tokenId}`, { method: 'DELETE' }),
  getNotifications: () => request('/api/queue/notifications'),
};

// ── Staff API ─────────────────────────────────────────
export const staffApi = {
  login: (staff_id, password) => request('/api/staff/login', { method: 'POST', body: { staff_id, password } }),
  getDepartments: () => request('/api/staff/departments'),
  getDoctors: () => request('/api/staff/doctors'),
  addConsultation: (data) => request('/api/staff/consultations', { method: 'POST', body: data }),
  getConsultation: (tokenId) => request(`/api/staff/consultations/${tokenId}`),
};

// ── Auth API ──────────────────────────────────────────
export const authApi = {
  signUp: (email, password, name, phone) =>
    request('/api/auth/signup', { method: 'POST', body: { email, password, name, phone } }),
  signIn: (email, password) =>
    request('/api/auth/signin', { method: 'POST', body: { email, password } }),
  signOut: () => request('/api/auth/signout', { method: 'POST' }),
};
