/* ═══════════════════════════════════════════
   EduHub — dashboard.js
   Lógica del panel principal
═══════════════════════════════════════════ */

'use strict';

/* ─── DATOS DEMO ─── */
const DEMO_PROYECTOS = [
  { id:1, titulo:'Análisis de Algoritmos',   docente:'Prof. María García', fecha_limite:'2026-03-15', estado:'activo',    avance_pct:68,  total_estudiantes:4 },
  { id:2, titulo:'Diseño BD Relacional',     docente:'Prof. María García', fecha_limite:'2026-04-01', estado:'activo',    avance_pct:45,  total_estudiantes:3 },
  { id:3, titulo:'App Móvil React Native',   docente:'Prof. Carlos Ruiz',  fecha_limite:'2026-04-20', estado:'pausado',   avance_pct:20,  total_estudiantes:5 },
  { id:4, titulo:'API REST con Node.js',     docente:'Prof. Carlos Ruiz',  fecha_limite:'2026-02-10', estado:'finalizado',avance_pct:100, total_estudiantes:2 },
];
const DEMO_TAREAS = [
  { id:1, titulo:'Análisis Big-O',       completada:false, proyecto:'Algoritmos', fecha_limite:'2026-03-05', prioridad:'alta'  },
  { id:2, titulo:'QuickSort en Java',    completada:false, proyecto:'Algoritmos', fecha_limite:'2026-03-08', prioridad:'alta'  },
  { id:3, titulo:'Normalización 3FN',    completada:false, proyecto:'Diseño BD',  fecha_limite:'2026-03-10', prioridad:'media' },
  { id:4, titulo:'Modelado ER',          completada:true,  proyecto:'Diseño BD',  fecha_limite:'2026-02-25', prioridad:'alta'  },
  { id:5, titulo:'Endpoints JWT',        completada:true,  proyecto:'API REST',   fecha_limite:'2026-02-08', prioridad:'alta'  },
];
const DEMO_NOTICIAS = [
  { _id:'1', titulo:'Semana de Proyectos Finales — Mayo 2026',              categoria:'academico', emoji:'📅', createdAt: new Date(Date.now()-7200000),   vistas:234, autor:{nombre:'Prof. García'} },
  { _id:'2', titulo:'Taller gratuito de Docker para estudiantes',           categoria:'taller',    emoji:'🐳', createdAt: new Date(Date.now()-18000000),  vistas:189, autor:{nombre:'Admin'}        },
  { _id:'3', titulo:'Estudiantes de Ingeniería ganan Hackathon Nacional',   categoria:'logro',     emoji:'🏆', createdAt: new Date(Date.now()-259200000), vistas:891, autor:{nombre:'Admin'}        },
  { _id:'4', titulo:'Nuevo laboratorio de IA disponible para proyectos',    categoria:'infra',     emoji:'🤖', createdAt: new Date(Date.now()-86400000),  vistas:412, autor:{nombre:'Admin'}        },
  { _id:'5', titulo:'Convocatoria semilleros de investigación 2026',        categoria:'academico', emoji:'📚', createdAt: new Date(Date.now()-172800000), vistas:321, autor:{nombre:'García'}       },
  { _id:'6', titulo:'Bootcamp intensivo de Python y Data Science',          categoria:'taller',    emoji:'🐍', createdAt: new Date(Date.now()-172800000), vistas:567, autor:{nombre:'Ruiz'}         },
  { _id:'7', titulo:'Migración completa a servidores cloud',                categoria:'infra',     emoji:'☁️', createdAt: new Date(Date.now()-345600000), vistas:298, autor:{nombre:'Admin'}        },
  { _id:'8', titulo:'Premio Mejor Proyecto del Semestre — nominaciones',    categoria:'logro',     emoji:'🎓', createdAt: new Date(Date.now()-432000000), vistas:445, autor:{nombre:'Admin'}        },
  { _id:'9', titulo:'Actualización del calendario académico 2026',          categoria:'academico', emoji:'📝', createdAt: new Date(Date.now()-518400000), vistas:673, autor:{nombre:'Admin'}        },
];

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', () => {
  /* Verificar sesión */
  const token   = getToken();
  const usuario = getUsuario();
  if (!token || !usuario) {
    window.location.href = 'login.html';
    return;
  }

  /* Poblar datos de usuario en la UI */
  const initials = usuario.nombre.split(' ').map(x => x[0]).join('').toUpperCase().slice(0, 2);
  document.getElementById('sb-av').textContent    = initials;
  document.getElementById('sb-name').textContent  = usuario.nombre;
  document.getElementById('sb-role').textContent  = usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1);
  document.getElementById('pf-nombre').value      = usuario.nombre.split(' ')[0] || '';
  document.getElementById('pf-email').value       = usuario.email || '';

  checkApiStatus();
  toast(`Bienvenido, ${usuario.nombre.split(' ')[0]} 👋`);
});

