import { useState } from "react";

const DEMO_USERS = {
  estudiante: { nombre: "Ana López",        email: "ana@konrad.edu.co",   rol: "estudiante" },
  docente:    { nombre: "Prof. María García", email: "garcia@konrad.edu.co", rol: "docente"    },
  admin:      { nombre: "Admin Sistema",     email: "admin@konrad.edu.co",  rol: "admin"       },
};

export default function Login({ onLogin, onBack }) {
  const [tab, setTab] = useState("login");
  const [roleSelected, setRoleSelected] = useState("estudiante");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [msg, setMsg] = useState(null);

  // Login fields
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPass, setErrPass]   = useState("");

  // Register fields
  const [rNombre, setRNombre]   = useState("");
  const [rApellido, setRApellido] = useState("");
  const [rEmail, setREmail]     = useState("");
  const [rPass, setRPass]       = useState("");
  const [rPass2, setRPass2]     = useState("");

  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const doLogin = () => {
    let ok = true;
    setErrEmail(""); setErrPass(""); setMsg(null);
    if (!isValidEmail(email)) { setErrEmail("Ingresa un correo electrónico válido"); ok = false; }
    if (!pass)                 { setErrPass("La contraseña es requerida"); ok = false; }
    if (!ok) return;
    // Simulación: cualquier email + pass válidos → estudiante
    const user = { nombre: email.split("@")[0], email, rol: "estudiante" };
    setMsg({ tipo: "ok", texto: "¡Bienvenido! Redirigiendo..." });
    setTimeout(() => onLogin(user), 800);
  };

  const quickLogin = (rol) => {
    const user = DEMO_USERS[rol];
    setMsg({ tipo: "ok", texto: `Acceso demo como ${rol}...` });
    setTimeout(() => onLogin(user), 600);
  };

  const doRegistro = () => {
    if (!rNombre || !isValidEmail(rEmail) || rPass.length < 8 || rPass !== rPass2) {
      setMsg({ tipo: "err", texto: "Completa todos los campos correctamente." });
      return;
    }
    const user = { nombre: `${rNombre} ${rApellido}`.trim(), email: rEmail, rol: roleSelected };
    setMsg({ tipo: "ok", texto: "¡Cuenta creada! Ingresando..." });
    setTimeout(() => onLogin(user), 800);
  };

  // Styles
  const S = {
    wrap: { display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#09090B", color: "#FAFAFA" },
    left: { flex: "0 0 420px", background: "#111113", borderRight: "1px solid #27272A", display: "flex", flexDirection: "column", justifyContent: "center", padding: "3rem 2.5rem" },
    right: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" },
    backBtn: { background: "none", border: "none", color: "#71717A", cursor: "pointer", fontSize: "0.85rem", marginBottom: "2rem", padding: 0, display: "flex", alignItems: "center", gap: 6 },
    logoMark: { width: 36, height: 36, background: "linear-gradient(135deg,#2563EB,#14B8A6)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, color: "#fff" },
    headline: { fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.2, margin: "1.5rem 0 0.75rem" },
    sub: { color: "#52525B", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem" },
    tag: { background: "#18181B", border: "1px solid #3F3F46", borderRadius: 100, padding: "0.2rem 0.65rem", fontSize: "0.7rem", color: "#71717A" },
    card: { background: "#111113", border: "1px solid #27272A", borderRadius: 16, padding: "2rem", width: "100%", maxWidth: 440 },
    tabs: { display: "flex", background: "#18181B", borderRadius: 9, padding: 3, marginBottom: "1.5rem" },
    tabBtn: (active) => ({ flex: 1, padding: "0.55rem", border: "none", borderRadius: 7, cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, background: active ? "#2563EB" : "transparent", color: active ? "#fff" : "#52525B", transition: "all 0.15s" }),
    formTitle: { fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.25rem" },
    formSub: { fontSize: "0.82rem", color: "#52525B", marginBottom: "1.25rem" },
    fld: { marginBottom: "1rem" },
    label: { display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#A1A1AA", marginBottom: "0.35rem" },
    input: { width: "100%", background: "#18181B", border: "1px solid #3F3F46", borderRadius: 8, color: "#FAFAFA", fontSize: "0.88rem", padding: "0.6rem 0.75rem", boxSizing: "border-box", outline: "none" },
    pwWrap: { position: "relative" },
    pwEye: { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: "0.9rem", background: "none", border: "none", color: "#52525B" },
    ferr: { fontSize: "0.72rem", color: "#EF4444", marginTop: "0.2rem" },
    btnSubmit: { width: "100%", background: "#2563EB", border: "none", color: "#fff", borderRadius: 9, padding: "0.7rem", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", marginTop: "0.25rem" },
    divider: { textAlign: "center", margin: "1rem 0", color: "#3F3F46", fontSize: "0.75rem", position: "relative" },
    quickRow: { display: "flex", gap: "0.5rem" },
    quickBtn: { flex: 1, background: "#18181B", border: "1px solid #3F3F46", color: "#A1A1AA", borderRadius: 8, padding: "0.5rem", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 },
    frow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" },
    rolePick: { display: "flex", gap: "0.5rem" },
    rpOpt: (active) => ({ flex: 1, background: active ? "rgba(37,99,235,0.15)" : "#18181B", border: `1px solid ${active ? "#2563EB" : "#3F3F46"}`, borderRadius: 8, padding: "0.5rem", cursor: "pointer", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }),
    rpIcon: { fontSize: "1.2rem" },
    rpLbl: (active) => ({ fontSize: "0.68rem", fontWeight: 600, color: active ? "#60A5FA" : "#52525B" }),
    msgOk: { background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#6EE7B7", borderRadius: 8, padding: "0.5rem 0.75rem", fontSize: "0.8rem", marginBottom: "0.75rem" },
    msgErr: { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#FCA5A5", borderRadius: 8, padding: "0.5rem 0.75rem", fontSize: "0.8rem", marginBottom: "0.75rem" },
  };

  return (
    <div style={S.wrap}>
      {/* PANEL IZQUIERDO */}
      <div style={S.left}>
        <button style={S.backBtn} onClick={onBack} title="Volver a la página de inicio">← Volver al inicio</button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={S.logoMark}>E</div>
          <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>EduHub</span>
        </div>
        <h1 style={S.headline}>Gestión académica<br />sin <span style={{ fontStyle: "italic", color: "#2563EB" }}>fricciones</span></h1>
        <p style={S.sub}>Plataforma centralizada para proyectos, tareas, evaluaciones y noticias institucionales. Fundación Universitaria Konrad Lorenz · 2026.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {["Proyectos", "Tareas", "Evaluaciones", "Noticias", "Reportes"].map(t => (
            <span key={t} style={S.tag}>{t}</span>
          ))}
        </div>
      </div>

      {/* PANEL DERECHO */}
      <div style={S.right}>
        <div style={S.card}>
          {/* TABS */}
          <div style={S.tabs}>
            <button style={S.tabBtn(tab === "login")} onClick={() => setTab("login")} title="Iniciar sesión">Iniciar sesión</button>
            <button style={S.tabBtn(tab === "reg")}   onClick={() => setTab("reg")}   title="Crear cuenta">Registrarse</button>
          </div>

          {msg && <div style={msg.tipo === "ok" ? S.msgOk : S.msgErr}>{msg.texto}</div>}

          {/* ── LOGIN ── */}
          {tab === "login" && (
            <div>
              <div style={S.formTitle}>Bienvenido</div>
              <p style={S.formSub}>Ingresa tus credenciales para continuar</p>

              <div style={S.fld}>
                <label style={S.label}>Correo electrónico</label>
                <input style={S.input} type="email" placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
                {errEmail && <div style={S.ferr}>{errEmail}</div>}
              </div>

              <div style={S.fld}>
                <label style={S.label}>Contraseña</label>
                <div style={S.pwWrap}>
                  <input style={{ ...S.input, paddingRight: "2.5rem" }} type={showPw ? "text" : "password"} placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} autoComplete="current-password" />
                  <button style={S.pwEye} onClick={() => setShowPw(!showPw)} title="Mostrar u ocultar contraseña">{showPw ? "🙈" : "👁"}</button>
                </div>
                {errPass && <div style={S.ferr}>{errPass}</div>}
              </div>

              <button style={S.btnSubmit} onClick={doLogin} title="Validar credenciales e ingresar">Ingresar a EduHub</button>

              <div style={S.divider}>── o acceso rápido (demo) ──</div>

              <div style={S.quickRow}>
                <button style={S.quickBtn} onClick={() => quickLogin("estudiante")} title="Acceso demo como estudiante">👨‍🎓 Estudiante</button>
                <button style={S.quickBtn} onClick={() => quickLogin("docente")}    title="Acceso demo como docente">👩‍🏫 Docente</button>
                <button style={S.quickBtn} onClick={() => quickLogin("admin")}      title="Acceso demo como administrador">🛡 Admin</button>
              </div>
            </div>
          )}

          {/* ── REGISTRO ── */}
          {tab === "reg" && (
            <div>
              <div style={S.formTitle}>Crear cuenta</div>
              <p style={S.formSub}>Completa el formulario para registrarte en EduHub</p>

              <div style={S.frow}>
                <div style={S.fld}>
                  <label style={S.label}>Nombre</label>
                  <input style={S.input} type="text" placeholder="Juan" value={rNombre} onChange={e => setRNombre(e.target.value)} />
                </div>
                <div style={S.fld}>
                  <label style={S.label}>Apellido</label>
                  <input style={S.input} type="text" placeholder="García" value={rApellido} onChange={e => setRApellido(e.target.value)} />
                </div>
              </div>

              <div style={S.fld}>
                <label style={S.label}>Correo electrónico</label>
                <input style={S.input} type="email" placeholder="tu@correo.com" value={rEmail} onChange={e => setREmail(e.target.value)} />
              </div>

              <div style={S.frow}>
                <div style={S.fld}>
                  <label style={S.label}>Contraseña</label>
                  <div style={S.pwWrap}>
                    <input style={{ ...S.input, paddingRight: "2.5rem" }} type={showPw ? "text" : "password"} placeholder="Mín. 8 caracteres" value={rPass} onChange={e => setRPass(e.target.value)} />
                    <button style={S.pwEye} onClick={() => setShowPw(!showPw)}>{showPw ? "🙈" : "👁"}</button>
                  </div>
                </div>
                <div style={S.fld}>
                  <label style={S.label}>Confirmar</label>
                  <div style={S.pwWrap}>
                    <input style={{ ...S.input, paddingRight: "2.5rem" }} type={showPw2 ? "text" : "password"} placeholder="Repite la contraseña" value={rPass2} onChange={e => setRPass2(e.target.value)} />
                    <button style={S.pwEye} onClick={() => setShowPw2(!showPw2)}>{showPw2 ? "🙈" : "👁"}</button>
                  </div>
                </div>
              </div>

              <div style={S.fld}>
                <label style={S.label}>Rol en el sistema</label>
                <div style={S.rolePick}>
                  {[["estudiante", "👨‍🎓", "Estudiante"], ["docente", "👩‍🏫", "Docente"], ["admin", "🛡", "Admin"]].map(([r, icon, lbl]) => (
                    <div key={r} style={S.rpOpt(roleSelected === r)} onClick={() => setRoleSelected(r)} title={`Registrarse como ${lbl}`}>
                      <span style={S.rpIcon}>{icon}</span>
                      <span style={S.rpLbl(roleSelected === r)}>{lbl}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button style={S.btnSubmit} onClick={doRegistro} title="Crear cuenta nueva en EduHub">Crear mi cuenta</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
