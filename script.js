document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chat-messages');
    const messageInput = document.getElementById('mensaje');
    const sendButton = document.getElementById('enviar');

    async function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        // Add user message to chat
        appendMessage('user', message);
        messageInput.value = '';

        try {
            const response = await fetch('https://TU-URL-DE-NGROK.ngrok.io/api/chat', {
                // Reemplaza esta URL con la que te dio ngrok
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
