document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chat-messages');
    const messageInput = document.getElementById('mensaje');
    const sendButton = document.getElementById('enviar');
    const statusDiv = document.getElementById('connection-status');
    
    // Reemplaza esta URL con la que te dio ngrok
    const API_URL = 'https://5373-2806-103e-13-4b4e-455b-2cf0-5179-7020.ngrok-free.app';
    
    // Verificar conexión al inicio
    checkConnection();

    async function checkConnection() {
        try {
            const response = await fetch(API_URL);
            statusDiv.textContent = '🟢 Conectado';
            statusDiv.style.color = '#4CAF50';
        } catch (error) {
            statusDiv.textContent = '🔴 Desconectado';
            statusDiv.style.color = '#f44336';
        }
    }

    async function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        // Add user message to chat
        appendMessage('user', message);
        messageInput.value = '';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message
                })
            });

            const data = await response.json();
            appendMessage('assistant', data.response);
        } catch (error) {
            appendMessage('error', 'Error: No se pudo conectar con Ollama');
            console.error('Error:', error);
        }
    }

    function appendMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.textContent = content;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});
