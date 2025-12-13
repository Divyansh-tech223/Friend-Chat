// --- 1. SUPABASE CONFIGURATION ---
// Go to Supabase -> Settings -> API to find these:
const supabaseUrl = 'https://slwwsnatefymexmbbnkq.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsd3dzbmF0ZWZ5bWV4bWJibmtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNzExNjIsImV4cCI6MjA4MDk0NzE2Mn0.iMe8PG5dvezNBElJvj1qYH3ofdk8Ro23KCSgtztfYNU';

// Initialize Supabase
const client = supabase.createClient(supabaseUrl, supabaseKey);

const input = document.getElementById('messageInput');
const messageContainer = document.getElementById('messageContainer');

// --- 2. SEND MESSAGE FUNCTION ---
async function sendMessage() {
    const text = input.value.trim();

    if (text !== "") {
        // Send data to Supabase 'messages' table
        const { error } = await client
            .from('messages')
            .insert({ username: "User", content: text });

        if (error) {
            console.error("Error sending:", error);
            alert("Error sending message. Check console.");
        }
        
        input.value = "";
    }
}

// --- 3. DISPLAY MESSAGE FUNCTION ---
function displayMessage(username, text, time) {
    const newMessage = document.createElement('div');
    newMessage.classList.add('message');

    // Format time
    const dateObj = new Date(time);
    const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    newMessage.innerHTML = `
        <div class="avatar" style="background-color: #faa61a"></div>
        <div class="message-content">
            <h4>${username} <span>${timeString}</span></h4>
            <p>${text}</p>
        </div>
    `;

    messageContainer.appendChild(newMessage);
    // Auto-scroll to bottom
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// --- 4. LOAD PREVIOUS MESSAGES ---
async function loadMessages() {
    const { data, error } = await client
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

    if (data) {
        data.forEach(msg => {
            displayMessage(msg.username, msg.content, msg.created_at);
        });
    }
}

// --- 5. LISTEN FOR NEW MESSAGES (Realtime) ---
client
    .channel('public:messages')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        const newMessage = payload.new;
        displayMessage(newMessage.username, newMessage.content, newMessage.created_at);
    })
    .subscribe();

// Start by loading history
loadMessages();

// Event Listener for Enter key
input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
