const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./database');
const { ensureAdminSeed } = require('./controllers/authController');
const pacienteRoutes = require('./routes/pacienteRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://optica-app.onrender.com';

connectDB();
ensureAdminSeed();

app.use(cors({ origin: [FRONTEND_URL], methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'], allowedHeaders: ['Content-Type','Authorization'] }));
app.use(bodyParser.json({ limit: '200kb' }));
app.use('/api', pacienteRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