/* ─── LOGOUT ─── */
function logout() {
  clearSession();
  window.location.href = 'login.html';
}

/* ─── API STATUS ─── */
async function checkApiStatus() {
  const dot  = document.getElementById('api-dot');
  const text = document.getElementById('api-text');
  dot.className = 'api-dot loading';
  text.textContent = 'Conectando...';
  try {
    await fetch(`${API}/health`);
    dot.className = 'api-dot ok';
    text.textContent = 'API conectada';
  } catch {
    dot.className = 'api-dot error';
    text.textContent = 'API offline (demo)';
  }
}

/* ─── NAVEGACIÓN ENTRE SECCIONES ─── */
const TITLES = {
  inicio:    'Dashboard',
  proyectos: 'Mis Proyectos',
  tareas:    'Mis Tareas',
  noticias:  'Noticias',
  perfil:    'Mi Perfil',
};

function goTo(id, btn) {
  /* Ocultar todas las secciones */
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  /* Desactivar todos los nav items */
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));

  /* Mostrar sección seleccionada */
  const sec = document.getElementById('sec-' + id);
  if (sec) sec.classList.add('active');

  /* Activar nav item */
  if (btn) {
    btn.classList.add('active');
  } else {
    document.querySelectorAll('.nav-item').forEach(b => {
      if (b.dataset.sec === id) b.classList.add('active');
    });
  }

  /* Actualizar título */
  document.getElementById('tb-title').textContent = TITLES[id] || id;

  /* Cargar datos de la sección */
  if (id === 'proyectos') loadProyectos();
  if (id === 'tareas')    loadTareas();
  if (id === 'noticias')  loadNoticias('all');
}

/* ─── TAREAS (INICIO) — toggle simple ─── */
function checkTask(el) {
  const done = el.classList.toggle('done');
  el.textContent = done ? '✓' : '';
  const name = el.nextElementSibling?.querySelector('.task-name');
  if (name) name.classList.toggle('done', done);
  if (done) toast('Tarea completada ✓');
}

/* ─── PROYECTOS ─── */
async function loadProyectos() {
  const grid = document.getElementById('proyectos-grid');
  grid.innerHTML = '<div class="loading-row"><div class="spinner"></div> Cargando proyectos...</div>';
  try {
    const { data } = await apiFetch('/proyectos');
    renderProyectos(data, grid);
  } catch {
    renderProyectos(DEMO_PROYECTOS, grid);
  }
}

const BADGE_ESTADO = { activo:'badge-green', pausado:'badge-amber', finalizado:'badge-blue' };

function renderProyectos(list, grid) {
  if (!list.length) {
    grid.innerHTML = '<p style="color:var(--muted);padding:2rem">Sin proyectos asignados.</p>';
    return;
  }
  grid.innerHTML = list.map(p => {
    const pct  = parseFloat(p.avance_pct) || 0;
    const grad = pct === 100
      ? '#16A34A'
      : pct > 50
        ? 'linear-gradient(90deg,#2563EB,#7C3AED)'
        : 'linear-gradient(90deg,#D97706,#E11D48)';
    const badge = BADGE_ESTADO[p.estado] || 'badge-blue';
    return `
      <div class="proj-card">
        <div class="proj-top">
          <div>
            <div class="proj-name">${p.titulo}</div>
            <div class="proj-meta">${p.docente} · ${p.fecha_limite}</div>
          </div>
          <span class="badge ${badge}">${p.estado}</span>
        </div>
        <div class="prog-item">
          <div class="prog-meta"><span>Progreso</span><span style="font-weight:700">${pct}%</span></div>
          <div class="prog-track"><div class="prog-fill" style="width:${pct}%;background:${grad}"></div></div>
        </div>
        <div class="proj-stats">
          <div class="proj-stat"><div class="proj-stat-val">${p.total_estudiantes || '-'}</div><div class="proj-stat-lbl">Estudiantes</div></div>
          <div class="proj-stat"><div class="proj-stat-val" style="color:#86EFAC">${pct}%</div><div class="proj-stat-lbl">Avance</div></div>
          <div class="proj-stat"><div class="proj-stat-val" style="color:${p.estado==='finalizado'?'#86EFAC':'#FCD34D'}">${p.estado==='finalizado'?'✓':'⟳'}</div><div class="proj-stat-lbl">Estado</div></div>
        </div>
      </div>`;
  }).join('');
}

