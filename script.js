document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chat-messages');
    const messageInput = document.getElementById('mensaje');
    const sendButton = document.getElementById('enviar');
    const statusDiv = document.getElementById('connection-status');
    
    // Cambiar a tu dominio permanente de ngrok
    const API_BASE_URL = 'http://ikka.duckdns.org:3001';
    const API_CHAT_URL = `${API_BASE_URL}/api/chat`;
    
    // Verificar conexión al inicio
    checkConnection();

    async function checkConnection() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/chat`);
            const data = await response.json();
            if (data.status === 'online') {
                statusDiv.textContent = '🟢 Conectado';
                statusDiv.style.color = '#4CAF50';
            }
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
            const response = await fetch(API_CHAT_URL, {
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
