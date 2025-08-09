const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '8h';

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ sub: user._id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ token });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

exports.ensureAdminSeed = async () => {
  try {
    const existing = await User.findOne({ username: 'admin' });
    if (!existing) {
      const passwordHash = await bcrypt.hash('optica123', 10);
      await User.create({ username: 'admin', passwordHash });
      console.log('🟢 Usuario admin creado');
    }
  } catch (e) {
    console.error('Error asegurando usuario admin:', e.message);
  }
};


