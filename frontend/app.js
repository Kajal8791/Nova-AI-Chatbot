
(() => {
    // Check login
    const token = localStorage.getItem("novaAI_token");
    const savedUser = localStorage.getItem("novaAI_user");

    if (!token || !savedUser) {
        window.location.href = "auth.html";
        return;
    }

    let currentUser;

    try {
        currentUser = JSON.parse(savedUser);
    } catch (error) {
        localStorage.removeItem("novaAI_token");
        localStorage.removeItem("novaAI_user");
        window.location.href = "auth.html";
        return;
    }

    // API URLs
    const API_BASE = "http://localhost:8080";
    const CHAT_API = API_BASE + "/api/chat";
    const HISTORY_API = API_BASE + "/api/chats";

    // HTML elements
    const chatForm = document.getElementById("chatForm");
    const messageInput = document.getElementById("messageInput");
    const messages = document.getElementById("messages");
    const welcome = document.getElementById("welcome");
    const typing = document.getElementById("typing");
    const sendButton = document.getElementById("sendButton");
    const historyList = document.getElementById("historyList");
    const newChatButton = document.getElementById("newChat");


// =====================================
// USER PROFILE IN SIDEBAR
// =====================================

const sidebar = document.querySelector(".sidebar");
const logoutButton = document.getElementById("logoutButton");

if (sidebar && currentUser) {
    const profileCard = document.createElement("div");
    profileCard.className = "profile-card";

    const userName = currentUser.name || "Nova User";
    const userEmail = currentUser.email || "";

    const initials = userName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part.charAt(0).toUpperCase())
        .join("");

    const avatar = document.createElement("div");
    avatar.className = "profile-avatar";
    avatar.textContent = initials || "U";

    const details = document.createElement("div");
    details.className = "profile-details";

    const nameElement = document.createElement("div");
    nameElement.className = "profile-name";
    nameElement.textContent = userName;

    const emailElement = document.createElement("div");
    emailElement.className = "profile-email";
    emailElement.textContent = userEmail;

    details.appendChild(nameElement);
    details.appendChild(emailElement);

    profileCard.appendChild(avatar);
    profileCard.appendChild(details);

    if (logoutButton) {
        sidebar.insertBefore(profileCard, logoutButton);
    } else {
        sidebar.appendChild(profileCard);
    }
}

    // const logoutButton = document.getElementById("logoutButton");

    // Logout functionality
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("novaAI_token");
        localStorage.removeItem("novaAI_user");

        window.location.replace("auth.html");
    });

    // Chats now come from MySQL
    let chats = [];
    let activeChatId = null;

    // Automatically scroll to the latest message
    function scrollToLatest() {
        requestAnimationFrame(() => {
            messages.scrollTop = messages.scrollHeight;
        });
    }

    // Common API request function
    async function apiRequest(url, options = {}) {
        const currentToken = localStorage.getItem("novaAI_token");

        if (!currentToken) {
            window.location.href = "auth.html";
            throw new Error("Please login again.");
        }

        const response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + currentToken,
                ...(options.headers || {})
            }
        });

        if (response.status === 401) {
            localStorage.removeItem("novaAI_token");
            localStorage.removeItem("novaAI_user");
            window.location.href = "auth.html";
            throw new Error("Session expired. Please login again.");
        }

        if (response.status === 204) {
            if (!response.ok) {
                throw new Error("Request failed.");
            }
            return null;
        }

        let data = null;

        try {
            data = await response.json();
        } catch (error) {
            data = null;
        }

        if (!response.ok) {
            throw new Error(
                data?.message || data?.error || "Server request failed."
            );
        }

        return data;
    }

    // Escape HTML safely
    function escapeHTML(text) {
        return String(text).replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    // Format text
    function formatText(text) {
        let safe = escapeHTML(text);

        safe = safe.replace(/\r?\n/g, "\n");
        safe = safe.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        safe = safe.replace(/\*(.*?)\*/g, "<em>$1</em>");
        safe = safe.replace(/`([^`]+)`/g,
            "<code class='inline-code'>$1</code>");

        const lines = safe.split("\n");
        const result = [];
        let insideList = false;

        lines.forEach(line => {
            const bullet = line.match(/^\s*[-*]\s+(.*)$/);
            const numbered = line.match(/^\s*\d+\.\s+(.*)$/);

            if (bullet || numbered) {
                if (!insideList) {
                    result.push("<ul>");
                    insideList = true;
                }

                result.push(
                    `<li>${bullet ? bullet[1] : numbered[1]}</li>`
                );
                return;
            }

            if (insideList) {
                result.push("</ul>");
                insideList = false;
            }

            if (/^### /.test(line)) {
                result.push(`<h3>${line.substring(4)}</h3>`);
            } else if (/^## /.test(line)) {
                result.push(`<h2>${line.substring(3)}</h2>`);
            } else if (/^# /.test(line)) {
                result.push(`<h1>${line.substring(2)}</h1>`);
            } else if (/^---$/.test(line.trim())) {
                result.push("<hr>");
            } else {
                result.push(line);
            }
        });

        if (insideList) {
            result.push("</ul>");
        }

        return result.join("<br>");
    }

    // Format Markdown and code blocks
    function formatMarkdown(text) {
        const codeRegex =
            /```([a-zA-Z0-9_+#.-]*)[ \t]*\r?\n([\s\S]*?)```/g;

        let html = "";
        let lastIndex = 0;
        let match;

        while ((match = codeRegex.exec(String(text))) !== null) {
            html += formatText(text.substring(lastIndex, match.index));

            const language = match[1] || "text";
            const code = match[2]
                .replace(/\r\n/g, "\n")
                .replace(/\n$/, "");

            html += `
                <div class="code-block">
                    <div class="code-toolbar">
                        <span>${escapeHTML(language)}</span>
                        <button type="button" class="copy-code">Copy Code</button>
                        <button type="button" class="download-code">Download</button>
                    </div>
                    <pre><code data-language="${escapeHTML(language)}">${escapeHTML(code)}</code></pre>
                </div>
            `;

            lastIndex = codeRegex.lastIndex;
        }

        html += formatText(text.substring(lastIndex));

        return html;
    }

    // Get active chat
    function getActiveChat() {
        return chats.find(chat => chat.id === activeChatId);
    }

    // Render messages
    function renderMessages() {
        messages.innerHTML = "";

        const chat = getActiveChat();

        if (!chat || !chat.messages || chat.messages.length === 0) {
            messages.appendChild(welcome);
            welcome.style.display = "block";
            return;
        }

        welcome.style.display = "none";

        chat.messages.forEach(item => {
            addMessageElement(item.content, item.role);
        });
        scrollToLatest();
    }

    // Display message
    function addMessageElement(text, role) {
        const sender = role === "user" ? "user" : "bot";

        const message = document.createElement("div");
        message.className = `message ${sender}`;

        if (sender === "bot") {
            message.innerHTML = formatMarkdown(text);
        } else {
            message.textContent = text;
        }

        messages.appendChild(message);
        scrollToLatest();
    }

    // Render history
    function renderHistory() {
        historyList.innerHTML = "";

        chats.forEach(chat => {
            const item = document.createElement("div");
            item.className = "history-row";

            const openButton = document.createElement("button");
            openButton.className = "history-item";
            openButton.textContent = chat.title || "New Chat";

            if (chat.id === activeChatId) {
                openButton.classList.add("active");
            }

            openButton.addEventListener("click", async () => {
                await openChat(chat.id);
            });

            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-chat";
            deleteButton.textContent = "🗑️";
            deleteButton.title = "Delete chat";

            deleteButton.addEventListener("click", () => {
                deleteChat(chat.id);
            });

            item.appendChild(openButton);
            item.appendChild(deleteButton);
            historyList.appendChild(item);
        });
    }

    // Load chats from MySQL
    async function loadChats() {
        try {
            const data = await apiRequest(HISTORY_API);

            chats = Array.isArray(data)
                ? data.map(chat => ({
                    id: chat.id,
                    title: chat.title,
                    messages: []
                }))
                : [];

            renderHistory();

            if (chats.length > 0) {
                await openChat(chats[0].id);
            } else {
                activeChatId = null;
                renderMessages();
            }

        } catch (error) {
            console.error("Chat history loading error:", error);
            alert("Could not load chat history: " + error.message);
        }
    }

    // Open old chat and load its messages
    async function openChat(chatId) {
        activeChatId = chatId;

        typing.style.display = "none";
        renderHistory();

        const chat = getActiveChat();

        if (!chat) return;

        try {
            const data = await apiRequest(
                `${HISTORY_API}/${chatId}/messages`
            );

            chat.messages = Array.isArray(data) ? data : [];

            if (activeChatId === chatId) {
                renderMessages();
            }

        } catch (error) {
            console.error("Messages loading error:", error);
            alert("Could not open chat: " + error.message);
        }
    }

    // Create new chat in MySQL
    async function createChat(firstMessage) {
        const title = firstMessage.length > 28
            ? firstMessage.substring(0, 28) + "..."
            : firstMessage;

        const data = await apiRequest(HISTORY_API, {
            method: "POST",
            body: JSON.stringify({ title })
        });

        const chat = {
            id: data.id,
            title: data.title,
            messages: []
        };

        chats.unshift(chat);
        activeChatId = chat.id;

        renderHistory();
        renderMessages();

        return chat;
    }

    // Save message in MySQL
    async function saveMessage(chatId, content, role) {
        return await apiRequest(
            `${HISTORY_API}/${chatId}/messages`,
            {
                method: "POST",
                body: JSON.stringify({ content, role })
            }
        );
    }

    // Delete chat from MySQL
    async function deleteChat(chatId) {
        if (!confirm("Are you sure you want to delete this conversation?")) {
            return;
        }

        try {
            await apiRequest(`${HISTORY_API}/${chatId}`, {
                method: "DELETE"
            });

            chats = chats.filter(chat => chat.id !== chatId);

            if (activeChatId === chatId) {
                activeChatId = null;
            }

            typing.style.display = "none";
            renderHistory();
            renderMessages();

        } catch (error) {
            console.error("Delete chat error:", error);
            alert("Could not delete chat: " + error.message);
        }
    }

    // Download file
    function downloadFile(content, filename, type = "text/plain") {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    // File extension
    function getFileExtension(language) {
        const extensions = {
            java: "java",
            python: "py",
            py: "py",
            javascript: "js",
            js: "js",
            html: "html",
            css: "css",
            typescript: "ts",
            ts: "ts",
            json: "json",
            xml: "xml",
            sql: "sql",
            c: "c",
            cpp: "cpp",
            "c++": "cpp",
            csharp: "cs",
            cs: "cs",
            php: "php",
            bash: "sh",
            shell: "sh"
        };

        return extensions[language.toLowerCase()] || "txt";
    }

    // Copy and download code
    messages.addEventListener("click", async event => {
        const button = event.target.closest(".copy-code, .download-code");

        if (!button) return;

        const codeBlock = button.closest(".code-block");
        if (!codeBlock) return;

        const codeElement = codeBlock.querySelector("code");
        if (!codeElement) return;

        const language = codeElement.dataset.language || "text";
        const code = codeElement.textContent;

        if (button.classList.contains("copy-code")) {
            try {
                await navigator.clipboard.writeText(code);
                button.textContent = "Copied!";

                setTimeout(() => {
                    button.textContent = "Copy Code";
                }, 1500);

            } catch (error) {
                alert("Copy failed. Please copy manually.");
            }
        }

        if (button.classList.contains("download-code")) {
            const extension = getFileExtension(language);
            downloadFile(code, `NovaAI_Code.${extension}`);
        }
    });

    // Download complete conversation
    function downloadChat() {
        const chat = getActiveChat();

        if (!chat || !chat.messages || chat.messages.length === 0) {
            alert("There is no conversation to download.");
            return;
        }

        const content = chat.messages.map(item => {
            const role = item.role === "user" ? "You" : "Nova AI";
            return `${role}:\n${item.content}\n`;
        }).join("\n--------------------\n\n");

        downloadFile(content, "NovaAI_Chat.txt");
    }

    // Send message
    async function sendMessage(text) {
        text = text.trim();

        if (!text || sendButton.disabled) return;

        sendButton.disabled = true;
        messageInput.value = "";
        typing.style.display = "block";

        try {
            let chat = getActiveChat();

            if (!chat) {
                chat = await createChat(text);
            }

            const chatId = chat.id;

            // Save user message in MySQL
            const savedUserMessage = await saveMessage(
                chatId,
                text,
                "user"
            );

            chat.messages.push(savedUserMessage);

            if (activeChatId === chatId) {
                renderMessages();
            }

            renderHistory();

            // Ask Groq AI
            const data = await apiRequest(CHAT_API, {
                method: "POST",
                body: JSON.stringify({ message: text })
            });

            const reply = data.reply || "No reply received.";

            // Save Nova AI reply in MySQL
            const savedBotMessage = await saveMessage(
                chatId,
                reply,
                "assistant"
            );

            chat.messages.push(savedBotMessage);

            if (activeChatId === chatId) {
                renderMessages();
            }

        } catch (error) {
            console.error("Nova AI Error:", error);

            alert("Message could not be completed: " + error.message);

        } finally {
            typing.style.display = "none";
            sendButton.disabled = false;
            messageInput.focus();
        }
    }

    // Form submit
    chatForm.addEventListener("submit", event => {
        event.preventDefault();
        sendMessage(messageInput.value);
    });

    // Welcome suggestions
    document.querySelectorAll(".suggestion").forEach(button => {
        button.addEventListener("click", () => {
            sendMessage(button.textContent);
        });
    });

    // New chat button
    newChatButton.addEventListener("click", () => {
        activeChatId = null;
        typing.style.display = "none";

        renderMessages();
        renderHistory();

        messageInput.focus();
    });

    // Start application
    loadChats();

})();

// =====================================
// MOBILE SIDEBAR MENU
// =====================================

const mobileMenuButton = document.getElementById("menuToggle");
const mobileSidebar = document.querySelector(".sidebar");
const mobileOverlay = document.getElementById("sidebarOverlay");

function openMobileSidebar() {
    if (!mobileSidebar || !mobileOverlay || !mobileMenuButton) return;

    mobileSidebar.classList.add("open");
    mobileOverlay.classList.add("show");
    mobileMenuButton.setAttribute("aria-expanded", "true");
}

function closeMobileSidebar() {
    if (!mobileSidebar || !mobileOverlay || !mobileMenuButton) return;

    mobileSidebar.classList.remove("open");
    mobileOverlay.classList.remove("show");
    mobileMenuButton.setAttribute("aria-expanded", "false");
}

if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", () => {
        if (mobileSidebar.classList.contains("open")) {
            closeMobileSidebar();
        } else {
            openMobileSidebar();
        }
    });
}

if (mobileOverlay) {
    mobileOverlay.addEventListener("click", closeMobileSidebar);
}

// Close menu after selecting New Chat
if (newChatButton) {
    newChatButton.addEventListener("click", closeMobileSidebar);
}

// Close menu after selecting a chat from history
const historyContainer = document.getElementById("historyList");

if (historyContainer) {
    historyContainer.addEventListener("click", (event) => {
        if (event.target.closest("button, .history-item, .chat-item")) {
            closeMobileSidebar();
        }
    });
}

// Close menu with Escape key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMobileSidebar();
    }
});

// Close mobile sidebar when switching to desktop
window.addEventListener("resize", () => {
    if (window.innerWidth > 650) {
        closeMobileSidebar();
    }
});