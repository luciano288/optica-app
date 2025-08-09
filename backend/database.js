const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Usar MongoDB Atlas o localhost
    const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/optica';
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('🟢 Conectado a MongoDB');
  } catch (error) {
    console.error('🔴 Error al conectar con MongoDB', error);
    process.exit(1);
  }
};

module.exports = connectDB;
