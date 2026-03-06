// models/Noticia.js — Schema Mongoose para noticias (MongoDB)
const mongoose = require('mongoose');

const NoticiaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      maxlength: [200, 'Máximo 200 caracteres'],
    },
    contenido: {
      type: String,
      required: [true, 'El contenido es obligatorio'],
    },
    categoria: {
      type: String,
      enum: ['academico', 'taller', 'infra', 'logro'],
      default: 'academico',
    },
    emoji: {
      type: String,
      default: '📌',
    },
    autor: {
      nombre: { type: String, required: true },
      id_mysql: { type: Number }, // referencia al id de usuarios en MySQL
    },
    vistas: {
      type: Number,
      default: 0,
    },
    destacada: {
      type: Boolean,
      default: false,
    },
    activa: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // agrega createdAt y updatedAt automáticamente
  }
);

// Índices para búsqueda rápida
NoticiaSchema.index({ categoria: 1 });
NoticiaSchema.index({ createdAt: -1 });
NoticiaSchema.index({ titulo: 'text', contenido: 'text' }); // búsqueda full-text

module.exports = mongoose.model('Noticia', NoticiaSchema);