/* ─── TAREAS (SECCIÓN COMPLETA) ─── */
async function loadTareas() {
  const body  = document.getElementById('tareas-body');
  const count = document.getElementById('tareas-count');
  body.innerHTML = '<tr><td colspan="5"><div class="loading-row"><div class="spinner"></div> Cargando tareas...</div></td></tr>';
  try {
    const { data } = await apiFetch('/tareas');
    renderTareas(data, body, count);
  } catch {
    renderTareas(DEMO_TAREAS, body, count);
  }
}

const PRIO_BADGE = { alta:'badge-rose', media:'badge-amber', baja:'badge-blue' };

function renderTareas(list, body, count) {
  if (!list.length) {
    body.innerHTML = '<tr><td colspan="5" style="color:var(--muted);padding:1rem">Sin tareas asignadas.</td></tr>';
    return;
  }
  const pendientes = list.filter(t => !t.completada).length;
  count.textContent = pendientes + ' pendientes';
  body.innerHTML = list.map(t => `
    <tr id="trow-${t.id}">
      <td><button class="task-row-check ${t.completada ? 'done' : ''}" onclick="toggleTarea(this,'${t.id}')">${t.completada ? '✓' : ''}</button></td>
      <td><div style="font-weight:500;${t.completada ? 'text-decoration:line-through;color:var(--muted)' : ''}">${t.titulo}</div></td>
      <td style="color:var(--muted2)">${t.proyecto || '-'}</td>
      <td><span class="badge ${PRIO_BADGE[t.prioridad] || 'badge-blue'}">${t.prioridad}</span></td>
      <td style="color:var(--muted2);font-size:.78rem;font-family:monospace">${t.fecha_limite || '-'}</td>
    </tr>`).join('');
}

async function toggleTarea(btn, id) {
  const done = btn.classList.toggle('done');
  btn.textContent = done ? '✓' : '';
  const row  = document.getElementById('trow-' + id);
  if (row) {
    const name = row.querySelector('td:nth-child(2) div');
    if (name) { name.style.textDecoration = done ? 'line-through' : 'none'; name.style.color = done ? 'var(--muted)' : ''; }
  }
  if (done) toast('Tarea completada ✓');
  try {
    if (getToken() !== 'demo-token') {
      await apiFetch(`/tareas/${id}/completar`, { method: 'PATCH' });
    }
  } catch { /* actualización local ya hecha */ }
}

/* ─── NOTICIAS ─── */
const NEWS_COLORS = ['nc-navy','nc-teal','nc-violet wide','nc-sage','nc-amber','nc-blue','nc-rose wide','nc-gray','nc-navy'];

async function loadNoticias(cat) {
  const grid = document.getElementById('news-grid');
  grid.innerHTML = '<div class="loading-row"><div class="spinner"></div> Cargando noticias...</div>';
  try {
    const url        = cat === 'all' ? '/noticias' : `/noticias?categoria=${cat}`;
    const { data }   = await apiFetch(url);
    renderNoticias(data, grid);
  } catch {
    const filtradas = cat === 'all' ? DEMO_NOTICIAS : DEMO_NOTICIAS.filter(n => n.categoria === cat);
    renderNoticias(filtradas, grid);
  }
}

function renderNoticias(list, grid) {
  if (!list.length) {
    grid.innerHTML = '<div class="loading-row">Sin noticias en esta categoría.</div>';
    return;
  }
  grid.innerHTML = list.map((n, i) => {
    const cls  = NEWS_COLORS[i % NEWS_COLORS.length];
    const wide = cls.includes('wide') ? ' wide' : '';
    const c    = cls.replace(' wide', '');
    return `
      <div class="news-card ${c}${wide}" style="animation-delay:${i * 0.05}s">
        <div class="news-emoji">${n.emoji || '📌'}</div>
        <div class="news-body">
          <div class="news-cat">${n.categoria}</div>
          <div class="news-title">${n.titulo}</div>
          <div class="news-foot">${timeAgo(n.createdAt)} · ${n.vistas} vistas</div>
        </div>
      </div>`;
  }).join('');
}

function filterNews(btn, cat) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  loadNoticias(cat);
}

/* ─── PERFIL ─── */
function savePerfil() {
  toast('Perfil actualizado ✓');
}
function savePass() {
  const nueva = document.getElementById('pf-nueva')?.value || '';
  const conf  = document.getElementById('pf-conf')?.value  || '';
  if (nueva.length < 8) { toast('Mínimo 8 caracteres', 'err'); return; }
  if (nueva !== conf)   { toast('Las contraseñas no coinciden', 'err'); return; }
  toast('Contraseña actualizada ✓');
}