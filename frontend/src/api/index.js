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

// ponytail: client seed doctors use string ids (e.g. "gen1"); DB column is uuid.
// If we forward a non-uuid doctor_id, Supabase returns 22P02 (invalid_text_representation)
// and the booking fails. Sanitize once here so all flow pages stay clean.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const sanitizePayload = (payload) => {
  const p = {};
  for (const [k, v] of Object.entries(payload)) {
    if (v === undefined) continue; // drop undefined so Supabase uses column defaults
    p[k] = v;
  }
  if (p.doctor_id != null && !UUID_RE.test(String(p.doctor_id))) p.doctor_id = null;
  return p;
};

async function queueWrite(payload) {
  const clean = sanitizePayload(payload);

  // 1. Try Express API (service-role, bypasses RLS)
  try {
    const res = await request('/api/queue', { method: 'POST', body: clean });
    if (res.success) return { success: true };
  } catch (err) {
    console.warn('[queueWrite] Express path failed:', err?.message);
  }

  // 2. Fallback: Supabase anon insert (RLS allows public insert)
  const { data, error } = await supabase
    .from('queue_tokens')
    .insert([clean])
    .select()
    .single();

  // Supabase returns {data, error} — does NOT throw on non-2xx.
  // Catching network errors only misses schema/RLS failures.
  if (error) {
    console.error('[queueWrite] Supabase error:', error.message, '| code:', error.code, '| hint:', error.hint, '| details:', error.details, '| payload keys:', Object.keys(clean));
    return { success: false, error };
  }
  return { success: true, data };
}

// ── Centralized queue status update ─────────────────────
async function queueUpdate(tokenId, updates) {
  const clean = sanitizePayload(updates);

  // 1. Try Express API
  try {
    const res = await request(`/api/queue/${encodeURIComponent(tokenId)}/status`, {
      method: 'PATCH',
      body: clean,
    });
    if (res.success) return { success: true };
  } catch (err) {
    console.warn('[queueUpdate] Express path failed:', err?.message);
  }

  // 2. Fallback: Supabase anon update
  // ponytail: .single() returns PGRST116 when 0 rows match, which is a false-negative
  // for an update that simply changed nothing visible. Use .select() (array) instead.
  const { data, error } = await supabase
    .from('queue_tokens')
    .update(clean)
    .eq('token_id', tokenId)
    .select();

  if (error) {
    console.error('[queueUpdate] Supabase error:', error.message, '| code:', error.code);
    return { success: false, error };
  }
  return { success: true, data: data?.[0] };
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
