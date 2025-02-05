const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Añadir ruta GET para verificación de conexión
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

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
