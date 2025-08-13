const express = require('express');
const router = express.Router();
const controller = require('../controllers/pacienteController');
const { login } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/auth/login', login);

router.post('/pacientes', verifyToken, controller.crearPaciente);
router.get('/pacientes', verifyToken, controller.obtenerTodosPacientes);
router.get('/pacientes/:id', controller.obtenerPaciente);
router.delete('/pacientes/:id', verifyToken, controller.eliminarPaciente);

module.exports = router;
