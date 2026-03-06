// routes/evaluaciones.js — CRUD evaluaciones (MySQL)
const express = require('express');
const { pool } = require('../config/mysql');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/evaluaciones — Listar evaluaciones
router.get('/', async (req, res) => {
  try {
    let query, params;

    if (req.usuario.rol === 'estudiante') {
      query = `
        SELECT e.id, e.calificacion, e.comentarios, e.fecha,
               p.titulo AS proyecto, u.nombre AS docente
        FROM evaluaciones e
        INNER JOIN proyectos p ON p.id = e.proyecto_id
        INNER JOIN usuarios  u ON u.id = e.docente_id
        INNER JOIN proyecto_estudiantes pe ON pe.proyecto_id = e.proyecto_id
        WHERE pe.usuario_id = ?
        ORDER BY e.fecha DESC`;
      params = [req.usuario.id];
    } else {
      query = `
        SELECT e.id, e.calificacion, e.comentarios, e.fecha,
               p.titulo AS proyecto, u.nombre AS docente,
               fn_promedio_proyecto(e.proyecto_id) AS promedio_proyecto
        FROM evaluaciones e
        INNER JOIN proyectos p ON p.id = e.proyecto_id
        INNER JOIN usuarios  u ON u.id = e.docente_id
        ORDER BY e.fecha DESC`;
      params = [];
    }

    const [rows] = await pool.query(query, params);
    res.json({ ok: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener evaluaciones.' });
  }
});

// GET /api/evaluaciones/proyecto/:id — Evaluaciones de un proyecto
router.get('/proyecto/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.id, e.calificacion, e.comentarios, e.fecha,
             u.nombre AS docente,
             fn_promedio_proyecto(e.proyecto_id) AS promedio_proyecto
      FROM evaluaciones e
      INNER JOIN usuarios u ON u.id = e.docente_id
      WHERE e.proyecto_id = ?
      ORDER BY e.fecha DESC`, [req.params.id]);

    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener evaluaciones.' });
  }
});

// POST /api/evaluaciones — Crear evaluación (docente/admin)
router.post('/', roleMiddleware('docente', 'admin'), async (req, res) => {
  const { proyecto_id, calificacion, comentarios } = req.body;

  if (!proyecto_id || calificacion === undefined) {
    return res.status(400).json({ ok: false, mensaje: 'proyecto_id y calificacion son obligatorios.' });
  }

  if (calificacion < 0 || calificacion > 10) {
    return res.status(400).json({ ok: false, mensaje: 'La calificación debe estar entre 0 y 10.' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO evaluaciones (proyecto_id, docente_id, calificacion, comentarios)
       VALUES (?, ?, ?, ?)`,
      [proyecto_id, req.usuario.id, calificacion, comentarios || null]
    );
    res.status(201).json({ ok: true, mensaje: 'Evaluación registrada.', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: 'Error al crear evaluación.' });
  }
});

// PUT /api/evaluaciones/:id — Actualizar evaluación (docente/admin)
router.put('/:id', roleMiddleware('docente', 'admin'), async (req, res) => {
  const { calificacion, comentarios } = req.body;

  if (calificacion !== undefined && (calificacion < 0 || calificacion > 10)) {
    return res.status(400).json({ ok: false, mensaje: 'La calificación debe estar entre 0 y 10.' });
  }

  try {
    const [result] = await pool.query(
      `UPDATE evaluaciones SET
         calificacion = COALESCE(?, calificacion),
         comentarios  = COALESCE(?, comentarios)
       WHERE id = ? AND docente_id = ?`,
      [calificacion, comentarios, req.params.id, req.usuario.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Evaluación no encontrada o sin permisos.' });
    }
    res.json({ ok: true, mensaje: 'Evaluación actualizada.' });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar.' });
  }
});

// DELETE /api/evaluaciones/:id — Eliminar (admin)
router.delete('/:id', roleMiddleware('admin'), async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM evaluaciones WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Evaluación no encontrada.' });
    }
    res.json({ ok: true, mensaje: 'Evaluación eliminada.' });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al eliminar.' });
  }
});

module.exports = router;
