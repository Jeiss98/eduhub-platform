#!/bin/bash
# ══════════════════════════════════════════════════════════
#  SETUP.sh — EduHub Platform
#  Fundación Universitaria Konrad Lorenz · Bases de Datos II
# ══════════════════════════════════════════════════════════

echo ""
echo "╔════════════════════════════════════════╗"
echo "║     EduHub Platform — Setup Rápido     ║"
echo "╚════════════════════════════════════════╝"
echo ""

# ──────────────────────────────────────────
# PASO 1: Ver el frontend standalone
# (NO necesita instalar nada)
# ──────────────────────────────────────────
echo "📌 OPCIÓN A — Frontend standalone (sin instalación):"
echo "   Windows : doble clic en  frontend/index.html"
echo "   macOS   : open frontend/index.html"
echo "   Linux   : xdg-open frontend/index.html"
echo ""
echo "   O con servidor local (Python):"
echo "   python3 -m http.server 3000 --directory frontend"
echo "   → Abre http://localhost:3000"
echo ""

# ──────────────────────────────────────────
# PASO 2: Base de datos MySQL
# ──────────────────────────────────────────
echo "📌 PASO 2 — Base de datos MySQL:"
echo "   En MySQL Workbench:"
echo "   1. Abre una conexión nueva"
echo "   2. File → Open SQL Script"
echo "   3. Selecciona: database/eduhub_crud_completo.sql"
echo "   4. Ejecuta con Ctrl+Shift+Enter"
echo "      ⚠️  NO uses el botón ⚡ rayo (falla con DELIMITER)"
echo ""
echo "   O por CLI:"
echo "   mysql -u root -p < database/eduhub_crud_completo.sql"
echo ""

# ──────────────────────────────────────────
# PASO 3: Configurar el backend
# ──────────────────────────────────────────
echo "📌 PASO 3 — Configurar el backend Node.js:"
echo ""
echo "   cd backend"
echo "   cp .env.example .env"
echo "   → Edita .env con tus datos reales de MySQL y MongoDB Atlas"
echo ""
echo "   npm install"
echo "   npm run dev"
echo "   → API disponible en http://localhost:3000"
echo "   → Prueba: http://localhost:3000/api/health"
echo ""

# ──────────────────────────────────────────
# PASO 4 (opcional): React Dashboard
# ──────────────────────────────────────────
echo "📌 PASO 4 (opcional) — React Dashboard:"
echo ""
echo "   cd src"
echo "   npm install"
echo "   npm run dev"
echo "   → Abre http://localhost:5173"
echo ""

# ──────────────────────────────────────────
# PASO 5: Seed MongoDB (noticias de prueba)
# ──────────────────────────────────────────
echo "📌 PASO 5 — Cargar noticias de prueba en MongoDB:"
echo ""
echo "   cd backend"
echo "   npm run seed"
echo "   → Inserta 9 noticias de ejemplo en MongoDB Atlas"
echo ""

# ──────────────────────────────────────────
# PASO 6: Control de versiones
# ──────────────────────────────────────────
echo "📌 PASO 6 — Crear tu rama de trabajo:"
echo ""
echo "   git checkout -b feature/tu-nombre-funcionalidad"
echo "   # Ejemplo: git checkout -b feature/carlos-evaluaciones"
echo ""
echo "   git add ."
echo "   git commit -m \"feat(modulo): descripcion breve\""
echo "   git push origin feature/tu-nombre-funcionalidad"
echo ""
echo "   Luego abre un Pull Request hacia la rama 'dev'"
echo "   Lee CONTRIBUTING.md para la convención de commits"
echo ""
echo "══════════════════════════════════════════"
echo "  Listo. Lee README.md para más detalles."
echo "══════════════════════════════════════════"
