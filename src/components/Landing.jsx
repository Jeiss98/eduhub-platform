import { useState } from "react";

const S = {
  page: { background: "#09090B", color: "#FAFAFA", fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh" },

  // NAV
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2.5rem", borderBottom: "1px solid #27272A", position: "sticky", top: 0, background: "rgba(9,9,11,0.85)", backdropFilter: "blur(12px)", zIndex: 100 },
  navLogo: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
  navLogoMark: { width: 32, height: 32, background: "linear-gradient(135deg,#2563EB,#14B8A6)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#fff" },
  navLinks: { display: "flex", gap: "2rem" },
  navLink: { background: "none", border: "none", color: "#71717A", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500, padding: 0, transition: "color 0.15s" },
  navBtnOutline: { background: "none", border: "1px solid #3F3F46", color: "#FAFAFA", borderRadius: 8, padding: "0.45rem 1rem", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500 },
  navBtnSolid: { background: "#2563EB", border: "none", color: "#fff", borderRadius: 8, padding: "0.45rem 1.1rem", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 },

  // HERO
  hero: { textAlign: "center", padding: "5rem 2rem 4rem", maxWidth: 700, margin: "0 auto" },
  heroTag: { display: "inline-flex", alignItems: "center", gap: 8, background: "#18181B", border: "1px solid #3F3F46", borderRadius: 100, padding: "0.35rem 0.9rem", fontSize: "0.78rem", color: "#A1A1AA", marginBottom: "1.5rem" },
  heroTagDot: { width: 6, height: 6, borderRadius: "50%", background: "#14B8A6" },
  heroH1: { fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.03em", margin: "0 0 1.25rem" },
  heroEm: { fontStyle: "italic", color: "#2563EB" },
  heroP: { color: "#71717A", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "2rem" },
  heroBtns: { display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" },
  heroBtnPrimary: { background: "#2563EB", border: "none", color: "#fff", borderRadius: 10, padding: "0.75rem 1.75rem", cursor: "pointer", fontSize: "0.95rem", fontWeight: 600 },
  heroBtnGhost: { background: "transparent", border: "1px solid #3F3F46", color: "#FAFAFA", borderRadius: 10, padding: "0.75rem 1.75rem", cursor: "pointer", fontSize: "0.95rem", fontWeight: 500 },

  // STATS BAND
  statsBand: { borderTop: "1px solid #27272A", borderBottom: "1px solid #27272A", display: "flex", justifyContent: "center", gap: "3rem", padding: "1.5rem 2rem", flexWrap: "wrap", background: "#111113" },
  statItem: { textAlign: "center" },
  statNum: { fontSize: "1.6rem", fontWeight: 800, color: "#FAFAFA" },
  statLbl: { fontSize: "0.75rem", color: "#52525B", marginTop: 2 },

  // SECTION
  section: { maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" },
  sectionEyebrow: { fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#2563EB", marginBottom: "0.5rem" },
  sectionTitle: { fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.2, marginBottom: "0.75rem" },
  sectionSub: { color: "#52525B", fontSize: "1rem", lineHeight: 1.6, marginBottom: "2.5rem" },

  // FEATURES GRID
  featGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.25rem" },
  featItem: { background: "#111113", border: "1px solid #27272A", borderRadius: 12, padding: "1.5rem" },
  featNum: { fontSize: "0.7rem", fontWeight: 800, color: "#2563EB", letterSpacing: "0.1em", marginBottom: "0.5rem" },
  featTitle: { fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.5rem" },
  featDesc: { fontSize: "0.82rem", color: "#52525B", lineHeight: 1.6 },

  // ROLES GRID
  rolesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1rem" },
  roleCard: { background: "#111113", border: "1px solid #27272A", borderRadius: 12, padding: "1.5rem" },
  roleEmoji: { fontSize: "2rem", marginBottom: "0.75rem" },
  roleName: { fontWeight: 700, fontSize: "1rem", marginBottom: "0.35rem" },
  roleDesc: { fontSize: "0.82rem", color: "#52525B", lineHeight: 1.5, marginBottom: "0.75rem" },
  roleTags: { display: "flex", flexWrap: "wrap", gap: "0.35rem" },
  roleTag: { background: "#18181B", border: "1px solid #3F3F46", borderRadius: 100, padding: "0.2rem 0.6rem", fontSize: "0.7rem", color: "#A1A1AA" },

  // CONTACT
  contactGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1rem" },
  contactCard: { background: "#111113", border: "1px solid #27272A", borderRadius: 12, padding: "1.5rem", textAlign: "center" },
  contactIcon: { fontSize: "1.75rem", marginBottom: "0.5rem" },
  contactTitle: { fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.35rem" },
  contactDesc: { fontSize: "0.8rem", color: "#52525B", lineHeight: 1.5 },

  // CTA
  cta: { background: "#111113", borderTop: "1px solid #27272A", borderBottom: "1px solid #27272A", textAlign: "center", padding: "4rem 2rem" },
  ctaH2: { fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.75rem" },
  ctaP: { color: "#52525B", marginBottom: "1.5rem" },
  ctaBtn: { background: "#2563EB", border: "none", color: "#fff", borderRadius: 10, padding: "0.8rem 2rem", cursor: "pointer", fontSize: "1rem", fontWeight: 600 },

  // FOOTER
  footer: { borderTop: "1px solid #27272A", padding: "1.5rem 2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", background: "#09090B" },
  footerLogoMark: { width: 26, height: 26, background: "linear-gradient(135deg,#2563EB,#14B8A6)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: "#fff" },
  footerText: { fontSize: "0.78rem", color: "#52525B" },
};

const features = [
  { num: "01", title: "Gestión de proyectos", desc: "Crea, asigna y monitorea proyectos académicos con barras de progreso en tiempo real." },
  { num: "02", title: "Control de tareas", desc: "Asigna tareas con prioridades (alta, media, baja), fechas límite y completado con un clic." },
  { num: "03", title: "Evaluaciones", desc: "Registra calificaciones con comentarios y consulta historial por proyecto y docente." },
  { num: "04", title: "Portal de noticias", desc: "Publica noticias institucionales categorizadas con filtros dinámicos y conteo de vistas." },
  { num: "05", title: "Autenticación por roles", desc: "Login seguro. Estudiante, docente y admin acceden solo a lo que les corresponde." },
  { num: "06", title: "Reportes y estadísticas", desc: "Dashboard con métricas de avance, tareas por vencer y promedios automáticos." },
];

const roles = [
  { emoji: "👨‍🎓", name: "Estudiante", desc: "Accede a sus proyectos asignados, gestiona sus tareas y consulta sus evaluaciones.", tags: ["Ver proyectos", "Gestionar tareas", "Ver evaluaciones", "Leer noticias"] },
  { emoji: "👩‍🏫", name: "Docente", desc: "Crea y gestiona proyectos, asigna estudiantes, registra evaluaciones y publica noticias.", tags: ["Crear proyectos", "Asignar tareas", "Calificar", "Ver reportes", "Publicar noticias"] },
  { emoji: "🛡️", name: "Administrador", desc: "Control total del sistema: gestión de usuarios, configuración y administración completa.", tags: ["Gestión usuarios", "Control total", "Estadísticas globales"] },
];

export default function Landing({ onLogin }) {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={S.page}>
      {/* NAV */}
      <nav style={S.nav}>
        <div style={S.navLogo}>
          <div style={S.navLogoMark}>E</div>
          <span style={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.02em" }}>EduHub</span>
        </div>
        <div style={S.navLinks}>
          <button style={S.navLink} onClick={() => scrollTo("funcionalidades")} title="Ver funcionalidades">Funcionalidades</button>
          <button style={S.navLink} onClick={() => scrollTo("roles")} title="Ver roles de usuario">Roles</button>
          <button style={S.navLink} onClick={() => scrollTo("preview")} title="Vista previa del sistema">Vista previa</button>
          <button style={S.navLink} onClick={() => scrollTo("contacto")} title="Información de contacto">Contacto</button>
          <button style={S.navLink} onClick={onLogin} title="Iniciar sesión en la plataforma">Iniciar sesión</button>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button style={S.navBtnOutline} onClick={onLogin} title="Iniciar sesión">Iniciar sesión</button>
          <button style={S.navBtnSolid} onClick={onLogin} title="Comenzar ahora">Comenzar →</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={S.hero}>
        <div style={S.heroTag}>
          <span style={S.heroTagDot}></span>
          Fundación Universitaria Konrad Lorenz · Bases de Datos II · 2026
        </div>
        <h1 style={S.heroH1}>
          La plataforma académica<br />que tu universidad <em style={S.heroEm}>necesita</em>
        </h1>
        <p style={S.heroP}>
          EduHub centraliza la gestión de proyectos, tareas, evaluaciones y comunicación
          institucional en un solo lugar. Diseñado para estudiantes, docentes y administradores.
        </p>
        <div style={S.heroBtns}>
          <button style={S.heroBtnPrimary} onClick={onLogin} title="Ingresar a la plataforma EduHub">
            Ingresar a la plataforma →
          </button>
          <button style={S.heroBtnGhost} onClick={() => scrollTo("funcionalidades")} title="Ver cómo funciona EduHub">
            Ver cómo funciona
          </button>
        </div>
      </section>

      {/* PREVIEW MOCKUP */}
      <div id="preview" style={{ padding: "0 2rem 3rem", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ background: "#111113", border: "1px solid #27272A", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ background: "#18181B", borderBottom: "1px solid #27272A", padding: "0.6rem 1rem", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF4444" }}></div>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F59E0B" }}></div>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981" }}></div>
            <div style={{ flex: 1, background: "#27272A", borderRadius: 100, padding: "0.25rem 0.75rem", fontSize: "0.7rem", color: "#52525B", marginLeft: 8 }}>localhost:5173</div>
          </div>
          <div style={{ display: "flex", height: 220 }}>
            <div style={{ width: 140, background: "#0D0D0F", borderRight: "1px solid #1E1E22", padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                <div style={{ width: 22, height: 22, background: "linear-gradient(135deg,#2563EB,#14B8A6)", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff" }}>E</div>
                <span style={{ fontSize: "0.75rem", fontWeight: 800 }}>EduHub</span>
              </div>
              {["◈ Dashboard", "⬡ Proyectos", "◇ Tareas", "◉ Noticias", "◎ Perfil"].map((item, i) => (
                <div key={i} style={{ padding: "0.3rem 0.5rem", borderRadius: 5, background: i === 0 ? "rgba(37,99,235,0.2)" : "transparent", color: i === 0 ? "#60A5FA" : "#52525B", fontSize: "0.65rem", fontWeight: i === 0 ? 700 : 400 }}>{item}</div>
              ))}
            </div>
            <div style={{ flex: 1, padding: "1rem 1.25rem", overflow: "hidden" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 10 }}>Dashboard</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 10 }}>
                {[["2", "Proyectos", "#60A5FA"], ["3", "Pendientes", "#FCD34D"], ["30", "Completadas", "#86EFAC"], ["8.7", "Promedio", "#C4B5FD"]].map(([v, l, c]) => (
                  <div key={l} style={{ background: "#18181B", borderRadius: 6, padding: "0.4rem 0.5rem" }}>
                    <div style={{ fontSize: "1rem", fontWeight: 800, color: c }}>{v}</div>
                    <div style={{ fontSize: "0.6rem", color: "#52525B" }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#18181B", borderRadius: 6, padding: "0.6rem 0.75rem" }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, marginBottom: 6 }}>Avance de proyectos</div>
                {[["Análisis de Algoritmos", 68, "#2563EB"], ["Diseño BD Relacional", 45, "#14B8A6"], ["App Móvil React Native", 20, "#F59E0B"]].map(([n, p, c]) => (
                  <div key={n} style={{ marginBottom: 4 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", color: "#52525B", marginBottom: 2 }}><span>{n}</span><span>{p}%</span></div>
                    <div style={{ height: 4, background: "#27272A", borderRadius: 100 }}><div style={{ height: "100%", width: `${p}%`, background: c, borderRadius: 100 }}></div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={S.statsBand}>
        {[["3", "Roles de usuario"], ["5", "Módulos del sistema"], ["2", "Bases de datos"], ["100%", "Responsive"]].map(([n, l]) => (
          <div key={l} style={S.statItem}><div style={S.statNum}>{n}</div><div style={S.statLbl}>{l}</div></div>
        ))}
      </div>

      {/* FUNCIONALIDADES */}
      <section id="funcionalidades" style={S.section}>
        <p style={S.sectionEyebrow}>Funcionalidades</p>
        <h2 style={S.sectionTitle}>Todo lo que necesita<br />una plataforma académica</h2>
        <p style={S.sectionSub}>Diseñado para reemplazar el flujo disperso de correos y hojas de cálculo.</p>
        <div style={S.featGrid}>
          {features.map(f => (
            <div key={f.num} style={S.featItem}>
              <div style={S.featNum}>{f.num}</div>
              <div style={S.featTitle}>{f.title}</div>
              <p style={S.featDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" style={{ ...S.section, background: "#111113", maxWidth: "100%", borderTop: "1px solid #27272A", borderBottom: "1px solid #27272A" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={S.sectionEyebrow}>Roles de usuario</p>
          <h2 style={S.sectionTitle}>Una plataforma,<br />tres experiencias</h2>
          <p style={S.sectionSub}>Cada rol tiene su conjunto de herramientas y vistas personalizadas.</p>
          <div style={S.rolesGrid}>
            {roles.map(r => (
              <div key={r.name} style={S.roleCard}>
                <div style={S.roleEmoji}>{r.emoji}</div>
                <div style={S.roleName}>{r.name}</div>
                <p style={S.roleDesc}>{r.desc}</p>
                <div style={S.roleTags}>{r.tags.map(t => <span key={t} style={S.roleTag}>{t}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" style={S.section}>
        <p style={S.sectionEyebrow}>Contacto y Soporte</p>
        <h2 style={S.sectionTitle}>¿Necesitas ayuda?</h2>
        <p style={S.sectionSub}>Comunícate con el equipo de EduHub o con los administradores de la universidad.</p>
        <div style={S.contactGrid}>
          {[
            { icon: "📧", title: "Soporte técnico", desc: "soporte@eduhub.konradlorenz.edu.co — Respuesta en menos de 24 horas hábiles." },
            { icon: "🏫", title: "Oficina sistemas", desc: "Edificio A, Piso 3, oficina 312. Atención de lunes a viernes 8 a.m. – 5 p.m." },
            { icon: "📖", title: "Documentación", desc: "Consulta los manuales de usuario para estudiantes, docentes y administradores." },
          ].map(c => (
            <div key={c.title} style={S.contactCard}>
              <div style={S.contactIcon}>{c.icon}</div>
              <div style={S.contactTitle}>{c.title}</div>
              <p style={S.contactDesc}>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={S.cta}>
        <h2 style={S.ctaH2}>¿Listo para empezar?</h2>
        <p style={S.ctaP}>Accede con tu cuenta de estudiante, docente o administrador. O usa el acceso demo rápido.</p>
        <button style={S.ctaBtn} onClick={onLogin} title="Ingresar a EduHub">Ingresar a EduHub →</button>
      </section>

      {/* FOOTER */}
      <footer style={S.footer}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={S.footerLogoMark}>E</div>
          <span style={{ fontWeight: 800, fontSize: "0.9rem" }}>EduHub</span>
        </div>
        <p style={S.footerText}>© 2026 Fundación Universitaria Konrad Lorenz · Bases de Datos II · Diseño de Interfaces</p>
        <p style={S.footerText}>Jeisson · Julian · Gustavo</p>
      </footer>
    </div>
  );
}
