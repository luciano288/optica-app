const mongoose = require('mongoose');

const PrescripcionSchema = new mongoose.Schema({
  Esf: String,
  Cil: String,
  Eje: String,
  Ad: String,
  DNP: String,
  Alt: String,
});

const PacienteSchema = new mongoose.Schema({
  _id: String, // DNI o número de orden
  fecha: String,
  paciente: String,
  fechaNacimiento: String,
  celular: String,
  email: String,
  optica: String,
  doctor: String,
  prescripcion: {
    OD: PrescripcionSchema,
    OI: PrescripcionSchema,
  },
  comentario: String,
  codigoQr: String,
});

module.exports = mongoose.model('Paciente', PacienteSchema);
