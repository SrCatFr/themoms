const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Conexión MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Modelo para los jugadores
const Player = mongoose.model('Player', {
    name: String,
    weight: Number,
    level: Number,
    lastUpdated: { type: Date, default: Date.now }
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rutas específicas para archivos estáticos
app.get('/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'styles.css'));
});

app.get('/script.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'script.js'));
});

// Ruta para imágenes
app.get('/images/:folder/:file', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'images', req.params.folder, req.params.file));
});

// Obtener leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        const leaders = await Player.find()
            .sort({ weight: -1 })
            .limit(10);
        res.json(leaders);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener leaderboard' });
    }
});

// Guardar/actualizar progreso
app.post('/api/save', async (req, res) => {
    try {
        const { name, weight, level } = req.body;
        
        await Player.findOneAndUpdate(
            { name },
            { name, weight, level, lastUpdated: Date.now() },
            { upsert: true }
        );
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar progreso' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
