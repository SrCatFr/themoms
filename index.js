const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos
app.use(express.static('public'));

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

// Para el despliegue en Vercel
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Exportar la app para Vercel
module.exports = app;
