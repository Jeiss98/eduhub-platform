// config/mongodb.js — Conexión a MongoDB Atlas con Mongoose
const mongoose = require('mongoose');
require('dotenv').config();

async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB Atlas conectado — eduhub_noticias');
  } catch (err) {
    console.error('❌ Error MongoDB:', err.message);
    process.exit(1);
  }
}

// Eventos de conexión
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB desconectado');
});

module.exports = { connectMongo };
