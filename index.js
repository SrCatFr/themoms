const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos desde la carpeta public
app.use(express.static('public'));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Para el despliegue en Vercel
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Exportar la app para Vercel
module.exports = app;
