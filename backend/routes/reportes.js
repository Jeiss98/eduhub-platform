// routes/reportes.js — Estadísticas y reportes (MySQL SPs + funciones)
const express = require('express');
const { pool } = require('../config/mysql');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/reportes/docente — Reporte del docente (usa SP)
router.get('/docente', roleMiddleware('docente', 'admin'), async (req, res) => {
  try {
    const [rows] = await pool.query('CALL sp_reporte_docente(?)', [req.usuario.id]);
    res.json({ ok: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al generar reporte.' });
  }
});

// GET /api/reportes/tareas-por-vencer?dias=7 — Tareas próximas (usa SP)
router.get('/tareas-por-vencer', async (req, res) => {
  const dias = parseInt(req.query.dias) || 7;
  try {
    const [rows] = await pool.query('CALL sp_tareas_por_vencer(?)', [dias]);
    res.json({ ok: true, data: rows[0], dias });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener tareas por vencer.' });
  }
});

// GET /api/reportes/progreso/:proyecto_id — Progreso detallado de un proyecto (usa SP)
router.get('/progreso/:proyecto_id', async (req, res) => {
  try {
    const [rows] = await pool.query('CALL sp_progreso_proyecto(?)', [req.params.proyecto_id]);
    res.json({ ok: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener progreso.' });
  }
});

// GET /api/reportes/dashboard — Estadísticas generales para el dashboard
router.get('/dashboard', async (req, res) => {
  try {
    let stats = {};

    if (req.usuario.rol === 'estudiante') {
      const [[resumen]] = await pool.query(`
        SELECT
          COUNT(DISTINCT pe.proyecto_id)             AS proyectos_activos,
          COUNT(t.id)                                 AS total_tareas,
          SUM(t.completada)                           AS tareas_completadas,
          fn_tareas_pendientes(?)                     AS tareas_pendientes
        FROM proyecto_estudiantes pe
        LEFT JOIN tareas t ON t.asignado_a = ?
        WHERE pe.usuario_id = ?`, [req.usuario.id, req.usuario.id, req.usuario.id]);
      stats = resumen;
    } else {
      const [[resumen]] = await pool.query(`
        SELECT
          COUNT(DISTINCT p.id)     AS total_proyectos,
          COUNT(DISTINCT u.id)     AS total_estudiantes,
          COUNT(t.id)              AS total_tareas,
          SUM(t.completada)        AS tareas_completadas,
          AVG(e.calificacion)      AS promedio_general
        FROM proyectos p
        LEFT JOIN proyecto_estudiantes pe ON pe.proyecto_id = p.id
        LEFT JOIN usuarios u ON u.id = pe.usuario_id
        LEFT JOIN tareas t ON t.proyecto_id = p.id
        LEFT JOIN evaluaciones e ON e.proyecto_id = p.id
        WHERE p.docente_id = ? OR ? = 'admin'`,
        [req.usuario.id, req.usuario.rol]);
      stats = resumen;
    }

    res.json({ ok: true, data: stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener estadísticas.' });
  }
});

module.exports = router;
