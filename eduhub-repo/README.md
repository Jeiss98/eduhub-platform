# EduHub Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue?style=flat-square)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow?style=flat-square)
![Licencia](https://img.shields.io/badge/licencia-académica-lightgrey?style=flat-square)

> **Plataforma académica centralizada** para gestión de proyectos universitarios, tareas, evaluaciones y noticias institucionales.  
> Proyecto integrador — Fundación Universitaria Konrad Lorenz · 2026

---

## Tabla de contenidos

- [Descripción del proyecto](#descripción-del-proyecto)
- [Arquitectura](#arquitectura)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Stack tecnológico](#stack-tecnológico)
- [Base de datos](#base-de-datos)
- [Frontend](#frontend)
- [Setup rápido](#setup-rápido)
- [Equipo](#equipo)
- [Estado del proyecto](#estado-del-proyecto)

---

## Descripción del proyecto

**EduHub** es una plataforma web que unifica la gestión académica de la universidad en un solo lugar. Reemplaza el flujo fragmentado de correos, hojas de cálculo y canales dispersos con un sistema centralizado que permite:

| Rol          | Capacidades principales                                              |
|--------------|----------------------------------------------------------------------|
| 👨‍🎓 Estudiante  | Ver proyectos asignados, gestionar tareas, consultar evaluaciones    |
| 👩‍🏫 Docente     | Crear proyectos, asignar estudiantes, calificar, ver reportes        |
| 🛡 Admin      | Gestión de usuarios, control total del sistema, noticias             |

### Problemáticas que resuelve

- **Gestión dispersa** de proyectos académicos por correo y hojas de cálculo
- **Sin trazabilidad** de tareas ni seguimiento de avance en tiempo real
- **Evaluaciones sin historial** centralizado ni consulta fácil
- **Comunicación institucional** sin canal oficial para noticias y avisos
- **Sin notificaciones automáticas** de fechas límite ni vencimientos

---

## Arquitectura

El sistema usa una **arquitectura híbrida** con dos motores de base de datos:

```
┌─────────────────────────────────────────────────────┐
│                   CLIENTE (Browser)                  │
│         React SPA  ·  HTML/CSS/JS Standalone         │
└────────────────────────┬────────────────────────────┘
                         │ HTTP / REST
┌────────────────────────▼────────────────────────────┐
│               BACKEND  (Node.js + Express)           │
│   Autenticación JWT  ·  API REST  ·  Nodemailer      │
└──────────┬─────────────────────────────┬────────────┘
           │                             │
┌──────────▼──────────┐     ┌────────────▼────────────┐
│   MySQL 8.0          │     │   MongoDB Atlas          │
│  Datos relacionales  │     │  Noticias / contenido    │
│  usuarios, proyectos │     │  dinámico, estructura    │
│  tareas, evaluaciones│     │  variable                │
└─────────────────────┘     └─────────────────────────┘
```

**¿Por qué dos bases de datos?**
- **MySQL** para datos académicos con relaciones estrictas, integridad referencial y consultas complejas con JOINs
- **MongoDB** para noticias y contenido institucional con estructura variable y consultas flexibles

---

## Estructura del repositorio

```
eduhub-platform/
│
├── 📁 frontend/
│   └── index.html              ← Frontend standalone (abre en navegador o despliega en Netlify)
│
├── 📁 src/
│   └── Dashboard.jsx           ← Prototipo React del dashboard principal
│
├── 📁 database/
│   ├── eduhub_crud_completo.sql ← Script COMPLETO: tablas + datos + CRUD + SP + funciones
│   └── eduhub_schema.sql        ← Script de esquema base (versión anterior de referencia)
│
├── 📁 docs/
│   └── arquitectura.html        ← Documento de arquitectura del sistema
│
├── .gitignore
├── CONTRIBUTING.md              ← Guía de ramas, commits y Pull Requests
└── README.md                    ← Este archivo
```

> 📎 Los documentos `.docx` del parcial están disponibles en la sección [Releases](../../releases) del repositorio.

---

## Stack tecnológico

| Capa           | Tecnología              | Versión  | Uso                                  |
|----------------|-------------------------|----------|--------------------------------------|
| Frontend       | HTML5 / CSS3 / JS       | —        | Interfaz standalone                  |
| Frontend SPA   | React                   | 18+      | Dashboard interactivo                |
| Backend        | Node.js + Express       | 20 LTS   | API REST y lógica de negocio         |
| Auth           | JWT (jsonwebtoken)      | —        | Autenticación basada en tokens       |
| DB Relacional  | MySQL                   | 8.0      | Datos académicos estructurados       |
| DB Documental  | MongoDB Atlas           | 7.0      | Noticias y contenido dinámico        |
| Email          | Nodemailer              | —        | Notificaciones automáticas           |
| Despliegue FE  | Netlify                 | —        | Frontend estático                    |

---

## Base de datos

### Tablas y relaciones

```
usuarios (id_usuario PK)
    │
    ├──< proyectos (id_proyecto PK, id_docente FK)
    │       │
    │       ├──< proyecto_estudiantes (id_proyecto + id_estudiante PK compuesta)
    │       │
    │       ├──< tareas (id_tarea PK, id_proyecto FK, id_estudiante FK)
    │       │
    │       └──< evaluaciones (id_evaluacion PK, id_proyecto FK, id_docente FK)
    │
    └── (referenciado desde proyecto_estudiantes como id_estudiante)
```

### Procedimientos almacenados (5)

| Procedimiento              | Descripción                                              |
|----------------------------|----------------------------------------------------------|
| `sp_registrar_usuario`     | Registra usuario con validación de email duplicado       |
| `sp_progreso_proyecto`     | Devuelve resumen + detalle de tareas de un proyecto      |
| `sp_asignar_estudiante`    | Asigna estudiante con triple validación de negocio       |
| `sp_reporte_docente`       | Reporte de evaluaciones por docente con validación rol   |
| `sp_tareas_por_vencer`     | Tareas pendientes que vencen en los próximos N días      |

### Funciones escalares (5)

| Función                   | Retorna        | Descripción                                 |
|---------------------------|----------------|---------------------------------------------|
| `fn_porcentaje_avance`    | DECIMAL(5,2)   | % de tareas completadas de un proyecto      |
| `fn_estado_tarea`         | VARCHAR(25)    | Estado legible: Completada / Vencida / etc. |
| `fn_promedio_proyecto`    | DECIMAL(4,2)   | Promedio de calificaciones del proyecto     |
| `fn_tareas_pendientes`    | INT            | Cantidad de tareas pendientes de un alumno  |
| `fn_dias_restantes`       | INT            | Días hasta el límite de entrega             |

---

## Frontend

El archivo `frontend/index.html` es una aplicación **standalone** (sin dependencias externas instaladas). Incluye:

- 🔐 Pantalla de login y registro con validación
- 📊 Dashboard con estadísticas en tiempo real
- 📁 Vista de proyectos con barras de progreso
- ✅ Gestión de tareas con toggle interactivo
- 📰 **Sección de noticias** con Bento Grid dinámico (tarjetas de distintos tamaños y colores alternados)
- 👤 Perfil de usuario editable
- 🔔 Sistema de notificaciones toast

### Vista previa — Noticias (Bento Grid)

Las noticias se muestran en un grid con tarjetas que alternan:
- **Tamaños:** `big` (2×2), `wide` (2 columnas), normal (1×1)
- **Colores:** navy, blue, teal, sage, amber, rose, violet + versiones suaves
- **Animación:** entrada escalonada con `fadeUp` + hover con badge de categoría
- **Filtros:** Todas / Académico / Talleres / Infraestructura / Logros

---

## Setup rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/eduhub-platform.git
cd eduhub-platform
```

### 2. Ver el frontend (sin instalación)

```bash
# Opción A: abrir directamente en el navegador
open frontend/index.html         # macOS
start frontend/index.html        # Windows
xdg-open frontend/index.html     # Linux

# Opción B: servidor local rápido con Python
python3 -m http.server 3000 --directory frontend
# luego abre http://localhost:3000
```

### 3. Configurar la base de datos

```bash
# En MySQL Workbench:
# 1. Abre una conexión nueva
# 2. File → Open SQL Script → selecciona database/eduhub_crud_completo.sql
# 3. Ejecuta con Ctrl+Shift+Enter (ejecutar script completo, NO el rayo ⚡)

# O por CLI:
mysql -u root -p < database/eduhub_crud_completo.sql
```

> ⚠️ **Importante:** usa siempre **Ctrl+Shift+Enter** en Workbench para ejecutar el script completo de una vez. El botón de rayo ⚡ ejecuta línea por línea y rompe los bloques `DELIMITER $$`.

### 4. Verificar la instalación

```sql
USE eduhub_db;

-- Ver tablas creadas
SHOW TABLES;

-- Probar funciones
SELECT fn_porcentaje_avance(1), fn_estado_tarea(1), fn_dias_restantes(2);

-- Probar procedimientos
CALL sp_progreso_proyecto(1);
CALL sp_tareas_por_vencer(7);
```

### 5. Desplegar en Netlify (frontend)

1. Ve a [netlify.com](https://netlify.com) → **Add new site → Deploy manually**
2. Arrastra la carpeta `frontend/`
3. En 30 segundos tienes URL pública para compartir con el equipo

---

## Equipo

| Nombre | Rol en el proyecto | GitHub |
|--------|--------------------|--------|
| _(tu nombre)_ | Desarrollador principal | [@tu_usuario](https://github.com/tu_usuario) |
| _(compañero 1)_ | Base de datos | — |
| _(compañero 2)_ | Frontend | — |
| _(compañero 3)_ | Backend | — |

> 📝 Actualiza esta tabla con los nombres reales del equipo y sus usuarios de GitHub.

---

## Estado del proyecto

| Entregable                        | Estado        |
|-----------------------------------|---------------|
| Modelo relacional MySQL           | ✅ Completo   |
| CRUD completo (5 tablas)          | ✅ Completo   |
| 5 Procedimientos almacenados      | ✅ Completo   |
| 5 Funciones escalares             | ✅ Completo   |
| Frontend standalone               | ✅ Completo   |
| Documento parcial BD II           | ✅ Completo   |
| Backend Node.js + Express         | 🔄 En progreso |
| Autenticación JWT                 | 🔄 En progreso |
| Integración MongoDB (noticias)    | 🔄 En progreso |
| Despliegue en producción          | ⏳ Pendiente  |

---

## Requerimientos funcionales cubiertos

| RF    | Descripción                              | Operación SQL       |
|-------|------------------------------------------|---------------------|
| RF-01 | Gestión de usuarios                      | INSERT / UPDATE      |
| RF-02 | Autenticación por roles                  | SELECT + validación  |
| RF-03 | Gestión de proyectos                     | CRUD completo        |
| RF-04 | Asignación de estudiantes                | sp_asignar_estudiante|
| RF-05 | Gestión de tareas                        | CRUD completo        |
| RF-06 | Seguimiento de progreso                  | fn_porcentaje_avance |
| RF-07 | Evaluación de proyectos                  | INSERT evaluaciones  |
| RF-08 | Portal de noticias                       | MongoDB / HTML       |
| RF-09 | Consultas y reportes                     | sp_reporte_docente   |
| RF-10 | Notificaciones automáticas               | sp_tareas_por_vencer |

---

<div align="center">

**EduHub Platform** · Fundación Universitaria Konrad Lorenz · 2026  
Bases de Datos II · Proyecto Integrador

</div>
