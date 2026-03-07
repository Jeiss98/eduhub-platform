/* ═══════════════════════════════════════════
   EduHub — login.js
   Lógica de autenticación (login y registro)
═══════════════════════════════════════════ */

'use strict';

/* Si ya tiene sesión, ir al dashboard */
document.addEventListener('DOMContentLoaded', () => {
  if (getToken() && getUsuario()) {
    window.location.href = 'dashboard.html';
  }
});

/* ─── TABS ─── */
let _roleSelected = 'estudiante';

function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach((b, i) =>
    b.classList.toggle('active', (tab === 'login' && i === 0) || (tab === 'reg' && i === 1))
  );
  document.querySelectorAll('.form-panel').forEach((p, i) =>
    p.classList.toggle('active', (tab === 'login' && i === 0) || (tab === 'reg' && i === 1))
  );
}

function pickRole(el, rol) {
  document.querySelectorAll('.rp-opt').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  _roleSelected = rol;
}

/* ─── LOGIN ─── */
async function doLogin() {
  const email = document.getElementById('l-email').value.trim();
  const pass  = document.getElementById('l-pass').value;
  const btn   = document.getElementById('btn-login');

  let bad = false;
  if (!isValidEmail(email)) { showFerr('e-l-email', true); markErr('l-email', true); bad = true; }
  else                      { showFerr('e-l-email', false); markErr('l-email', false); }
  if (!pass)                { showFerr('e-l-pass', true); markErr('l-pass', true); bad = true; }
  else                      { showFerr('e-l-pass', false); markErr('l-pass', false); }
  if (bad) return;

  hideMsg('msg-login');
  setLoading(btn, true);

  try {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password: pass }),
    });
    saveSession(data.token, data.usuario);
    window.location.href = 'dashboard.html';
  } catch (err) {
    /* Si el backend no está disponible, modo demo */
    if (err.message.toLowerCase().includes('fetch') || err.message.toLowerCase().includes('failed')) {
      const demoUser = { id: 1, nombre: email.split('@')[0], email, rol: 'estudiante' };
      saveSession('demo-token', demoUser);
      toast('Modo demo activo — backend no disponible', 'err');
      setTimeout(() => window.location.href = 'dashboard.html', 1200);
    } else {
      showMsg('msg-login', err.message, 'err');
    }
  } finally {
    setLoading(btn, false);
  }
}

/* ─── ACCESO RÁPIDO DEMO ─── */
function quickLogin(rol) {
  const demos = {
    estudiante: { id: 4, nombre: 'Ana López',         email: 'alopez@eduhub.com',  rol: 'estudiante' },
    docente:    { id: 2, nombre: 'Prof. María García', email: 'mgarcia@eduhub.com', rol: 'docente'    },
    admin:      { id: 1, nombre: 'Admin Sistema',      email: 'admin@eduhub.com',   rol: 'admin'      },
  };
  saveSession('demo-token', demos[rol]);
  window.location.href = 'dashboard.html';
}

/* ─── REGISTRO ─── */
async function doRegistro() {
  const nombre = document.getElementById('r-nombre').value.trim();
  const email  = document.getElementById('r-email').value.trim();
  const pass   = document.getElementById('r-pass').value;
  const pass2  = document.getElementById('r-pass2').value;
  const btn    = document.getElementById('btn-reg');

  let bad = false;
  if (!nombre)              { showFerr('e-r-nombre', true);  bad = true; } else showFerr('e-r-nombre', false);
  if (!isValidEmail(email)) { showFerr('e-r-email',  true);  bad = true; } else showFerr('e-r-email',  false);
  if (pass.length < 8)      { showFerr('e-r-pass',   true);  bad = true; } else showFerr('e-r-pass',   false);
  if (pass !== pass2)       { showFerr('e-r-pass2',  true);  bad = true; } else showFerr('e-r-pass2',  false);
  if (bad) return;

  hideMsg('msg-reg');
  setLoading(btn, true);

  try {
    await apiFetch('/auth/registro', {
      method: 'POST',
      body: JSON.stringify({ nombre, email, password: pass, rol: _roleSelected }),
    });
    showMsg('msg-reg', '✓ Cuenta creada. Ahora inicia sesión.', 'ok');
    setTimeout(() => switchTab('login'), 1800);
  } catch (err) {
    if (err.message.toLowerCase().includes('fetch') || err.message.toLowerCase().includes('failed')) {
      showMsg('msg-reg', '✓ Cuenta simulada (modo demo). Iniciando sesión...', 'ok');
      setTimeout(() => switchTab('login'), 1800);
    } else {
      showMsg('msg-reg', err.message, 'err');
    }
  } finally {
    setLoading(btn, false);
  }
}

/* ─── ENTER key en inputs ─── */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('l-pass')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });
  document.getElementById('r-pass2')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') doRegistro();
  });
});