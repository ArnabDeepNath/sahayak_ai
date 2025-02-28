function sendMessage() {
    const inputField = document.getElementById("chat-input");
    const chatBox = document.getElementById("chat-box");
    const message = inputField.value.trim();

    if (message) {
        // Display user message
        const userMessage = document.createElement("div");
        userMessage.textContent = message;
        userMessage.classList.add("message", "user-message");
        chatBox.appendChild(userMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
        inputField.value = "";

        // Show progress bar
        const progressContainer = document.createElement("div");
        progressContainer.classList.add("progress-container", "message", "bot-message");
        
        const progressBar = document.createElement("div");
        progressBar.classList.add("progress-bar");
        
        const progressText = document.createElement("div");
        progressText.classList.add("progress-text");
        progressText.textContent = "Generating response...";
        
        progressBar.appendChild(progressText);
        progressContainer.appendChild(progressBar);
        chatBox.appendChild(progressContainer);

        // Animate progress bar
        let progress = 0;
        const duration = 50000; // 75 seconds average
        const interval = 500; // Update every 0.5 seconds
        const steps = duration / interval;
        const increment = 100 / steps;
        
        const progressInterval = setInterval(() => {
            progress = Math.min(progress + increment, 99); // Cap at 99%
            progressBar.style.width = progress + "%";
            progressText.textContent = `Generating response... ${Math.round(progress)}%`;
        }, interval);

        // Call backend API
        fetch('https://api.sewasetu.assam.statedatacenter.in/sahayak/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Origin': 'https://arnabdeepnath.github.io'
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Clear progress bar animation
            clearInterval(progressInterval);
            chatBox.removeChild(progressContainer);
            
            // Format and display bot response
            const botMessage = document.createElement("div");
            let formattedResponse = data.response;
            // Remove thinking section
            formattedResponse = formattedResponse.replace(/<think>[\s\S]*?<\/think>\s*/i, '');
            // Remove response time information
            formattedResponse = formattedResponse.replace(/\s*Response time: [\d.]+ seconds\.?$/i, '');
            // Convert **text** to <strong>text</strong>
            formattedResponse = formattedResponse.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
            // Add line breaks
            formattedResponse = formattedResponse.replace(/\n/g, '<br>');
            
            botMessage.innerHTML = formattedResponse.trim();
            botMessage.classList.add("message", "bot-message");
            chatBox.appendChild(botMessage);
            chatBox.scrollTop = chatBox.scrollHeight;
        })
        .catch(error => {
            // Clear progress bar animation
            clearInterval(progressInterval);
            chatBox.removeChild(progressContainer);
            
            // Display error message
            const errorMessage = document.createElement("div");
            errorMessage.textContent = "Sorry, I encountered an error. Please try again.";
            errorMessage.classList.add("message", "bot-message", "error");
            chatBox.appendChild(errorMessage);
            chatBox.scrollTop = chatBox.scrollHeight;
        });
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}
