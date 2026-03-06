// middleware/auth.js — Verificación de JWT en rutas protegidas
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware: verifica el token JWT del header Authorization
 * Header esperado: Authorization: Bearer <token>
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Acceso denegado. Token requerido.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // { id, nombre, email, rol }
    next();
  } catch (err) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Token inválido o expirado.',
    });
  }
}

/**
 * Middleware de rol: solo permite ciertos roles
 * Uso: roleMiddleware('admin') o roleMiddleware('docente', 'admin')
 */
function roleMiddleware(...roles) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ ok: false, mensaje: 'No autenticado.' });
    }
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        ok: false,
        mensaje: `Acceso denegado. Se requiere rol: ${roles.join(' o ')}`,
      });
    }
    next();
  };
}

module.exports = { authMiddleware, roleMiddleware };
