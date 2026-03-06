// routes/tareas.js — CRUD tareas (MySQL)
const express = require('express');
const { pool } = require('../config/mysql');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/tareas — Tareas del usuario logueado
router.get('/', async (req, res) => {
  try {
    let query, params;

    if (req.usuario.rol === 'estudiante') {
      query = `
        SELECT t.id, t.titulo, t.descripcion, t.prioridad,
               t.completada, t.fecha_limite,
               fn_estado_tarea(t.id) AS estado,
               p.titulo AS proyecto, p.id AS proyecto_id
        FROM tareas t
        INNER JOIN proyectos p ON p.id = t.proyecto_id
        WHERE t.asignado_a = ?
        ORDER BY t.completada ASC, t.fecha_limite ASC`;
      params = [req.usuario.id];
    } else {
      query = `
        SELECT t.id, t.titulo, t.descripcion, t.prioridad,
               t.completada, t.fecha_limite,
               fn_estado_tarea(t.id) AS estado,
               u.nombre AS estudiante,
               p.titulo AS proyecto, p.id AS proyecto_id
        FROM tareas t
        INNER JOIN usuarios  u ON u.id = t.asignado_a
        INNER JOIN proyectos p ON p.id = t.proyecto_id
        ORDER BY t.completada ASC, t.fecha_limite ASC`;
      params = [];
    }

    const [rows] = await pool.query(query, params);
    res.json({ ok: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener tareas.' });
  }
});

// GET /api/tareas/proyecto/:id — Tareas de un proyecto específico
router.get('/proyecto/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.id, t.titulo, t.prioridad, t.completada, t.fecha_limite,
             fn_estado_tarea(t.id) AS estado,
             u.nombre AS estudiante
      FROM tareas t
      INNER JOIN usuarios u ON u.id = t.asignado_a
      WHERE t.proyecto_id = ?
      ORDER BY t.completada ASC, t.prioridad DESC`, [req.params.id]);

    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener tareas.' });
  }
});

// POST /api/tareas — Crear tarea (docente/admin)
router.post('/', roleMiddleware('docente', 'admin'), async (req, res) => {
  const { proyecto_id, asignado_a, titulo, descripcion, prioridad = 'media', fecha_limite } = req.body;

  if (!proyecto_id || !asignado_a || !titulo || !fecha_limite) {
    return res.status(400).json({ ok: false, mensaje: 'proyecto_id, asignado_a, titulo y fecha_limite son obligatorios.' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO tareas (proyecto_id, asignado_a, titulo, descripcion, prioridad, fecha_limite)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [proyecto_id, asignado_a, titulo, descripcion || null, prioridad, fecha_limite]
    );
    res.status(201).json({ ok: true, mensaje: 'Tarea creada.', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: 'Error al crear tarea.' });
  }
});

// PATCH /api/tareas/:id/completar — Marcar completada
router.patch('/:id/completar', async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE tareas SET completada = NOT completada WHERE id = ?',
      [req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Tarea no encontrada.' });
    }
    res.json({ ok: true, mensaje: 'Estado de tarea actualizado.' });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar tarea.' });
  }
});

// PUT /api/tareas/:id — Actualizar tarea (docente/admin)
router.put('/:id', roleMiddleware('docente', 'admin'), async (req, res) => {
  const { titulo, descripcion, prioridad, fecha_limite, asignado_a } = req.body;
  try {
    const [result] = await pool.query(
      `UPDATE tareas SET
         titulo       = COALESCE(?, titulo),
         descripcion  = COALESCE(?, descripcion),
         prioridad    = COALESCE(?, prioridad),
         fecha_limite = COALESCE(?, fecha_limite),
         asignado_a   = COALESCE(?, asignado_a)
       WHERE id = ?`,
      [titulo, descripcion, prioridad, fecha_limite, asignado_a, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Tarea no encontrada.' });
    }
    res.json({ ok: true, mensaje: 'Tarea actualizada.' });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar.' });
  }
});

// DELETE /api/tareas/:id
router.delete('/:id', roleMiddleware('docente', 'admin'), async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM tareas WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Tarea no encontrada.' });
    }
    res.json({ ok: true, mensaje: 'Tarea eliminada.' });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al eliminar.' });
  }
});

module.exports = router;
