// seeds/seed_mongo.js — Datos de prueba para MongoDB (noticias)
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Noticia  = require('../models/Noticia');

const NOTICIAS = [
  {
    titulo:    'Semana de Proyectos Finales — Fechas confirmadas para Mayo 2026',
    contenido: 'La universidad ha confirmado que la Semana de Proyectos Finales se realizará del 11 al 15 de mayo de 2026. Todos los estudiantes deben tener sus repositorios actualizados y la documentación entregada antes del 8 de mayo.',
    categoria: 'academico',
    emoji:     '📅',
    autor:     { nombre: 'Prof. María García', id_mysql: 2 },
    destacada: true,
    vistas:    234,
  },
  {
    titulo:    'Taller gratuito de Docker para estudiantes — este viernes',
    contenido: 'El área de Infraestructura invita a todos los estudiantes al taller introductorio de Docker y contenedores. Viernes 10 de marzo, salón 301, de 2pm a 5pm. Cupos limitados, inscríbete por EduHub.',
    categoria: 'taller',
    emoji:     '🐳',
    autor:     { nombre: 'Admin Sistema', id_mysql: 1 },
    destacada: false,
    vistas:    189,
  },
  {
    titulo:    'Estudiantes de Ingeniería ganan Hackathon Nacional 2026',
    contenido: 'El equipo conformado por Ana López, Juan Martínez y Sofía Torres obtuvo el primer lugar en el Hackathon Nacional de Innovación Tecnológica con su proyecto de predicción de deserción estudiantil usando Machine Learning.',
    categoria: 'logro',
    emoji:     '🏆',
    autor:     { nombre: 'Admin Sistema', id_mysql: 1 },
    destacada: true,
    vistas:    891,
  },
  {
    titulo:    'Nuevo laboratorio de Inteligencia Artificial disponible para proyectos de grado',
    contenido: 'A partir del 1 de abril el laboratorio de IA estará disponible para proyectos de grado. Cuenta con 20 estaciones con GPU NVIDIA RTX 4090, acceso a frameworks como TensorFlow y PyTorch, y soporte de monitores especializados.',
    categoria: 'infra',
    emoji:     '🤖',
    autor:     { nombre: 'Admin Sistema', id_mysql: 1 },
    destacada: false,
    vistas:    412,
  },
  {
    titulo:    'Convocatoria semilleros de investigación 2026 — inscripciones abiertas',
    contenido: 'La Vicerrectoría de Investigaciones abre convocatoria para semilleros 2026. Los grupos seleccionados recibirán financiamiento de hasta $5.000.000 COP y acceso a laboratorios especializados. Fecha límite: 20 de marzo.',
    categoria: 'academico',
    emoji:     '📚',
    autor:     { nombre: 'Prof. María García', id_mysql: 2 },
    destacada: false,
    vistas:    321,
  },
  {
    titulo:    'Bootcamp intensivo de Python y Data Science — inscripciones abiertas',
    contenido: 'El Centro de Educación Continua ofrece un bootcamp de 40 horas en Python aplicado a Ciencia de Datos. Incluye pandas, numpy, matplotlib y sklearn. Del 20 de marzo al 5 de abril, modalidad híbrida.',
    categoria: 'taller',
    emoji:     '🐍',
    autor:     { nombre: 'Prof. Carlos Ruiz', id_mysql: 3 },
    destacada: false,
    vistas:    567,
  },
  {
    titulo:    'Migración completa a servidores cloud — acceso más rápido y estable',
    contenido: 'Completamos la migración de todos los servicios académicos a servidores cloud en AWS. Los tiempos de carga del portal mejoraron un 60%. EduHub, el campus virtual y la biblioteca digital ya operan desde la nueva infraestructura.',
    categoria: 'infra',
    emoji:     '☁️',
    autor:     { nombre: 'Admin Sistema', id_mysql: 1 },
    destacada: false,
    vistas:    298,
  },
  {
    titulo:    'Premio al Mejor Proyecto del Semestre — nominaciones abiertas',
    contenido: 'Ya están abiertas las nominaciones para el Premio Mejor Proyecto del Semestre 2026-1. Docentes y estudiantes pueden nominar proyectos a través de EduHub hasta el 15 de abril. La ceremonia de premiación será el 2 de mayo.',
    categoria: 'logro',
    emoji:     '🎓',
    autor:     { nombre: 'Admin Sistema', id_mysql: 1 },
    destacada: false,
    vistas:    445,
  },
  {
    titulo:    'Actualización del calendario académico — semana de receso modificada',
    contenido: 'Por disposición del Consejo Académico, la semana de receso de mitad de semestre queda modificada del 7 al 11 de abril (antes era del 14 al 18). Las actividades académicas regulares se reanudan el lunes 14 de abril.',
    categoria: 'academico',
    emoji:     '📝',
    autor:     { nombre: 'Admin Sistema', id_mysql: 1 },
    destacada: false,
    vistas:    673,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB conectado');

    await Noticia.deleteMany({});
    console.log('🗑️  Noticias anteriores eliminadas');

    const insertadas = await Noticia.insertMany(NOTICIAS);
    console.log(`✅ ${insertadas.length} noticias insertadas`);

    await mongoose.disconnect();
    console.log('✅ Seed completado');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en seed:', err.message);
    process.exit(1);
  }
}

seed();
