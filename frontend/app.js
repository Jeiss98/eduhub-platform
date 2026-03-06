// app.js — EduHub Frontend Logic
// Conecta con el backend Node.js via fetch()

'use strict';

/* ══════════════════════════════════════════════
   CONFIG
══════════════════════════════════════════════ */
const API = 'http://localhost:3000/api';
let TOKEN    = localStorage.getItem('eduhub_token')    || null;
let USUARIO  = JSON.parse(localStorage.getItem('eduhub_user') || 'null');
let _roleSelected = 'estudiante';
let _toastTimer   = null;

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function toast(msg, tipo = 'ok') {
  const el = $('#toast');
  const dot = el.querySelector('.toast-dot');
  el.querySelector('#toast-msg').textContent = msg;
  dot.style.background = tipo === 'err' ? '#F87171' : '#4ADE80';
  el.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}

function showMsg(id, texto, tipo) {
  const el = $(id);
  if (!el) return;
  el.textContent = texto;
  el.className = `form-msg show ${tipo === 'ok' ? 'msg-ok' : 'msg-err'}`;
}

function hideMsg(id) {
  const el = $(id);
  if (el) el.classList.remove('show');
}

function setLoading(btn, loading) {
  btn.disabled = loading;
  btn.textContent = loading ? 'Cargando...' : btn.dataset.label;
}

// Guardar datos de sesión en localStorage
function saveSession(token, user) {
  TOKEN   = token;
  USUARIO = user;
  localStorage.setItem('eduhub_token', token);
  localStorage.setItem('eduhub_user',  JSON.stringify(user));
}

function clearSession() {
  TOKEN   = null;
  USUARIO = null;
  localStorage.removeItem('eduhub_token');
  localStorage.removeItem('eduhub_user');
}

