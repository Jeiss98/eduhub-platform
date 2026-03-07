import { useState } from "react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, YAxis } from "recharts";

// ─── DATOS ───────────────────────────────────────────────
const proyectosData = [
  { id:1, titulo:"Análisis de Algoritmos",   docente:"Prof. María García", estado:"activo",    avance:68,  tareas:12, completadas:8,  limite:"2026-03-15", miembros:4 },
  { id:2, titulo:"Diseño BD Relacional",     docente:"Prof. María García", estado:"activo",    avance:45,  tareas:9,  completadas:4,  limite:"2026-04-01", miembros:3 },
  { id:3, titulo:"App Móvil React Native",   docente:"Prof. Carlos Ruiz",  estado:"pausado",   avance:20,  tareas:18, completadas:3,  limite:"2026-04-20", miembros:5 },
  { id:4, titulo:"API REST con Node.js",     docente:"Prof. Carlos Ruiz",  estado:"finalizado",avance:100, tareas:15, completadas:15, limite:"2026-02-10", miembros:2 },
];
const tareasData = [
  { id:1, titulo:"Análisis Big-O",        proyecto:"Análisis de Algoritmos", prioridad:"alta",  completada:false, limite:"2026-03-05", asignado:"Ana López"     },
  { id:2, titulo:"QuickSort en Java",     proyecto:"Análisis de Algoritmos", prioridad:"alta",  completada:false, limite:"2026-03-08", asignado:"Carlos Mendez" },
  { id:3, titulo:"Normalización 3FN",     proyecto:"Diseño BD Relacional",   prioridad:"media", completada:false, limite:"2026-03-10", asignado:"Ana López"     },
  { id:4, titulo:"Modelado ER",           proyecto:"Diseño BD Relacional",   prioridad:"alta",  completada:true,  limite:"2026-02-25", asignado:"Luis Pérez"    },
  { id:5, titulo:"Endpoints JWT",         proyecto:"API REST con Node.js",   prioridad:"alta",  completada:true,  limite:"2026-02-08", asignado:"Ana López"     },
];
const noticiasData = [
  { id:1, titulo:"Semana de Proyectos Finales — Mayo 2026",       categoria:"Académico",       emoji:"📅", tiempo:"hace 2h",  vistas:234, autor:"Prof. García" },
  { id:2, titulo:"Taller gratuito de Docker para estudiantes",    categoria:"Taller",          emoji:"🐳", tiempo:"hace 5h",  vistas:189, autor:"Admin"        },
  { id:3, titulo:"Estudiantes de Ing. ganan Hackathon Nacional",  categoria:"Logro",           emoji:"🏆", tiempo:"hace 3d",  vistas:891, autor:"Admin"        },
  { id:4, titulo:"Nuevo laboratorio de IA disponible",            categoria:"Infraestructura", emoji:"🤖", tiempo:"ayer",     vistas:412, autor:"Admin"        },
  { id:5, titulo:"Convocatoria semilleros de investigación 2026", categoria:"Académico",       emoji:"📚", tiempo:"hace 2d",  vistas:321, autor:"García"       },
];
const usuariosData = [
  { id:1, nombre:"Ana López",       email:"ana@konrad.edu.co",    rol:"estudiante", estado:"activo",   proyectos:2 },
  { id:2, nombre:"Carlos Mendez",   email:"cmendez@konrad.edu.co",rol:"estudiante", estado:"activo",   proyectos:3 },
  { id:3, nombre:"Luis Pérez",      email:"lperez@konrad.edu.co", rol:"estudiante", estado:"inactivo", proyectos:1 },
  { id:4, nombre:"Prof. M. García", email:"garcia@konrad.edu.co", rol:"docente",    estado:"activo",   proyectos:4 },
  { id:5, nombre:"Prof. C. Ruiz",   email:"cruiz@konrad.edu.co",  rol:"docente",    estado:"activo",   proyectos:2 },
  { id:6, nombre:"Admin Sistema",   email:"admin@konrad.edu.co",  rol:"admin",      estado:"activo",   proyectos:0 },
];
const semanasData = [
  { sem:"S1", tareas:2 }, { sem:"S2", tareas:5 }, { sem:"S3", tareas:3 },
  { sem:"S4", tareas:7 }, { sem:"S5", tareas:4 }, { sem:"S6", tareas:8 },
];
const pieData = [
  { name:"Completadas", value:30 }, { name:"En progreso", value:15 }, { name:"Pendientes", value:9 },
];
const PIE_COLORS = ["#10b981","#3b82f6","#475569"];

