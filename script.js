const input = document.getElementById('messageInput');
const messageContainer = document.getElementById('messageContainer');

function sendMessage() {
    const text = input.value.trim();

    if (text !== "") {
        const newMessage = document.createElement('div');
        newMessage.classList.add('message');
        
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Creates the HTML for the message
        newMessage.innerHTML = `
            <div class="avatar" style="background-color: #faa61a"></div>
            <div class="message-content">
                <h4>You <span>Today at ${timeString}</span></h4>
                <p>${text}</p>
            </div>
        `;

        messageContainer.appendChild(newMessage);
        messageContainer.scrollTop = messageContainer.scrollHeight;
        input.value = "";
    }
}

input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