/* ══════════════════════════════════════════════
   API CALLS
══════════════════════════════════════════════ */
async function apiFetch(endpoint, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (TOKEN) headers['Authorization'] = `Bearer ${TOKEN}`;

  const res = await fetch(`${API}${endpoint}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje || 'Error del servidor');
  return data;
}

/* ── Comprobar si el backend está vivo ── */
async function checkApiStatus() {
  const dot  = $('#api-dot');
  const text = $('#api-text');
  if (!dot) return;

  dot.className = 'api-dot loading';
  text.textContent = 'Conectando...';
  try {
    await fetch(`${API}/health`);
    dot.className = 'api-dot ok';
    text.textContent = 'API conectada';
  } catch {
    dot.className = 'api-dot error';
    text.textContent = 'API offline (modo demo)';
  }
}

/* ══════════════════════════════════════════════
   AUTH — LOGIN / REGISTRO
══════════════════════════════════════════════ */
function switchTab(tab) {
  $$('.tab-btn').forEach((b, i) => b.classList.toggle('active', (tab === 'login' && i === 0) || (tab === 'reg' && i === 1)));
  $$('.form-panel').forEach((p, i) => p.classList.toggle('active', (tab === 'login' && i === 0) || (tab === 'reg' && i === 1)));
}

function togglePw(inputId, btn) {
  const el = document.getElementById(inputId);
  el.type  = el.type === 'password' ? 'text' : 'password';
  btn.textContent = el.type === 'password' ? '👁' : '🙈';
}

function pickRole(el, rol) {
  $$('.rp-opt').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  _roleSelected = rol;
}

function showFerr(id, show) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('show', show);
  return show;
}

function markErr(id, show) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('err', show);
}

async function doLogin() {
  const email = document.getElementById('l-email').value.trim();
  const pass  = document.getElementById('l-pass').value;
  const btn   = document.getElementById('btn-login');

  let bad = false;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showFerr('e-l-email', true); markErr('l-email', true); bad = true; }
  else { showFerr('e-l-email', false); markErr('l-email', false); }
  if (!pass) { showFerr('e-l-pass', true); markErr('l-pass', true); bad = true; }
  else { showFerr('e-l-pass', false); markErr('l-pass', false); }
  if (bad) return;

  hideMsg('#msg-login');
  setLoading(btn, true);

  try {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pass }),
    });
    saveSession(data.token, data.usuario);
    enterDash(data.usuario);
  } catch (err) {
    // Si el backend no está, modo demo
    if (err.message.includes('fetch')) {
      demoLogin(email);
    } else {
      showMsg('#msg-login', err.message, 'err');
    }
  } finally {
    setLoading(btn, false);
  }
}

function demoLogin(email) {
  const demoUser = { id: 1, nombre: email.split('@')[0], email, rol: 'estudiante' };
  saveSession('demo-token', demoUser);
  enterDash(demoUser);
  toast('Modo demo — backend no disponible', 'err');
}

function quickLogin(rol) {
  const demos = {
    estudiante: { id: 4, nombre: 'Ana López',         email: 'alopez@eduhub.com',   rol: 'estudiante' },
    docente:    { id: 2, nombre: 'Prof. María García', email: 'mgarcia@eduhub.com',  rol: 'docente'    },
    admin:      { id: 1, nombre: 'Admin Sistema',      email: 'admin@eduhub.com',    rol: 'admin'      },
  };
  saveSession('demo-token', demos[rol]);
  enterDash(demos[rol]);
}

async function doRegistro() {
  const nombre = document.getElementById('r-nombre').value.trim();
  const email  = document.getElementById('r-email').value.trim();
  const pass   = document.getElementById('r-pass').value;
  const pass2  = document.getElementById('r-pass2').value;
  const btn    = document.getElementById('btn-reg');

  let bad = false;
  if (!nombre)                                        { showFerr('e-r-nombre', true); bad = true; } else showFerr('e-r-nombre', false);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))     { showFerr('e-r-email',  true); bad = true; } else showFerr('e-r-email',  false);
  if (pass.length < 8)                                { showFerr('e-r-pass',   true); bad = true; } else showFerr('e-r-pass',   false);
  if (pass !== pass2)                                 { showFerr('e-r-pass2',  true); bad = true; } else showFerr('e-r-pass2',  false);
  if (bad) return;

  hideMsg('#msg-reg');
  setLoading(btn, true);

  try {
    await apiFetch('/auth/registro', {
      method: 'POST',
      body: JSON.stringify({ nombre, email, password: pass, rol: _roleSelected }),
    });
    showMsg('#msg-reg', '✓ Cuenta creada. Ahora inicia sesión.', 'ok');
    setTimeout(() => switchTab('login'), 1800);
  } catch (err) {
    if (err.message.includes('fetch')) {
      showMsg('#msg-reg', '✓ Cuenta simulada (backend offline). Iniciando...', 'ok');
      setTimeout(() => switchTab('login'), 1800);
    } else {
      showMsg('#msg-reg', err.message, 'err');
    }
  } finally {
    setLoading(btn, false);
  }
}

/* ══════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════ */
function enterDash(user) {
  $('#pg-auth').classList.remove('active');
  $('#pg-dash').classList.add('active');

  const initials = user.nombre.split(' ').map(x => x[0]).join('').toUpperCase().slice(0, 2);
  $('#sb-av').textContent   = initials;
  $('#sb-uname').textContent = user.nombre;
  $('#sb-urole').textContent = user.rol.charAt(0).toUpperCase() + user.rol.slice(1);

  loadSection('inicio');
  checkApiStatus();
  toast(`Bienvenido, ${user.nombre.split(' ')[0]} 👋`);
}

function doLogout() {
  clearSession();
  $('#pg-dash').classList.remove('active');
  $('#pg-auth').classList.add('active');
  hideMsg('#msg-login');
}

/* ── Navegación entre secciones ── */
function loadSection(id, btn) {
  $$('.section').forEach(s => s.classList.remove('active'));
  $$('.nav-btn').forEach(b => b.classList.remove('active'));

  const sec = document.getElementById('sec-' + id);
  if (sec) sec.classList.add('active');
  if (btn) btn.classList.add('active');
  else {
    // Activar el nav-btn correspondiente
    $$('.nav-btn').forEach(b => { if (b.dataset.sec === id) b.classList.add('active'); });
  }

  const titles = { inicio: 'Dashboard', proyectos: 'Mis Proyectos', tareas: 'Mis Tareas', noticias: 'Noticias', perfil: 'Mi Perfil' };
  $('#tb-title').textContent = titles[id] || id;

  // Cargar datos según sección
  if (id === 'noticias')   loadNoticias('all');
  if (id === 'proyectos')  loadProyectos();
  if (id === 'tareas')     loadTareas();
}

/* ══════════════════════════════════════════════
   PROYECTOS — fetch desde API
══════════════════════════════════════════════ */
async function loadProyectos() {
  const container = $('#proyectos-grid');
  if (!container) return;
  container.innerHTML = '<div class="news-loading"><div class="spinner"></div> Cargando proyectos...</div>';

  try {
    const { data } = await apiFetch('/proyectos');
    renderProyectos(data, container);
  } catch {
    renderProyectosDemoData(container);
  }
}

function renderProyectos(proyectos, container) {
  if (!proyectos.length) {
    container.innerHTML = '<p style="color:var(--ink3);font-size:.85rem;text-align:center;padding:2rem">Sin proyectos asignados.</p>';
    return;
  }
  container.innerHTML = proyectos.map(p => {
    const pct   = parseFloat(p.avance_pct) || 0;
    const color = pct === 100 ? 'var(--sage)' : pct > 50 ? 'linear-gradient(90deg,var(--blue),#6366F1)' : 'linear-gradient(90deg,var(--amber),var(--rose))';
    const badge = p.estado === 'activo' ? 'bd-sage' : p.estado === 'pausado' ? 'bd-amber' : 'bd-blue';
    return `
      <div class="proj-card">
        <div class="pc-top">
          <div>
            <div class="pc-name">${p.titulo}</div>
            <div class="pc-meta">${p.docente} · ${p.fecha_limite}</div>
          </div>
          <span class="bd ${badge}">${p.estado}</span>
        </div>
        <div class="prog-track" style="margin:.55rem 0 .3rem">
          <div class="prog-bar" style="width:${pct}%;background:${color}"></div>
        </div>
        <div class="pc-stats">
          <div class="pc-stat">Avance <strong>${pct}%</strong></div>
          <div class="pc-stat">Estudiantes <strong>${p.total_estudiantes || '-'}</strong></div>
        </div>
      </div>`;
  }).join('');
}

function renderProyectosDemoData(container) {
  const demo = [
    { titulo:'Análisis de Algoritmos', docente:'Prof. María García', fecha_limite:'2026-03-15', estado:'activo', avance_pct:68, total_estudiantes:2 },
    { titulo:'Diseño BD Relacional',   docente:'Prof. María García', fecha_limite:'2026-04-01', estado:'activo', avance_pct:45, total_estudiantes:3 },
    { titulo:'App Móvil React Native', docente:'Prof. Carlos Ruiz',  fecha_limite:'2026-04-20', estado:'pausado', avance_pct:20, total_estudiantes:4 },
    { titulo:'API REST con Node.js',   docente:'Prof. Carlos Ruiz',  fecha_limite:'2026-02-10', estado:'finalizado', avance_pct:100, total_estudiantes:2 },
  ];
  renderProyectos(demo, container);
}

/* ══════════════════════════════════════════════
   TAREAS — fetch desde API
══════════════════════════════════════════════ */
async function loadTareas() {
  const container = $('#tareas-list');
  if (!container) return;
  container.innerHTML = '<div class="news-loading"><div class="spinner"></div> Cargando tareas...</div>';

  try {
    const { data } = await apiFetch('/tareas');
    renderTareas(data, container);
  } catch {
    renderTareasDemoData(container);
  }
}

function renderTareas(tareas, container) {
  if (!tareas.length) {
    container.innerHTML = '<p style="color:var(--ink3);padding:1rem;font-size:.85rem">Sin tareas asignadas.</p>';
    return;
  }
  const prioColor = { alta:'bd-rose', media:'bd-amber', baja:'bd-teal' };
  container.innerHTML = tareas.map(t => `
    <div class="t-item" id="tarea-${t.id}">
      <div class="t-ck ${t.completada ? 'done' : ''}" onclick="toggleTarea(this,'${t.id}')">${t.completada ? '✓' : ''}</div>
      <div style="flex:1">
        <div class="t-name ${t.completada ? 'done' : ''}">${t.titulo}</div>
        <div class="t-sub">${t.proyecto} · ${t.fecha_limite}</div>
      </div>
      <span class="bd ${prioColor[t.prioridad] || 'bd-blue'}" style="margin-right:6px">${t.prioridad}</span>
    </div>`).join('');
}

function renderTareasDemoData(container) {
  const demo = [
    { id:1, titulo:'Análisis Big-O', completada:false, proyecto:'Algoritmos', fecha_limite:'2026-03-05', prioridad:'alta' },
    { id:2, titulo:'QuickSort en Java', completada:false, proyecto:'Algoritmos', fecha_limite:'2026-03-08', prioridad:'alta' },
    { id:3, titulo:'Normalización 3FN', completada:false, proyecto:'Diseño BD', fecha_limite:'2026-03-10', prioridad:'media' },
    { id:4, titulo:'Modelado ER', completada:true, proyecto:'Diseño BD', fecha_limite:'2026-02-25', prioridad:'alta' },
    { id:5, titulo:'Endpoints JWT', completada:true, proyecto:'API REST', fecha_limite:'2026-02-08', prioridad:'alta' },
  ];
  renderTareas(demo, container);
}

async function toggleTarea(el, id) {
  const done = el.classList.toggle('done');
  el.textContent = done ? '✓' : '';
  const nameEl = el.nextElementSibling?.querySelector('.t-name');
  if (nameEl) nameEl.classList.toggle('done', done);
  if (done) toast('Tarea completada ✓');

  // Llamar al backend si está disponible
  try {
    if (TOKEN !== 'demo-token') {
      await apiFetch(`/tareas/${id}/completar`, { method: 'PATCH' });
    }
  } catch { /* ya se actualizó la UI */ }
}

/* ══════════════════════════════════════════════
   NOTICIAS — fetch desde MongoDB
══════════════════════════════════════════════ */
const COLORES = [
  'nv-navy', 'nv-teal', 'nv-soft-amber', 'nv-sage nv-wide',
  'nv-violet', 'nv-soft-blue', 'nv-blue nv-wide',
  'nv-ghost', 'nv-rose', 'nv-soft-teal',
];

function tiempoRelativo(fecha) {
  const diff = (Date.now() - new Date(fecha)) / 1000;
  if (diff < 3600)    return `hace ${Math.floor(diff/60)}m`;
  if (diff < 86400)   return `hace ${Math.floor(diff/3600)}h`;
  if (diff < 604800)  return `hace ${Math.floor(diff/86400)}d`;
  return new Date(fecha).toLocaleDateString('es-CO');
}

async function loadNoticias(cat = 'all') {
  const grid = $('#news-grid');
  if (!grid) return;
  grid.innerHTML = '<div class="news-loading"><div class="spinner"></div> Cargando noticias...</div>';

  try {
    const url    = cat === 'all' ? '/noticias' : `/noticias?categoria=${cat}`;
    const { data } = await apiFetch(url);
    renderNoticias(data, grid);
  } catch {
    renderNoticiasDemoData(grid, cat);
  }
}

function renderNoticias(noticias, grid) {
  if (!noticias.length) {
    grid.innerHTML = '<div class="news-loading">Sin noticias en esta categoría.</div>';
    return;
  }
  grid.innerHTML = noticias.map((n, i) => {
    const cls    = COLORES[i % COLORES.length];
    const tiempo = tiempoRelativo(n.createdAt);
    return `
      <div class="nc ${cls}" onclick="verNoticia('${n._id}')">
        <div class="nc-splash">${n.emoji || '📌'}</div>
        <div class="nc-body">
          <div class="nc-cat">${n.categoria}</div>
          <div class="nc-title">${n.titulo}</div>
          <div class="nc-footer">
            ${tiempo}<span class="nc-dot"></span>${n.autor?.nombre || ''}<span class="nc-dot"></span>${n.vistas} vistas
          </div>
        </div>
      </div>`;
  }).join('');
}

const DEMO_NOTICIAS = [
  { _id:'1', titulo:'Semana de Proyectos Finales — Mayo 2026',              categoria:'academico', emoji:'📅', createdAt: new Date(Date.now()-7200000),  vistas:234, autor:{nombre:'Prof. García'} },
  { _id:'2', titulo:'Taller gratuito de Docker para estudiantes',           categoria:'taller',    emoji:'🐳', createdAt: new Date(Date.now()-18000000), vistas:189, autor:{nombre:'Admin'} },
  { _id:'3', titulo:'Estudiantes ganan Hackathon Nacional 2026',            categoria:'logro',     emoji:'🏆', createdAt: new Date(Date.now()-259200000),vistas:891, autor:{nombre:'Admin'} },
  { _id:'4', titulo:'Nuevo laboratorio de IA disponible',                   categoria:'infra',     emoji:'🤖', createdAt: new Date(Date.now()-86400000), vistas:412, autor:{nombre:'Admin'} },
  { _id:'5', titulo:'Convocatoria semilleros de investigación 2026',        categoria:'academico', emoji:'📚', createdAt: new Date(Date.now()-172800000),vistas:321, autor:{nombre:'García'} },
  { _id:'6', titulo:'Bootcamp intensivo de Python y Data Science',          categoria:'taller',    emoji:'🐍', createdAt: new Date(Date.now()-172800000),vistas:567, autor:{nombre:'Ruiz'} },
  { _id:'7', titulo:'Migración completa a servidores cloud',                categoria:'infra',     emoji:'☁️', createdAt: new Date(Date.now()-345600000),vistas:298, autor:{nombre:'Admin'} },
  { _id:'8', titulo:'Premio Mejor Proyecto del Semestre — nominaciones',    categoria:'logro',     emoji:'🎓', createdAt: new Date(Date.now()-432000000),vistas:445, autor:{nombre:'Admin'} },
  { _id:'9', titulo:'Actualización del calendario — semana de receso',      categoria:'academico', emoji:'📝', createdAt: new Date(Date.now()-518400000),vistas:673, autor:{nombre:'Admin'} },
];

function renderNoticiasDemoData(grid, cat) {
  const filtradas = cat === 'all' ? DEMO_NOTICIAS : DEMO_NOTICIAS.filter(n => n.categoria === cat);
  renderNoticias(filtradas, grid);
}

function filterNoticias(btn, cat) {
  $$('.nf-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  loadNoticias(cat);
}

function verNoticia(id) {
  toast(`Noticia #${id} — detalle próximamente`);
}

/* ══════════════════════════════════════════════
   PERFIL
══════════════════════════════════════════════ */
function guardarPerfil() {
  toast('Perfil actualizado ✓');
}

function cambiarPassword() {
  const nueva = document.getElementById('pf-nueva')?.value || '';
  const conf  = document.getElementById('pf-conf')?.value  || '';
  if (!nueva || nueva.length < 8) { toast('La contraseña debe tener mínimo 8 caracteres', 'err'); return; }
  if (nueva !== conf) { toast('Las contraseñas no coinciden', 'err'); return; }
  toast('Contraseña actualizada ✓');
}

/* ══════════════════════════════════════════════
   INIT — al cargar la página
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Si ya había sesión, entrar directo
  if (TOKEN && USUARIO) {
    enterDash(USUARIO);
  }

  // Guardar labels en botones para el loading state
  $$('[data-label]').forEach(btn => {
    if (!btn.dataset.label) btn.dataset.label = btn.textContent;
  });

  checkApiStatus();
});
