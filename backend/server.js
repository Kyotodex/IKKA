const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de CORS más permisiva
app.use(cors({
    origin: [
        'http://IKKA.duckdns.org:3001',
        'http://localhost:8000',
        'http://localhost:3001'
    ],
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

// Middleware para logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Añadir verificación básica de seguridad
app.use((req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.API_KEY) {
        res.status(401).json({ error: 'No autorizado' });
        return;
    }
    next();
});

app.get('/', (req, res) => {
    res.json({ status: 'online', message: 'IKKA Backend is running' });
});

// Ruta para verificar estado
app.get('/api/chat', (req, res) => {
    res.json({ status: 'online' });
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "deepseek-r1:1.5b",
                prompt: message,
                stream: false
            })
        });

        const data = await ollamaResponse.json();
        res.json({ response: data.response });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal!' });
});

// Cambiar el mensaje de inicio
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor backend corriendo en puerto ${PORT}`);
    console.log(`Accesible vía:`);
    console.log(`- Local: http://localhost:${PORT}`);
    console.log(`- Red: http://0.0.0.0:${PORT}`);
});
