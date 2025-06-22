document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("chat-form");
    const input = document.getElementById("user-message");
    const chatHistory = document.getElementById("chat-history");
    const userName = document.getElementById("user-name").value;
    const language = document.getElementById("user-language").value;

    form.addEventListener("submit", async function (e) {
        e.preventDefault(); // prevent page reload

        const message = input.value.trim();
        if (!message) return;

        // Show user message in chat
        appendMessage("user", message);
        input.value = "";

        try {
            const response = await fetch("/chat/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: message,
                    user_name: userName,
                    language: language
                })
            });

            const data = await response.json();

            if (response.ok) {
                appendMessage("ai", data.response);
            } else {
                appendMessage("ai", "[Error from AI]");
            }
        } catch (err) {
            console.error("Chat error:", err);
            appendMessage("ai", "[Server error]");
        }
    });

    function appendMessage(sender, text) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message", sender);
        msgDiv.innerText = text;
        chatHistory.appendChild(msgDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight; // auto-scroll
    }
});
