# SETUP RÁPIDO — EduHub Platform
# Copia y pega estos comandos en tu terminal paso a paso

# ──────────────────────────────────────────
# PASO 1: Clonar el repositorio
# ──────────────────────────────────────────
git clone https://github.com/TU_USUARIO/eduhub-platform.git
cd eduhub-platform

# ──────────────────────────────────────────
# PASO 2: Ver el frontend (sin instalar nada)
# ──────────────────────────────────────────
# Windows: doble clic en frontend/index.html
# macOS:
open frontend/index.html

# O con servidor local (Python ya viene instalado):
python3 -m http.server 3000 --directory frontend
# Luego abre: http://localhost:3000

# ──────────────────────────────────────────
# PASO 3: Base de datos en MySQL Workbench
# ──────────────────────────────────────────
# 1. Abre MySQL Workbench
# 2. Abre una conexión nueva (importante: conexión fresca)
# 3. File → Open SQL Script
# 4. Selecciona: database/eduhub_crud_completo.sql
# 5. Ejecuta con: Ctrl + Shift + Enter
#    ⚠️  NO uses el botón rayo ⚡ (falla con DELIMITER $$)

# O por línea de comandos:
mysql -u root -p < database/eduhub_crud_completo.sql

# ──────────────────────────────────────────
# PASO 4: Verificar que todo funciona
# ──────────────────────────────────────────
# En MySQL Workbench ejecuta:
#
#   USE eduhub_db;
#   SHOW TABLES;
#   SELECT fn_porcentaje_avance(1);
#   CALL sp_progreso_proyecto(1);

# ──────────────────────────────────────────
# PASO 5: Crear tu rama de trabajo
# ──────────────────────────────────────────
git checkout -b feature/tu-nombre-funcionalidad

# Ejemplo:
git checkout -b feature/carlos-backend-auth
git checkout -b feature/sofia-frontend-tareas

# ──────────────────────────────────────────
# PASO 6: Guardar y subir cambios
# ──────────────────────────────────────────
git add .
git commit -m "feat(modulo): descripcion de lo que hiciste"
git push origin feature/tu-nombre-funcionalidad

# Luego abre un Pull Request en GitHub hacia la rama 'dev'
# Lee CONTRIBUTING.md para la convención de commits
