// routes/proyectos.js — CRUD proyectos (MySQL)
const express = require('express');
const { pool } = require('../config/mysql');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// ─────────────────────────────────────────
// GET /api/proyectos — Listar proyectos
// (el estudiante solo ve los suyos; docente/admin ve todos)
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    let query, params;

    if (req.usuario.rol === 'estudiante') {
      query = `
        SELECT p.id, p.titulo, p.descripcion, p.fecha_inicio,
               p.fecha_limite, p.estado,
               u.nombre AS docente,
               fn_porcentaje_avance(p.id) AS avance_pct
        FROM proyectos p
        INNER JOIN usuarios u ON u.id = p.docente_id
        INNER JOIN proyecto_estudiantes pe ON pe.proyecto_id = p.id
        WHERE pe.usuario_id = ?
        ORDER BY p.fecha_limite ASC`;
      params = [req.usuario.id];
    } else {
      query = `
        SELECT p.id, p.titulo, p.descripcion, p.fecha_inicio,
               p.fecha_limite, p.estado,
               u.nombre AS docente,
               COUNT(DISTINCT pe.usuario_id) AS total_estudiantes,
               fn_porcentaje_avance(p.id) AS avance_pct
        FROM proyectos p
        INNER JOIN usuarios u ON u.id = p.docente_id
        LEFT  JOIN proyecto_estudiantes pe ON pe.proyecto_id = p.id
        GROUP BY p.id, p.titulo, p.descripcion, p.fecha_inicio,
                 p.fecha_limite, p.estado, u.nombre
        ORDER BY p.fecha_limite ASC`;
      params = [];
    }

    const [rows] = await pool.query(query, params);
    res.json({ ok: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener proyectos.' });
  }
});

// ─────────────────────────────────────────
// GET /api/proyectos/:id — Detalle con progreso
// ─────────────────────────────────────────
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [[proyecto]] = await pool.query(`
      SELECT p.*, u.nombre AS docente,
             fn_porcentaje_avance(p.id) AS avance_pct,
             fn_promedio_proyecto(p.id) AS promedio_nota
      FROM proyectos p
      INNER JOIN usuarios u ON u.id = p.docente_id
      WHERE p.id = ?`, [id]);

    if (!proyecto) {
      return res.status(404).json({ ok: false, mensaje: 'Proyecto no encontrado.' });
    }

    const [tareas] = await pool.query(`
      SELECT t.id, t.titulo, t.prioridad, t.completada, t.fecha_limite,
             u.nombre AS asignado_a, fn_estado_tarea(t.id) AS estado
      FROM tareas t
      INNER JOIN usuarios u ON u.id = t.asignado_a
      WHERE t.proyecto_id = ?
      ORDER BY t.completada ASC, t.prioridad DESC`, [id]);

    const [estudiantes] = await pool.query(`
      SELECT u.id, u.nombre, u.email, pe.fecha_ingreso
      FROM proyecto_estudiantes pe
      INNER JOIN usuarios u ON u.id = pe.usuario_id
      WHERE pe.proyecto_id = ?`, [id]);

    res.json({ ok: true, data: { ...proyecto, tareas, estudiantes } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener proyecto.' });
  }
});

// ─────────────────────────────────────────
// POST /api/proyectos — Crear proyecto (docente/admin)
// ─────────────────────────────────────────
router.post('/', roleMiddleware('docente', 'admin'), async (req, res) => {
  const { titulo, descripcion, fecha_inicio, fecha_limite } = req.body;

  if (!titulo || !fecha_inicio || !fecha_limite) {
    return res.status(400).json({ ok: false, mensaje: 'Título y fechas son obligatorios.' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO proyectos (docente_id, titulo, descripcion, fecha_inicio, fecha_limite)
       VALUES (?, ?, ?, ?, ?)`,
      [req.usuario.id, titulo, descripcion || null, fecha_inicio, fecha_limite]
    );
    res.status(201).json({ ok: true, mensaje: 'Proyecto creado.', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: 'Error al crear proyecto.' });
  }
});

// ─────────────────────────────────────────
// PUT /api/proyectos/:id — Actualizar proyecto
// ─────────────────────────────────────────
router.put('/:id', roleMiddleware('docente', 'admin'), async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, fecha_limite, estado } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE proyectos SET titulo = COALESCE(?, titulo),
              descripcion = COALESCE(?, descripcion),
              fecha_limite = COALESCE(?, fecha_limite),
              estado = COALESCE(?, estado)
       WHERE id = ?`,
      [titulo, descripcion, fecha_limite, estado, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Proyecto no encontrado.' });
    }
    res.json({ ok: true, mensaje: 'Proyecto actualizado.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar.' });
  }
});

// ─────────────────────────────────────────
// DELETE /api/proyectos/:id — Eliminar (admin)
// ─────────────────────────────────────────
router.delete('/:id', roleMiddleware('admin'), async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM proyectos WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Proyecto no encontrado.' });
    }
    res.json({ ok: true, mensaje: 'Proyecto eliminado.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: 'Error al eliminar.' });
  }
});

module.exports = router;

// ─────────────────────────────────────────
// POST /api/proyectos/:id/estudiantes — Asignar estudiante (usa SP)
// ─────────────────────────────────────────
router.post('/:id/estudiantes', roleMiddleware('docente', 'admin'), async (req, res) => {
  const { usuario_id } = req.body;
  if (!usuario_id) {
    return res.status(400).json({ ok: false, mensaje: 'usuario_id es obligatorio.' });
  }
  try {
    await pool.query('CALL sp_asignar_estudiante(?, ?)', [req.params.id, usuario_id]);
    res.status(201).json({ ok: true, mensaje: 'Estudiante asignado al proyecto.' });
  } catch (err) {
    // El SP lanza errores de negocio con SIGNAL SQLSTATE
    res.status(400).json({ ok: false, mensaje: err.message });
  }
});

// DELETE /api/proyectos/:id/estudiantes/:uid — Remover estudiante
router.delete('/:id/estudiantes/:uid', roleMiddleware('docente', 'admin'), async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM proyecto_estudiantes WHERE proyecto_id = ? AND usuario_id = ?',
      [req.params.id, req.params.uid]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Asignación no encontrada.' });
    }
    res.json({ ok: true, mensaje: 'Estudiante removido del proyecto.' });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al remover estudiante.' });
  }
});
