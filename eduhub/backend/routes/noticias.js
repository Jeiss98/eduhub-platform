// routes/noticias.js — CRUD noticias (MongoDB)
const express  = require('express');
const Noticia  = require('../models/Noticia');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// ─────────────────────────────────────────
// GET /api/noticias — Listar (público con filtros)
// Query params: ?categoria=academico&page=1&limit=9
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { categoria, page = 1, limit = 9 } = req.query;
    const filtro = { activa: true };
    if (categoria && categoria !== 'all') filtro.categoria = categoria;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [noticias, total] = await Promise.all([
      Noticia.find(filtro)
        .sort({ destacada: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v'),
      Noticia.countDocuments(filtro),
    ]);

    res.json({
      ok: true,
      data: noticias,
      total,
      pagina: parseInt(page),
      paginas: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener noticias.' });
  }
});

// GET /api/noticias/:id — Detalle y suma de vista
router.get('/:id', async (req, res) => {
  try {
    const noticia = await Noticia.findByIdAndUpdate(
      req.params.id,
      { $inc: { vistas: 1 } },
      { new: true, select: '-__v' }
    );
    if (!noticia) {
      return res.status(404).json({ ok: false, mensaje: 'Noticia no encontrada.' });
    }
    res.json({ ok: true, data: noticia });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener noticia.' });
  }
});

// POST /api/noticias — Crear (docente/admin)
router.post('/', authMiddleware, roleMiddleware('docente', 'admin'), async (req, res) => {
  const { titulo, contenido, categoria, emoji, destacada } = req.body;

  if (!titulo || !contenido) {
    return res.status(400).json({ ok: false, mensaje: 'Título y contenido son obligatorios.' });
  }

  try {
    const noticia = new Noticia({
      titulo,
      contenido,
      categoria: categoria || 'academico',
      emoji:     emoji     || '📌',
      destacada: destacada || false,
      autor: {
        nombre:   req.usuario.nombre,
        id_mysql: req.usuario.id,
      },
    });

    await noticia.save();
    res.status(201).json({ ok: true, mensaje: 'Noticia creada.', data: noticia });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, mensaje: 'Error al crear noticia.' });
  }
});

// PUT /api/noticias/:id — Actualizar (admin)
router.put('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const noticia = await Noticia.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!noticia) {
      return res.status(404).json({ ok: false, mensaje: 'Noticia no encontrada.' });
    }
    res.json({ ok: true, mensaje: 'Noticia actualizada.', data: noticia });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar.' });
  }
});

// DELETE /api/noticias/:id — Soft delete (admin)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const noticia = await Noticia.findByIdAndUpdate(
      req.params.id,
      { activa: false },
      { new: true }
    );
    if (!noticia) {
      return res.status(404).json({ ok: false, mensaje: 'Noticia no encontrada.' });
    }
    res.json({ ok: true, mensaje: 'Noticia desactivada.' });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al eliminar.' });
  }
});

module.exports = router;
