// API helper — all calls go through the Express backend at /api
import { supabase } from './supabaseClient';

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

// ── Centralized queue write ─────────────────────────────
// ponytail: localhost Express fallback only works in dev;
// in production, Express is unreachable so this always uses Supabase anon.
// Add Vercel serverless function endpoint if Express path is needed in prod.
async function queueWrite(payload) {
  // 1. Try Express API (service-role, bypasses RLS)
  try {
    const res = await request('/api/queue', { method: 'POST', body: payload });
    if (res.success) return { success: true };
  } catch (_) {
    // Express unreachable or failed — fall through to Supabase
  }

  // 2. Fallback: Supabase anon insert (RLS allows public insert)
  const { data, error } = await supabase
    .from('queue_tokens')
    .insert([payload])
    .select()
    .single();

  // Supabase returns {data, error} — does NOT throw on non-2xx.
  // Catching network errors only misses schema/RLS failures.
  if (error) return { success: false, error };
  return { success: true, data };
}

// ── Centralized queue status update ─────────────────────
async function queueUpdate(tokenId, updates) {
  // 1. Try Express API
  try {
    const res = await request(`/api/queue/${encodeURIComponent(tokenId)}/status`, {
      method: 'PATCH',
      body: updates,
    });
    if (res.success) return { success: true };
  } catch (_) {
    // fall through
  }

  // 2. Fallback: Supabase anon update
  const { data, error } = await supabase
    .from('queue_tokens')
    .update(updates)
    .eq('token_id', tokenId)
    .select()
    .single();

  if (error) return { success: false, error };
  return { success: true, data };
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
  write: queueWrite,   // verified write: checks .error, falls back to Supabase
  update: queueUpdate, // verified status update
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
