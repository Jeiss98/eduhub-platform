/* ═══════════════════════════════════════════
   EduHub — utils.js
   Funciones compartidas entre todas las páginas
═══════════════════════════════════════════ */

'use strict';

/* ─── CONFIG ─── */
const API = 'http://localhost:3000/api';

/* ─── SESIÓN ─── */
function getToken()   { return localStorage.getItem('eduhub_token') || null; }
function getUsuario() { return JSON.parse(localStorage.getItem('eduhub_user') || 'null'); }

function saveSession(token, user) {
  localStorage.setItem('eduhub_token', token);
  localStorage.setItem('eduhub_user', JSON.stringify(user));
}
function clearSession() {
  localStorage.removeItem('eduhub_token');
  localStorage.removeItem('eduhub_user');
}

/* ─── TOAST ─── */
let _toastTimer = null;
function toast(msg, tipo = 'ok') {
  const el  = document.getElementById('toast');
  if (!el) return;
  const dot = el.querySelector('.toast-dot');
  if (dot) dot.style.background = tipo === 'err' ? '#F87171' : '#4ADE80';
  const msgEl = document.getElementById('toast-msg');
  if (msgEl) msgEl.textContent = msg;
  el.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}

/* ─── API FETCH ─── */
async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res  = await fetch(`${API}${endpoint}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje || 'Error del servidor');
  return data;
}

/* ─── FORM HELPERS ─── */
function showFerr(id, show) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('show', show);
  return show;
}
function markErr(id, show) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('err', show);
}
function showMsg(id, texto, tipo) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = texto;
  el.className = `form-msg show ${tipo === 'ok' ? 'msg-ok' : 'msg-err'}`;
}
function hideMsg(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('show');
}
function setLoading(btn, loading) {
  btn.disabled = loading;
  btn.textContent = loading ? 'Cargando...' : btn.dataset.label;
}

/* ─── TOGGLE PASSWORD ─── */
function togglePw(inputId, btn) {
  const el = document.getElementById(inputId);
  el.type  = el.type === 'password' ? 'text' : 'password';
  btn.textContent = el.type === 'password' ? '👁' : '🙈';
}

/* ─── TIEMPO RELATIVO ─── */
function timeAgo(date) {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 3600)    return `hace ${Math.floor(diff / 60)}m`;
  if (diff < 86400)   return `hace ${Math.floor(diff / 3600)}h`;
  if (diff < 604800)  return `hace ${Math.floor(diff / 86400)}d`;
  return new Date(date).toLocaleDateString('es-CO');
}

/* ─── VALIDACIONES ─── */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}