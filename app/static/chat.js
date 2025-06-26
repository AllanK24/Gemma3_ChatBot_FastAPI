document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("chat-form");
    const input = document.getElementById("user-message");
    const chatHistory = document.getElementById("chat-history");
    const userName = document.getElementById("user-name").value;
    const language = document.getElementById("user-language").value;
    
    // Get the new file attachment elements
    const fileInput = document.getElementById("file-attachment");
    const filePreviewContainer = document.getElementById("file-preview-container");
    const fileNameDisplay = document.getElementById("file-name-display");
    const clearFileBtn = document.getElementById("clear-file-btn");

    // --- File Attachment UI Logic ---

    // When a file is selected...
    fileInput.addEventListener("change", () => {
        if (fileInput.files.length > 0) {
            // Show the filename in the preview area
            fileNameDisplay.textContent = fileInput.files[0].name;
            filePreviewContainer.style.display = "flex";
        } else {
            // Hide the preview if no file is selected
            filePreviewContainer.style.display = "none";
        }
    });

    // When the 'x' button is clicked...
    clearFileBtn.addEventListener("click", () => {
        fileInput.value = ""; // This is how you programmatically clear a file input
        filePreviewContainer.style.display = "none";
    });


    // --- Form Submission Logic ---
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const message = input.value.trim();
        const file = fileInput.files[0];

        if (!message && !file) {
            return;
        }

        if (message) {
            appendMessage("user", message);
        }
        if (file) {
            appendMessage("user", `[Attaching file: ${file.name}]`);
        }
        
        // --- Reset UI immediately for better UX ---
        input.value = "";
        fileInput.value = "";
        filePreviewContainer.style.display = "none";
        // ---

        const formData = new FormData();
        formData.append('message', message);
        formData.append('user_name', userName);
        formData.append('language', language);
        if (file) {
            formData.append('file', file);
        }

        try {
            // Your existing fetch logic is already correct for FormData
            const response = await fetch("/chat/message", {
                method: "POST",
                body: formData 
            });

            const data = await response.json();

            if (response.ok) {
                appendMessage("ai", data.response);
            } else {
                const errorText = data.detail || "[Error from AI]";
                appendMessage("ai", errorText);
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
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
});