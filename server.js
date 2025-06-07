const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API para eventos
app.get('/api/eventos', (req, res) => {
    const eventos = require('./public/data/eventos.json');
    res.json(eventos);
});

// GeoJSON por departamento
app.get('/geojson/:departamento', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'geojson', `${req.params.departamento}.geojson`);
    res.sendFile(filePath);
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});
