import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const proyectos = [
  { id: 1, titulo: "Análisis de Algoritmos", estado: "activo", progreso: 68, tareas: 12, completadas: 8, limite: "2026-03-15", miembros: 4 },
  { id: 2, titulo: "Diseño de BD Relacional", estado: "activo", progreso: 45, tareas: 9, completadas: 4, limite: "2026-04-01", miembros: 3 },
  { id: 3, titulo: "App Móvil React Native", estado: "pausado", progreso: 20, tareas: 18, completadas: 3, limite: "2026-04-20", miembros: 5 },
  { id: 4, titulo: "API REST con Node.js", estado: "finalizado", progreso: 100, tareas: 15, completadas: 15, limite: "2026-02-10", miembros: 2 },
];

const tareas = [
  { id: 1, titulo: "Modelado Entidad-Relación", proyecto: "Diseño de BD Relacional", prioridad: "alta", completada: false, limite: "2026-03-05" },
  { id: 2, titulo: "Implementar login con JWT", proyecto: "API REST con Node.js", prioridad: "alta", completada: true, limite: "2026-02-08" },
  { id: 3, titulo: "Análisis de complejidad O(n)", proyecto: "Análisis de Algoritmos", prioridad: "media", completada: false, limite: "2026-03-10" },
  { id: 4, titulo: "Diseño de pantallas en Figma", proyecto: "App Móvil React Native", prioridad: "media", completada: false, limite: "2026-03-25" },
  { id: 5, titulo: "Conexión MongoDB Atlas", proyecto: "Diseño de BD Relacional", prioridad: "baja", completada: false, limite: "2026-03-18" },
];

const noticias = [
  { id: 1, titulo: "Semana de Proyectos Finales — Fechas confirmadas para Mayo", categoria: "Académico", tiempo: "hace 2h", vistas: 234 },
  { id: 2, titulo: "Taller gratuito de Docker para estudiantes este viernes", categoria: "Taller", tiempo: "hace 5h", vistas: 189 },
  { id: 3, titulo: "Nuevo laboratorio de IA disponible para proyectos de grado", categoria: "Infraestructura", tiempo: "ayer", vistas: 412 },
];

const progresoSemanal = [
  { sem: "S1", tareas: 2 }, { sem: "S2", tareas: 5 }, { sem: "S3", tareas: 3 },
  { sem: "S4", tareas: 7 }, { sem: "S5", tareas: 4 }, { sem: "S6", tareas: 8 },
];

const pieData = [
  { name: "Completadas", value: 30 }, { name: "En progreso", value: 15 }, { name: "Pendientes", value: 9 },
];
const PIE_COLORS = ["#10b981", "#3b82f6", "#475569"];

const TABS = ["Dashboard", "Proyectos", "Tareas", "Noticias"];
const ICONS = { Dashboard: "◈", Proyectos: "⬡", Tareas: "◇", Noticias: "◉" };

const estadoColor = { activo: "#10b981", pausado: "#f59e0b", finalizado: "#3b82f6" };
const prioridadColor = { alta: "#ef4444", media: "#f59e0b", baja: "#64748b" };

