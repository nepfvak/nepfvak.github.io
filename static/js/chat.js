console.log("✅ Chat.js loaded (streaming)");

// Elements
const chatBubble = document.getElementById("chat-bubble");
const chatBox = document.getElementById("chat-box");
const sendBtn = document.getElementById("send");
const inputEl = document.getElementById("prompt");
const chatBody = document.getElementById("chat-body");

// Toggle chat
chatBubble?.addEventListener("click", () => {
  chatBox.classList.toggle("hidden");
  chatBox.style.zIndex = "9999";
  if (!chatBox.classList.contains("hidden")) inputEl?.focus();
});

// Append helper
function appendMsg(cls, text) {
  const div = document.createElement("div");
  div.className = cls;
  div.textContent = text;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
  return div;
}

// Streaming send
async function sendMessage() {
  const prompt = (inputEl.value || "").trim();
  if (!prompt) return;

  appendMsg("user-msg", "You: " + prompt);
  inputEl.value = "";

  const botDiv = appendMsg("bot-msg", "Gemini: ");
  botDiv.classList.add("typing");

  try {
    const res = await fetch("/ask_stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let full = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      full += chunk;
      botDiv.textContent = "Gemini: " + full;
      chatBody.scrollTop = chatBody.scrollHeight;
    }
    botDiv.classList.remove("typing");
  } catch (err) {
    botDiv.classList.remove("typing");
    botDiv.textContent = "Gemini: (Error contacting server)";
    console.error("Stream error:", err);
  }
}

sendBtn?.addEventListener("click", sendMessage);
inputEl?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") { e.preventDefault(); sendMessage(); }
});
