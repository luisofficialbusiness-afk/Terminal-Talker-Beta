const messageInput = document.getElementById("terminal-input");
const messagesContainer = document.getElementById("messages");
const typingIndicator = document.getElementById("typing-indicator");
const creditsDiv = document.getElementById("credits");

let username = "User";
let role = "user"; // "user", "beta", "early", "admin", "owner"

// Sidebar
function setTheme(themeName){ document.body.className = themeName; }
function showCredits(){ creditsDiv.classList.remove("hidden"); }
function hideCredits(){ creditsDiv.classList.add("hidden"); }

// Typing indicator
let typingTimeout;
messageInput.addEventListener("input", async () => {
  fetch("/api/typing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username }) });
  typingIndicator.classList.remove("hidden");
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => { typingIndicator.classList.add("hidden"); }, 1000);
});

// Send message
messageInput.addEventListener("keydown", async (e) => {
  if(e.key === "Enter" && messageInput.value.trim() !== ""){
    const msg = messageInput.value.trim();
    await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: msg, username, role }) });
    messageInput.value = "";
    fetchMessages();
  }
});

// Fetch messages
async function fetchMessages(){
  const res = await fetch("/api/messages");
  const data = await res.json();
  messagesContainer.innerHTML = "";
  data.forEach(m=>{
    const msgEl = document.createElement("div");
    msgEl.className = `terminal-msg ${m.role||"user"}`;
    let badge = m.role ? `[${m.role.toUpperCase()}] ` : "";
    msgEl.innerHTML = `<span class="badge">${badge}</span>${m.username}: ${m.message}`;
    if(m.username==="System" && m.role==="owner"){ msgEl.style.color="#ff0"; msgEl.style.fontWeight="bold"; }
    messagesContainer.appendChild(msgEl);
  });
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Polling
setInterval(fetchMessages, 2000);
setInterval(async ()=>{
  const res = await fetch("/api/typing");
  const data = await res.json();
  typingIndicator.classList.toggle("hidden", data.typing.length===0);
}, 500);
fetchMessages();
