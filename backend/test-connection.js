const mongoose = require('mongoose');
const Paciente = require('./models/Paciente');

async function testConnection() {
  try {
    console.log('🔍 Probando conexión a MongoDB...');
    
    // Conectar a MongoDB
    await mongoose.connect('mongodb://localhost:27017/optica', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado a MongoDB exitosamente');
    
    // Verificar si hay pacientes en la base de datos
    const pacientes = await Paciente.find();
    console.log(`📊 Encontrados ${pacientes.length} pacientes en la base de datos`);
    
    if (pacientes.length > 0) {
      console.log('📋 Primer paciente:', {
        _id: pacientes[0]._id,
        paciente: pacientes[0].paciente,
        fecha: pacientes[0].fecha
      });
    }
    
    // Cerrar conexión
    await mongoose.connection.close();
    console.log('🔒 Conexión cerrada');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testConnection();
