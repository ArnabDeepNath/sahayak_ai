document.addEventListener('DOMContentLoaded', function() {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    chatForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        appendMessage('user', message);
        chatInput.value = '';

        try {
            const response = await fetch('https://api.sewasetu.assam.statedatacenter.in/sahayak/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Origin': 'https://arnabdeepnath.github.io',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            if (data.status === 'success') {
                let formattedResponse = formatResponse(data.response);
                appendMessage('bot', formattedResponse);
            } else {
                appendMessage('bot', 'Sorry, I encountered an error processing your request.');
            }
        } catch (error) {
            console.error('Error:', error);
            appendMessage('bot', 'Sorry, I cannot connect to the service at the moment. Please try again later.');
        }
    });

    function formatResponse(response) {
        if (!response) return 'No response received';
        
        // Remove the thinking part enclosed in <think> tags
        let cleanResponse = response.replace(/<think>[\s\S]*?<\/think>\s*/i, '');
        
        // Remove response time information
        cleanResponse = cleanResponse.replace(/\s*Response time: [\d.]+ seconds\.?$/i, '');
        
        // Convert **text** to <strong>text</strong>
        cleanResponse = cleanResponse.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        
        // Add line breaks for better readability
        cleanResponse = cleanResponse.replace(/\n/g, '<br>');
        
        // Remove any extra whitespace and trim
        return cleanResponse.trim() || 'No readable response received';
    }

    function appendMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.innerHTML = content;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});