const estadoColor    = { activo:"#10b981", pausado:"#f59e0b", finalizado:"#3b82f6", inactivo:"#ef4444" };
const prioridadColor = { alta:"#ef4444", media:"#f59e0b", baja:"#64748b" };
const rolColor       = { estudiante:"#3b82f6", docente:"#10b981", admin:"#8b5cf6" };

// ─── TABS POR ROL ─────────────────────────────────────────
const TABS_BY_ROL = {
  estudiante: ["Dashboard","Proyectos","Tareas","Noticias","Perfil"],
  docente:    ["Dashboard","Proyectos","Tareas","Evaluaciones","Noticias","Perfil"],
  admin:      ["Dashboard","Usuarios","Proyectos","Reportes","Noticias","Perfil"],
};
const ICONS = {
  Dashboard:"◈", Proyectos:"⬡", Tareas:"◇", Noticias:"◉",
  Perfil:"◎", Evaluaciones:"★", Usuarios:"⬛", Reportes:"▣",
};

// ─── HELPERS UI ───────────────────────────────────────────
function Card({ children, style={} }) {
  return <div style={{ background:"#111827", border:"1px solid #1e293b", borderRadius:12, padding:"1.25rem", ...style }}>{children}</div>;
}
function CardTitle({ children }) {
  return <p style={{ margin:"0 0 0.75rem", fontWeight:700, fontSize:"0.88rem" }}>{children}</p>;
}
function StatCard({ label, value, icon, color }) {
  return (
    <Card>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <p style={{ margin:"0 0 4px", fontSize:"0.7rem", color:"#475569", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}</p>
          <p style={{ margin:0, fontSize:"1.6rem", fontWeight:800 }}>{value}</p>
        </div>
        <div style={{ width:36, height:36, borderRadius:8, background:`${color}22`, display:"flex", alignItems:"center", justifyContent:"center", color, fontSize:"1.1rem" }}>{icon}</div>
      </div>
    </Card>
  );
}
function ProgBar({ value, color="#3b82f6" }) {
  return (
    <div style={{ height:6, background:"#1e293b", borderRadius:100, overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${value}%`, background:color, borderRadius:100, transition:"width 0.3s" }}></div>
    </div>
  );
}
function Badge({ text, color }) {
  return <span style={{ fontSize:"0.68rem", fontWeight:700, padding:"3px 8px", borderRadius:100, background:`${color}22`, color, display:"inline-block", whiteSpace:"nowrap" }}>{text}</span>;
}

// ─── VISTAS ───────────────────────────────────────────────

function EstDashboard({ tareasList }) {
  const pendientes = tareasList.filter(t => !t.completada);
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:16 }}>
        <StatCard label="Proyectos activos" value={2}              icon="⬡" color="#3b82f6" />
        <StatCard label="Tareas pendientes" value={pendientes.length} icon="◇" color="#f59e0b" />
        <StatCard label="Completadas"       value={30}             icon="✓" color="#10b981" />
        <StatCard label="Promedio general"  value="8.7"            icon="★" color="#8b5cf6" />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:14, marginBottom:14 }}>
        <Card>
          <CardTitle>Tareas completadas por semana</CardTitle>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={semanasData}>
              <XAxis dataKey="sem" tick={{ fill:"#475569", fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background:"#1e293b", border:"1px solid #334155", borderRadius:8, color:"#e2e8f0", fontSize:12 }} />
              <Line type="monotone" dataKey="tareas" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill:"#3b82f6", r:4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <CardTitle>Estado de tareas</CardTitle>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <PieChart width={100} height={100}>
              <Pie data={pieData} cx={45} cy={45} innerRadius={28} outerRadius={45} dataKey="value" strokeWidth={0}>
                {pieData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
            </PieChart>
            <div>
              {pieData.map((d,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
                  <div style={{ width:8, height:8, borderRadius:2, background:PIE_COLORS[i] }}></div>
                  <span style={{ fontSize:"0.72rem", color:"#94a3b8", flex:1 }}>{d.name}</span>
                  <span style={{ fontSize:"0.78rem", fontWeight:700 }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      <Card>
        <CardTitle>Próximas tareas a vencer</CardTitle>
        {pendientes.slice(0,4).map(t => (
          <div key={t.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"0.55rem 0", borderBottom:"1px solid #1e293b" }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:prioridadColor[t.prioridad], flexShrink:0 }}></div>
            <div style={{ flex:1 }}>
              <p style={{ margin:0, fontSize:"0.83rem", fontWeight:500 }}>{t.titulo}</p>
              <p style={{ margin:0, fontSize:"0.7rem", color:"#475569" }}>{t.proyecto}</p>
            </div>
            <Badge text={t.prioridad} color={prioridadColor[t.prioridad]} />
            <span style={{ fontSize:"0.72rem", color:"#64748b", fontFamily:"monospace" }}>{t.limite}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function DocDashboard() {
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:16 }}>
        <StatCard label="Proyectos activos"  value={2}  icon="⬡" color="#10b981" />
        <StatCard label="Total estudiantes"  value={14} icon="👥" color="#3b82f6" />
        <StatCard label="Tareas asignadas"   value={54} icon="◇" color="#f59e0b" />
        <StatCard label="Evaluaciones reg."  value={32} icon="★" color="#8b5cf6" />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
        <Card>
          <CardTitle>Avance de mis proyectos</CardTitle>
          {proyectosData.slice(0,3).map(p => (
            <div key={p.id} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:"0.78rem", fontWeight:500 }}>{p.titulo}</span>
                <span style={{ fontSize:"0.75rem", color:"#475569" }}>{p.avance}%</span>
              </div>
              <ProgBar value={p.avance} color={p.avance===100?"#10b981":"#10b981"} />
            </div>
          ))}
        </Card>
        <Card>
          <CardTitle>Miembros por proyecto</CardTitle>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={proyectosData.map(p=>({ name:p.titulo.split(" ").slice(0,2).join(" "), est:p.miembros }))}>
              <XAxis dataKey="name" tick={{ fill:"#475569", fontSize:9 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background:"#1e293b", border:"1px solid #334155", borderRadius:8, color:"#e2e8f0", fontSize:11 }} />
              <Bar dataKey="est" fill="#10b981" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card>
        <CardTitle>Tareas pendientes de revisión</CardTitle>
        {tareasData.filter(t=>!t.completada).slice(0,4).map(t => (
          <div key={t.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"0.55rem 0", borderBottom:"1px solid #1e293b" }}>
            <div style={{ flex:1 }}>
              <p style={{ margin:0, fontSize:"0.83rem", fontWeight:500 }}>{t.titulo}</p>
              <p style={{ margin:0, fontSize:"0.7rem", color:"#475569" }}>{t.proyecto} · Alumno: {t.asignado}</p>
            </div>
            <Badge text={t.prioridad} color={prioridadColor[t.prioridad]} />
            <span style={{ fontSize:"0.72rem", color:"#64748b", fontFamily:"monospace" }}>{t.limite}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function AdminDashboard() {
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:16 }}>
        <StatCard label="Total usuarios"     value={6}    icon="👥" color="#3b82f6" />
        <StatCard label="Proyectos activos"  value={2}    icon="⬡" color="#10b981" />
        <StatCard label="Noticias publicadas" value={9}   icon="◉" color="#f59e0b" />
        <StatCard label="Carga del sistema"  value="98%"  icon="◈" color="#8b5cf6" />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
        <Card>
          <CardTitle>Distribución de usuarios por rol</CardTitle>
          {[["Estudiantes","#3b82f6",3,6],["Docentes","#10b981",2,6],["Administradores","#8b5cf6",1,6]].map(([r,c,n,t])=>(
            <div key={r} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:"0.78rem" }}>{r}</span>
                <span style={{ fontSize:"0.75rem", color:"#475569" }}>{n} usuarios</span>
              </div>
              <ProgBar value={(n/t)*100} color={c} />
            </div>
          ))}
        </Card>
        <Card>
          <CardTitle>Actividad reciente</CardTitle>
          {[
            ["🟢","Ana López inició sesión","hace 5min"],
            ["🔵","Prof. García creó proyecto","hace 20min"],
            ["🟡","Admin publicó noticia","hace 1h"],
            ["🔴","Luis Pérez cuenta inactiva","hace 2h"],
          ].map(([dot,texto,tiempo])=>(
            <div key={texto} style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"0.45rem 0", borderBottom:"1px solid #1e293b" }}>
              <span style={{ fontSize:"0.6rem", marginTop:3 }}>{dot}</span>
              <div style={{ flex:1 }}>
                <p style={{ margin:0, fontSize:"0.8rem" }}>{texto}</p>
                <p style={{ margin:0, fontSize:"0.68rem", color:"#475569" }}>{tiempo}</p>
              </div>
            </div>
          ))}
        </Card>
      </div>
      <Card>
        <CardTitle>Todos los proyectos del sistema</CardTitle>
        {proyectosData.map(p=>(
          <div key={p.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"0.55rem 0", borderBottom:"1px solid #1e293b" }}>
            <div style={{ flex:1 }}>
              <p style={{ margin:0, fontSize:"0.83rem", fontWeight:500 }}>{p.titulo}</p>
              <p style={{ margin:0, fontSize:"0.7rem", color:"#475569" }}>{p.docente} · {p.miembros} miembros</p>
            </div>
            <Badge text={p.estado} color={estadoColor[p.estado]} />
            <span style={{ fontSize:"0.78rem", fontWeight:700 }}>{p.avance}%</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function VistaUsuarios() {
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <h2 style={{ margin:0, fontSize:"1rem", fontWeight:700 }}>Gestión de usuarios</h2>
        <button style={{ background:"#8b5cf6", border:"none", color:"#fff", borderRadius:8, padding:"0.5rem 1rem", cursor:"pointer", fontSize:"0.82rem", fontWeight:600 }}>+ Nuevo usuario</button>
      </div>
      <Card style={{ padding:0 }}>
        <div style={{ padding:"0.75rem 1.25rem", display:"grid", gridTemplateColumns:"2fr 2fr 1fr 1fr 80px", gap:12, borderBottom:"1px solid #1e293b" }}>
          {["Nombre","Correo","Rol","Estado","Proyectos"].map(h=>(
            <p key={h} style={{ margin:0, fontSize:"0.7rem", fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</p>
          ))}
        </div>
        {usuariosData.map(u=>(
          <div key={u.id} style={{ padding:"0.85rem 1.25rem", borderBottom:"1px solid #0f1729", display:"grid", gridTemplateColumns:"2fr 2fr 1fr 1fr 80px", gap:12, alignItems:"center" }}>
            <p style={{ margin:0, fontSize:"0.85rem", fontWeight:600 }}>{u.nombre}</p>
            <p style={{ margin:0, fontSize:"0.78rem", color:"#475569" }}>{u.email}</p>
            <Badge text={u.rol} color={rolColor[u.rol]} />
            <Badge text={u.estado} color={estadoColor[u.estado]} />
            <p style={{ margin:0, fontSize:"0.85rem", color:"#94a3b8" }}>{u.proyectos}</p>
          </div>
        ))}
      </Card>
    </div>
  );
}

function VistaEvaluaciones() {
  const evals = [
    { id:1, estudiante:"Ana López",    proyecto:"Algoritmos",nota:4.5, comentario:"Excelente análisis de complejidad.",          fecha:"2026-02-28" },
    { id:2, estudiante:"Carlos Mendez",proyecto:"Algoritmos",nota:3.8, comentario:"Buen trabajo, mejorar documentación.",         fecha:"2026-02-28" },
    { id:3, estudiante:"Luis Pérez",   proyecto:"Diseño BD", nota:4.2, comentario:"Modelo ER bien estructurado.",                fecha:"2026-03-01" },
    { id:4, estudiante:"Ana López",    proyecto:"API REST",  nota:4.8, comentario:"Endpoints bien documentados y seguros.",      fecha:"2026-02-20" },
  ];
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <h2 style={{ margin:0, fontSize:"1rem", fontWeight:700 }}>Evaluaciones registradas</h2>
        <button style={{ background:"#10b981", border:"none", color:"#fff", borderRadius:8, padding:"0.5rem 1rem", cursor:"pointer", fontSize:"0.82rem", fontWeight:600 }}>+ Nueva evaluación</button>
      </div>
      <div style={{ display:"grid", gap:10 }}>
        {evals.map(e=>(
          <Card key={e.id} style={{ display:"flex", alignItems:"center", gap:16, padding:"1rem 1.25rem" }}>
            <div style={{ width:48, height:48, borderRadius:"50%", background:"linear-gradient(135deg,#10b981,#3b82f6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem", fontWeight:800, color:"#fff", flexShrink:0 }}>{e.nota}</div>
            <div style={{ flex:1 }}>
              <p style={{ margin:"0 0 2px", fontWeight:700, fontSize:"0.88rem" }}>{e.estudiante}</p>
              <p style={{ margin:"0 0 4px", fontSize:"0.75rem", color:"#475569" }}>{e.proyecto} · {e.fecha}</p>
              <p style={{ margin:0, fontSize:"0.78rem", color:"#94a3b8", fontStyle:"italic" }}>"{e.comentario}"</p>
            </div>
            <div style={{ textAlign:"center", flexShrink:0 }}>
              <p style={{ margin:0, fontSize:"1.4rem", fontWeight:800, color: e.nota>=4.5?"#10b981":e.nota>=3.5?"#f59e0b":"#ef4444" }}>{e.nota}</p>
              <p style={{ margin:0, fontSize:"0.65rem", color:"#475569" }}>/ 5.0</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function VistaReportes() {
  return (
    <div>
      <h2 style={{ margin:"0 0 16px", fontSize:"1rem", fontWeight:700 }}>Reportes globales del sistema</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:14 }}>
        {[["Nota promedio global","4.24","#10b981"],["Tasa de completado","72%","#3b82f6"],["Usuarios activos","5/6","#8b5cf6"]].map(([l,v,c])=>(
          <Card key={l} style={{ textAlign:"center" }}>
            <p style={{ margin:"0 0 6px", fontSize:"2rem", fontWeight:800, color:c }}>{v}</p>
            <p style={{ margin:0, fontSize:"0.75rem", color:"#475569" }}>{l}</p>
          </Card>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Card>
          <CardTitle>Promedio de notas por proyecto</CardTitle>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={[{n:"Algoritmos",avg:4.15},{n:"Diseño BD",avg:4.2},{n:"App Móvil",avg:3.9},{n:"API REST",avg:4.6}]}>
              <XAxis dataKey="n" tick={{ fill:"#475569", fontSize:10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0,5]} hide />
              <Tooltip contentStyle={{ background:"#1e293b", border:"1px solid #334155", borderRadius:8, color:"#e2e8f0", fontSize:11 }} />
              <Bar dataKey="avg" fill="#8b5cf6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <CardTitle>Actividad semanal</CardTitle>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={semanasData}>
              <XAxis dataKey="sem" tick={{ fill:"#475569", fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background:"#1e293b", border:"1px solid #334155", borderRadius:8, color:"#e2e8f0", fontSize:11 }} />
              <Line type="monotone" dataKey="tareas" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill:"#8b5cf6", r:4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function VistaProyectos({ rol }) {
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <h2 style={{ margin:0, fontSize:"1rem", fontWeight:700 }}>
          {rol==="estudiante" ? "Mis proyectos" : rol==="docente" ? "Proyectos que dirijo" : "Todos los proyectos"}
        </h2>
        {(rol==="docente"||rol==="admin") && (
          <button style={{ background:"#2563EB", border:"none", color:"#fff", borderRadius:8, padding:"0.5rem 1rem", cursor:"pointer", fontSize:"0.82rem", fontWeight:600 }}>+ Nuevo proyecto</button>
        )}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14 }}>
        {proyectosData.map(p=>(
          <Card key={p.id}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
              <div style={{ flex:1 }}>
                <p style={{ margin:"0 0 3px", fontWeight:700, fontSize:"0.9rem" }}>{p.titulo}</p>
                <p style={{ margin:0, fontSize:"0.72rem", color:"#475569" }}>{p.docente} · Límite: {p.limite}</p>
              </div>
              <Badge text={p.estado} color={estadoColor[p.estado]} />
            </div>
            <div style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:"0.72rem", color:"#475569" }}>Progreso</span>
                <span style={{ fontSize:"0.72rem", fontWeight:700 }}>{p.avance}%</span>
              </div>
              <ProgBar value={p.avance} color={p.avance===100?"#10b981":"#3b82f6"} />
            </div>
            <div style={{ display:"flex", gap:8 }}>
              {[["Total",p.tareas,"#475569"],["Listas",p.completadas,"#10b981"],["Pendientes",p.tareas-p.completadas,"#f59e0b"]].map(([l,v,c])=>(
                <div key={l} style={{ flex:1, background:"#0f1729", borderRadius:7, padding:"0.35rem 0.5rem", textAlign:"center" }}>
                  <p style={{ margin:0, fontSize:"1rem", fontWeight:800, color:c }}>{v}</p>
                  <p style={{ margin:0, fontSize:"0.6rem", color:"#475569" }}>{l}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function VistaTareas({ tareasList, toggleTarea, rol }) {
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <h2 style={{ margin:0, fontSize:"1rem", fontWeight:700 }}>{rol==="docente" ? "Tareas asignadas" : "Mis tareas"}</h2>
        {rol==="docente" && (
          <button style={{ background:"#10b981", border:"none", color:"#fff", borderRadius:8, padding:"0.5rem 1rem", cursor:"pointer", fontSize:"0.82rem", fontWeight:600 }}>+ Asignar tarea</button>
        )}
      </div>
      <Card style={{ padding:0 }}>
        <div style={{ padding:"0.75rem 1.25rem", display:"grid", gridTemplateColumns:`2fr 1.5fr 0.8fr 0.8fr 36px`, gap:12, borderBottom:"1px solid #1e293b" }}>
          {["Tarea","Proyecto","Prioridad","Límite",""].map(h=>(
            <p key={h} style={{ margin:0, fontSize:"0.7rem", fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</p>
          ))}
        </div>
        {tareasList.map(t=>(
          <div key={t.id} style={{ padding:"0.85rem 1.25rem", borderBottom:"1px solid #0f1729", display:"grid", gridTemplateColumns:"2fr 1.5fr 0.8fr 0.8fr 36px", gap:12, alignItems:"center", opacity:t.completada?0.5:1 }}>
            <p style={{ margin:0, fontSize:"0.85rem", fontWeight:500, textDecoration:t.completada?"line-through":"none", color:t.completada?"#475569":"#e2e8f0" }}>{t.titulo}</p>
            <p style={{ margin:0, fontSize:"0.75rem", color:"#64748b" }}>{t.proyecto}</p>
            <Badge text={t.prioridad} color={prioridadColor[t.prioridad]} />
            <p style={{ margin:0, fontSize:"0.72rem", color:"#475569", fontFamily:"monospace" }}>{t.limite}</p>
            <button onClick={() => toggleTarea(t.id)} style={{ width:24, height:24, borderRadius:6, border:`2px solid ${t.completada?"#10b981":"#334155"}`, background:t.completada?"#10b981":"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:"0.7rem" }}>
              {t.completada?"✓":""}
            </button>
          </div>
        ))}
      </Card>
    </div>
  );
}

function VistaNoticias({ rol }) {
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <h2 style={{ margin:0, fontSize:"1rem", fontWeight:700 }}>Noticias institucionales</h2>
        {(rol==="docente"||rol==="admin") && (
          <button style={{ background:"#f59e0b", border:"none", color:"#000", borderRadius:8, padding:"0.5rem 1rem", cursor:"pointer", fontSize:"0.82rem", fontWeight:600 }}>+ Publicar noticia</button>
        )}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {noticiasData.map(n=>(
          <Card key={n.id} style={{ cursor:"pointer", padding:"1rem 1.25rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
              <div style={{ flex:1 }}>
                <span style={{ fontSize:"0.68rem", fontWeight:700, padding:"2px 7px", borderRadius:100, background:"rgba(59,130,246,0.15)", color:"#93c5fd", display:"inline-block", marginBottom:5 }}>{n.categoria}</span>
                <p style={{ margin:"0 0 4px", fontWeight:700, fontSize:"0.9rem", lineHeight:1.4 }}>{n.emoji} {n.titulo}</p>
                <div style={{ display:"flex", gap:12 }}>
                  <span style={{ fontSize:"0.72rem", color:"#475569" }}>🕐 {n.tiempo}</span>
                  <span style={{ fontSize:"0.72rem", color:"#475569" }}>👁 {n.vistas} vistas</span>
                  <span style={{ fontSize:"0.72rem", color:"#475569" }}>✍️ {n.autor}</span>
                </div>
              </div>
              {(rol==="docente"||rol==="admin") && (
                <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                  <button style={{ background:"#1e293b", border:"1px solid #334155", color:"#94a3b8", borderRadius:6, padding:"0.3rem 0.6rem", cursor:"pointer", fontSize:"0.72rem" }}>Editar</button>
                  <button style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#f87171", borderRadius:6, padding:"0.3rem 0.6rem", cursor:"pointer", fontSize:"0.72rem" }}>Eliminar</button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function VistaPerfil({ user, initials, onLogout }) {
  return (
    <div>
      <h2 style={{ margin:"0 0 16px", fontSize:"1rem", fontWeight:700 }}>Mi perfil</h2>
      <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
        <Card style={{ flex:"1 1 300px" }}>
          <CardTitle>Información personal</CardTitle>
          <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:`linear-gradient(135deg,${rolColor[user.rol]},#8b5cf6)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem", fontWeight:800, color:"#fff", flexShrink:0 }}>{initials}</div>
            <div>
              <p style={{ margin:"0 0 4px", fontWeight:700, fontSize:"0.95rem" }}>{user.nombre}</p>
              <Badge text={user.rol} color={rolColor[user.rol]} />
            </div>
          </div>
          {[["Nombre completo",user.nombre],["Correo electrónico",user.email],["Rol en el sistema",user.rol]].map(([l,v])=>(
            <div key={l} style={{ marginBottom:12 }}>
              <p style={{ margin:"0 0 4px", fontSize:"0.7rem", fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:"0.05em" }}>{l}</p>
              <div style={{ background:"#0f1729", border:"1px solid #1e293b", borderRadius:7, padding:"0.5rem 0.75rem", fontSize:"0.85rem", color:"#94a3b8", textTransform:l==="Rol en el sistema"?"capitalize":"none" }}>{v}</div>
            </div>
          ))}
        </Card>
        <Card style={{ flex:"1 1 260px" }}>
          <CardTitle>Cambiar contraseña</CardTitle>
          {["Contraseña actual","Nueva contraseña","Confirmar nueva contraseña"].map(l=>(
            <div key={l} style={{ marginBottom:12 }}>
              <p style={{ margin:"0 0 4px", fontSize:"0.7rem", fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:"0.05em" }}>{l}</p>
              <input type="password" placeholder="••••••••" style={{ width:"100%", background:"#0f1729", border:"1px solid #1e293b", borderRadius:7, color:"#e2e8f0", fontSize:"0.85rem", padding:"0.5rem 0.75rem", boxSizing:"border-box", outline:"none" }} />
            </div>
          ))}
          <button style={{ width:"100%", background:"#1e293b", border:"1px solid #334155", color:"#94a3b8", borderRadius:8, padding:"0.6rem", fontSize:"0.85rem", fontWeight:600, cursor:"pointer", marginBottom:8 }}>Actualizar contraseña</button>
          <button onClick={onLogout} style={{ width:"100%", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#f87171", borderRadius:8, padding:"0.6rem", fontSize:"0.85rem", fontWeight:600, cursor:"pointer" }}>Cerrar sesión</button>
        </Card>
      </div>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────
export default function Dashboard({ usuario, onLogout }) {
  const user     = usuario || { nombre:"Demo", email:"demo@eduhub.co", rol:"estudiante" };
  const initials = user.nombre.split(" ").map(x=>x[0]).join("").toUpperCase().slice(0,2);
  const tabs     = TABS_BY_ROL[user.rol] || TABS_BY_ROL.estudiante;
  const accent   = rolColor[user.rol] || "#3b82f6";

  const [tab, setTab]           = useState("Dashboard");
  const [tareasList, setTareas] = useState(tareasData);

  const toggleTarea = (id) => setTareas(prev => prev.map(t => t.id===id ? {...t, completada:!t.completada} : t));

  const renderContent = () => {
    if (tab==="Dashboard")    { if (user.rol==="admin") return <AdminDashboard />; if (user.rol==="docente") return <DocDashboard />; return <EstDashboard tareasList={tareasList} />; }
    if (tab==="Proyectos")    return <VistaProyectos rol={user.rol} />;
    if (tab==="Tareas")       return <VistaTareas tareasList={tareasList} toggleTarea={toggleTarea} rol={user.rol} />;
    if (tab==="Noticias")     return <VistaNoticias rol={user.rol} />;
    if (tab==="Evaluaciones") return <VistaEvaluaciones />;
    if (tab==="Usuarios")     return <VistaUsuarios />;
    if (tab==="Reportes")     return <VistaReportes />;
    if (tab==="Perfil")       return <VistaPerfil user={user} initials={initials} onLogout={onLogout} />;
    return null;
  };

  const subtitulo = { estudiante:"Panel estudiantil", docente:"Panel docente", admin:"Panel de administración" }[user.rol] || "";

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"'Segoe UI', system-ui, sans-serif", background:"#0a0e1a", color:"#e2e8f0", overflow:"hidden" }}>
      <aside style={{ width:220, background:"#0f1729", borderRight:"1px solid #1e293b", display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"1.5rem 1.25rem 0.75rem", borderBottom:"1px solid #1e293b" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, background:"linear-gradient(135deg,#2563EB,#14B8A6)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800, color:"white" }}>E</div>
            <span style={{ fontWeight:800, fontSize:"1.05rem" }}>EduHub</span>
          </div>
          <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:accent }}></div>
            <span style={{ fontSize:"0.7rem", fontWeight:700, color:accent, textTransform:"capitalize" }}>{user.rol}</span>
          </div>
        </div>
        <nav style={{ padding:"0.6rem 0.75rem", flex:1 }}>
          {tabs.map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"0.6rem 0.75rem", borderRadius:8, border:"none", cursor:"pointer", textAlign:"left", fontSize:"0.875rem", fontWeight:500, background:tab===t?`${accent}22`:"transparent", color:tab===t?accent:"#64748b", transition:"all 0.15s", marginBottom:2 }}>
              <span>{ICONS[t]}</span>{t}
            </button>
          ))}
        </nav>
        <div style={{ padding:"1rem 1.25rem", borderTop:"1px solid #1e293b", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${accent},#8b5cf6)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.8rem", fontWeight:700, color:"white", flexShrink:0 }}>{initials}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ margin:0, fontSize:"0.8rem", fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.nombre}</p>
            <p style={{ margin:0, fontSize:"0.7rem", color:"#475569", textTransform:"capitalize" }}>{user.rol}</p>
          </div>
          <button onClick={onLogout} title="Cerrar sesión" style={{ background:"none", border:"none", color:"#475569", cursor:"pointer", fontSize:"1rem", padding:"0.25rem", borderRadius:6 }}>✕</button>
        </div>
      </aside>
      <main style={{ flex:1, overflow:"auto", background:"#0a0e1a" }}>
        <div style={{ padding:"1.25rem 2rem", borderBottom:"1px solid #1e293b", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:"#0a0e1a", zIndex:10 }}>
          <div>
            <h1 style={{ margin:0, fontSize:"1.1rem", fontWeight:700 }}>{tab}</h1>
            <p style={{ margin:0, fontSize:"0.78rem", color:"#475569" }}>{subtitulo} · EduHub 2026</p>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <div style={{ background:"#111827", border:"1px solid #1e293b", borderRadius:100, padding:"0.3rem 0.75rem", display:"flex", alignItems:"center", gap:6, fontSize:"0.75rem", color:"#475569" }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:"#10b981" }}></div>Conectado
            </div>
            <div style={{ width:36, height:36, borderRadius:8, background:"#111827", border:"1px solid #1e293b", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>🔔</div>
          </div>
        </div>
        <div style={{ padding:"1.5rem 2rem" }}>{renderContent()}</div>
      </main>
    </div>
  );
}