export default function App() {
  const [tab, setTab] = useState("Dashboard");
  const [tareasList, setTareasList] = useState(tareas);

  const toggleTarea = (id) => {
    setTareasList(prev => prev.map(t => t.id === id ? { ...t, completada: !t.completada } : t));
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#0a0e1a", color: "#e2e8f0", overflow: "hidden" }}>
      
      {/* SIDEBAR */}
      <aside style={{ width: 220, background: "#0f1729", borderRight: "1px solid #1e293b", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: "1.5rem 1.25rem 1rem", borderBottom: "1px solid #1e293b" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #3b82f6, #10b981)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "white" }}>E</div>
            <span style={{ fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.02em" }}>EduHub</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "0.75rem 0.75rem", flex: 1 }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#475569", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0 0.5rem", marginBottom: "0.5rem" }}>Menú</p>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "0.6rem 0.75rem",
              borderRadius: 8, border: "none", cursor: "pointer", textAlign: "left", fontSize: "0.875rem", fontWeight: 500,
              background: tab === t ? "rgba(59,130,246,0.15)" : "transparent",
              color: tab === t ? "#93c5fd" : "#64748b",
              transition: "all 0.15s",
              marginBottom: 2,
            }}>
              <span style={{ fontSize: "0.9rem" }}>{ICONS[t]}</span>
              {t}
            </button>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid #1e293b", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, color: "white", flexShrink: 0 }}>ES</div>
          <div>
            <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 600, color: "#e2e8f0" }}>Estudiante</p>
            <p style={{ margin: 0, fontSize: "0.7rem", color: "#475569" }}>Rol: Alumno</p>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, overflow: "auto", background: "#0a0e1a" }}>
        {/* Header */}
        <div style={{ padding: "1.25rem 2rem", borderBottom: "1px solid #1e293b", background: "#0a0e1a", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>{tab}</h1>
            <p style={{ margin: 0, fontSize: "0.78rem", color: "#475569" }}>Sábado, 28 de Febrero 2026</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#111827", border: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "0.9rem" }}>🔔</div>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#111827", border: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "0.9rem" }}>⚙️</div>
          </div>
        </div>

        <div style={{ padding: "1.5rem 2rem" }}>

          {/* ========== DASHBOARD ========== */}
          {tab === "Dashboard" && (
            <div>
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                {[
                  { label: "Proyectos activos", value: 2, icon: "⬡", color: "#3b82f6" },
                  { label: "Tareas pendientes", value: 4, icon: "◇", color: "#f59e0b" },
                  { label: "Completadas", value: 30, icon: "✓", color: "#10b981" },
                  { label: "Progreso general", value: "58%", icon: "◈", color: "#8b5cf6" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 12, padding: "1.1rem 1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <p style={{ margin: "0 0 4px", fontSize: "0.72rem", color: "#475569", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</p>
                        <p style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: "#e2e8f0" }}>{s.value}</p>
                      </div>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: `${s.color}22`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, fontSize: "1.1rem" }}>{s.icon}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts row */}
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 14, marginBottom: 16 }}>
                <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 12, padding: "1.25rem" }}>
                  <p style={{ margin: "0 0 1rem", fontWeight: 700, fontSize: "0.88rem" }}>Tareas completadas por semana</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={progresoSemanal}>
                      <XAxis dataKey="sem" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0", fontSize: 12 }} />
                      <Line type="monotone" dataKey="tareas" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: "#3b82f6", r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 12, padding: "1.25rem" }}>
                  <p style={{ margin: "0 0 1rem", fontWeight: 700, fontSize: "0.88rem" }}>Estado de tareas</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <PieChart width={120} height={120}>
                      <Pie data={pieData} cx={55} cy={55} innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={0}>
                        {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                      </Pie>
                    </PieChart>
                    <div style={{ flex: 1 }}>
                      {pieData.map((d, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                          <div style={{ width: 8, height: 8, borderRadius: 2, background: PIE_COLORS[i], flexShrink: 0 }}></div>
                          <span style={{ fontSize: "0.75rem", color: "#94a3b8", flex: 1 }}>{d.name}</span>
                          <span style={{ fontSize: "0.78rem", fontWeight: 700 }}>{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Proximas tareas */}
              <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 12, padding: "1.25rem" }}>
                <p style={{ margin: "0 0 0.75rem", fontWeight: 700, fontSize: "0.88rem" }}>Próximas tareas a vencer</p>
                {tareasList.filter(t => !t.completada).slice(0, 3).map(t => (
                  <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "0.6rem 0", borderBottom: "1px solid #1e293b" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: prioridadColor[t.prioridad], flexShrink: 0 }}></div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: "0.83rem", fontWeight: 500 }}>{t.titulo}</p>
                      <p style={{ margin: 0, fontSize: "0.72rem", color: "#475569" }}>{t.proyecto}</p>
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "#64748b", fontFamily: "monospace" }}>{t.limite}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========== PROYECTOS ========== */}
          {tab === "Proyectos" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
                {proyectos.map(p => (
                  <div key={p.id} style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 12, padding: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "0.9rem" }}>{p.titulo}</p>
                        <p style={{ margin: 0, fontSize: "0.72rem", color: "#475569" }}>Límite: {p.limite} · {p.miembros} miembros</p>
                      </div>
                      <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "3px 8px", borderRadius: 100, background: `${estadoColor[p.estado]}22`, color: estadoColor[p.estado], flexShrink: 0, marginLeft: 8 }}>{p.estado}</span>
                    </div>

                    <div style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: "0.72rem", color: "#475569" }}>Progreso</span>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#e2e8f0" }}>{p.progreso}%</span>
                      </div>
                      <div style={{ height: 6, background: "#1e293b", borderRadius: 100, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${p.progreso}%`, background: p.progreso === 100 ? "#10b981" : "linear-gradient(90deg, #3b82f6, #8b5cf6)", borderRadius: 100, transition: "width 0.3s" }}></div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 10 }}>
                      {[
                        { label: "Total", value: p.tareas, color: "#475569" },
                        { label: "Listas", value: p.completadas, color: "#10b981" },
                        { label: "Pendientes", value: p.tareas - p.completadas, color: "#f59e0b" },
                      ].map((s, i) => (
                        <div key={i} style={{ flex: 1, background: "#0f1729", borderRadius: 8, padding: "0.4rem 0.5rem", textAlign: "center" }}>
                          <p style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: s.color }}>{s.value}</p>
                          <p style={{ margin: 0, fontSize: "0.62rem", color: "#475569" }}>{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========== TAREAS ========== */}
          {tab === "Tareas" && (
            <div>
              <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "0.75rem 1.25rem", borderBottom: "1px solid #1e293b", display: "grid", gridTemplateColumns: "2fr 1fr 0.8fr 0.8fr 36px", gap: 12 }}>
                  {["Tarea", "Proyecto", "Prioridad", "Límite", ""].map((h, i) => (
                    <p key={i} style={{ margin: 0, fontSize: "0.7rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</p>
                  ))}
                </div>
                {tareasList.map(t => (
                  <div key={t.id} style={{ padding: "0.85rem 1.25rem", borderBottom: "1px solid #0f1729", display: "grid", gridTemplateColumns: "2fr 1fr 0.8fr 0.8fr 36px", gap: 12, alignItems: "center", opacity: t.completada ? 0.5 : 1, transition: "opacity 0.2s" }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 500, textDecoration: t.completada ? "line-through" : "none", color: t.completada ? "#475569" : "#e2e8f0" }}>{t.titulo}</p>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>{t.proyecto}</p>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 7px", borderRadius: 100, background: `${prioridadColor[t.prioridad]}22`, color: prioridadColor[t.prioridad], width: "fit-content" }}>{t.prioridad}</span>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#475569", fontFamily: "monospace" }}>{t.limite}</p>
                    <button onClick={() => toggleTarea(t.id)} style={{ width: 24, height: 24, borderRadius: 6, border: `2px solid ${t.completada ? "#10b981" : "#334155"}`, background: t.completada ? "#10b981" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.7rem", transition: "all 0.15s" }}>
                      {t.completada ? "✓" : ""}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========== NOTICIAS ========== */}
          {tab === "Noticias" && (
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                {["Todas", "Académico", "Taller", "Infraestructura"].map(c => (
                  <button key={c} style={{ padding: "0.35rem 0.85rem", borderRadius: 100, border: "1px solid #1e293b", background: c === "Todas" ? "rgba(59,130,246,0.15)" : "#111827", color: c === "Todas" ? "#93c5fd" : "#64748b", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }}>{c}</button>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {noticias.map(n => (
                  <div key={n.id} style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 12, padding: "1.25rem", cursor: "pointer", transition: "border-color 0.15s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "2px 7px", borderRadius: 100, background: "rgba(59,130,246,0.15)", color: "#93c5fd", marginBottom: 6, display: "inline-block" }}>{n.categoria}</span>
                        <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "0.9rem", lineHeight: 1.4 }}>{n.titulo}</p>
                        <div style={{ display: "flex", gap: 12 }}>
                          <span style={{ fontSize: "0.72rem", color: "#475569" }}>🕐 {n.tiempo}</span>
                          <span style={{ fontSize: "0.72rem", color: "#475569" }}>👁 {n.vistas} vistas</span>
                        </div>
                      </div>
                      <div style={{ width: 80, height: 56, borderRadius: 8, background: "linear-gradient(135deg, #1e293b, #0f1729)", flexShrink: 0 }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
