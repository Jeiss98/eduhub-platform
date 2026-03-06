// routes/auth.js — Login y Registro con JWT
const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { pool } = require('../config/mysql');
require('dotenv').config();

const router = express.Router();

// ─────────────────────────────────────────
// POST /api/auth/registro
// ─────────────────────────────────────────
router.post('/registro', async (req, res) => {
  const { nombre, email, password, rol = 'estudiante' } = req.body;

  // Validación básica
  if (!nombre || !email || !password) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Nombre, email y contraseña son obligatorios.',
    });
  }

  if (!['estudiante', 'docente', 'admin'].includes(rol)) {
    return res.status(400).json({ ok: false, mensaje: 'Rol inválido.' });
  }

  try {
    // Verificar email duplicado
    const [existe] = await pool.query(
      'SELECT id FROM usuarios WHERE email = ?', [email]
    );
    if (existe.length > 0) {
      return res.status(409).json({
        ok: false,
        mensaje: 'El correo ya está registrado.',
      });
    }

    // Hash de contraseña
    const hash = await bcrypt.hash(password, 10);

    // Insertar usuario
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hash, rol]
    );

    return res.status(201).json({
      ok: true,
      mensaje: 'Usuario registrado correctamente.',
      id: result.insertId,
    });
  } catch (err) {
    console.error('Error en registro:', err.message);
    return res.status(500).json({ ok: false, mensaje: 'Error del servidor.' });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Email y contraseña son obligatorios.',
    });
  }

  try {
    // Buscar usuario por email
    const [rows] = await pool.query(
      'SELECT id, nombre, email, password, rol, activo FROM usuarios WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas.' });
    }

    const usuario = rows[0];

    if (!usuario.activo) {
      return res.status(403).json({ ok: false, mensaje: 'Cuenta desactivada.' });
    }

    // Verificar contraseña
    const passwordOk = await bcrypt.compare(password, usuario.password);
    if (!passwordOk) {
      return res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas.' });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '24h' }
    );

    return res.json({
      ok: true,
      token,
      usuario: {
        id:     usuario.id,
        nombre: usuario.nombre,
        email:  usuario.email,
        rol:    usuario.rol,
      },
    });
  } catch (err) {
    console.error('Error en login:', err.message);
    return res.status(500).json({ ok: false, mensaje: 'Error del servidor.' });
  }
});

module.exports = router;
