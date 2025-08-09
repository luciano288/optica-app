const Paciente = require('../models/Paciente');
const QRCode = require('qrcode');

exports.crearPaciente = async (req, res) => {
  try {
    const datos = req.body;
    const FRONTEND_URL = process.env.FRONTEND_URL || 'https://optica-app.onrender.com';
    const qrURL = `${FRONTEND_URL}/orden/${datos._id}`;
    const qrImage = await QRCode.toDataURL(qrURL);

    const nuevoPaciente = new Paciente({
      ...datos,
      codigoQr: qrImage,
    });

    await nuevoPaciente.save();
    res.status(201).json(nuevoPaciente);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear paciente' });
  }
};

exports.obtenerPaciente = async (req, res) => {
  try {
    const paciente = await Paciente.findOne({ _id: req.params.id });
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }
    res.json(paciente);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener paciente' });
  }
};

exports.obtenerTodosPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.find().sort({ fecha: -1 });
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
};
