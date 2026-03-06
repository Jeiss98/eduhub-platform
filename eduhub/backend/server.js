// server.js — Servidor principal EduHub
require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const { testConnection } = require('./config/mysql');
const { connectMongo }   = require('./config/mongodb');

// Rutas
const authRoutes      = require('./routes/auth');
const proyectosRoutes = require('./routes/proyectos');
const tareasRoutes    = require('./routes/tareas');
const noticiasRoutes  = require('./routes/noticias');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares globales ─────────────────
app.use(cors({
  origin:  process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Rutas ───────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/tareas',    tareasRoutes);
app.use('/api/noticias',  noticiasRoutes);

// ─── Health check ────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    mensaje: 'EduHub API funcionando',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ─── Ruta no encontrada ──────────────────
app.use((req, res) => {
  res.status(404).json({ ok: false, mensaje: `Ruta ${req.originalUrl} no encontrada.` });
});

// ─── Arranque ────────────────────────────
async function start() {
  await testConnection();  // MySQL
  await connectMongo();    // MongoDB Atlas
  app.listen(PORT, () => {
    console.log(`\n🚀 EduHub API corriendo en http://localhost:${PORT}`);
    console.log(`   Endpoints disponibles:`);
    console.log(`   POST  /api/auth/login`);
    console.log(`   POST  /api/auth/registro`);
    console.log(`   GET   /api/proyectos`);
    console.log(`   GET   /api/tareas`);
    console.log(`   GET   /api/noticias`);
    console.log(`   GET   /api/health\n`);
  });
}

start();
