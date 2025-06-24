(function () {
  const _encoded = [
    "bG9jYWxob3N0",              // "localhost" (any port)
    "ZXhhbXBsZS5jb20=",          // "example.com"
    "YW5vdGhlcmRvbWFpbi5jb20="   // "anotherdomain.com"
  ];

  const _allowedDomains = _encoded.map(atob);
  const _currentHost = location.hostname;

  if (_allowedDomains.includes(_currentHost)) {
    injectBotUI();
    console.log(`[CDN SCRIPT] Authorized host: ${_currentHost}`);
  } else {
    console.warn(`[CDN SCRIPT] Access denied — this script is blocked on: ${_currentHost}`);
  }

  function injectBotUI() {
    const style = document.createElement("style");
    style.textContent = `
      .chat-bot-ui {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 300px;
        height: 400px;
        background: white;
        color: black;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        border-radius: 16px;
        overflow: hidden;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        font-family: sans-serif;
      }

      .chat-bot-header {
        background: #1f2937;
        color: white;
        padding: 12px;
        font-weight: bold;
        cursor: move;
      }

      .chat-bot-body {
        flex: 1;
        padding: 12px;
        overflow-y: auto;
      }

      .chat-bot-input {
        border: none;
        padding: 10px;
        outline: none;
        border-top: 1px solid #ccc;
      }
    `;
    document.head.appendChild(style);

    const bot = document.createElement("div");
    bot.className = "chat-bot-ui";
    bot.innerHTML = `
      <div class="chat-bot-header">Localhost Bot</div>
      <div class="chat-bot-body" id="bot-log">
        <p>Hello from your local bot 👋</p>
      </div>
      <input class="chat-bot-input" placeholder="Type a message..." />
    `;
    document.body.appendChild(bot);

    // Draggable logic
    const header = bot.querySelector(".chat-bot-header");
    let isDragging = false, offsetX = 0, offsetY = 0;

    header.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - bot.getBoundingClientRect().left;
      offsetY = e.clientY - bot.getBoundingClientRect().top;
      document.body.style.userSelect = "none";
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      bot.style.left = `${e.clientX - offsetX}px`;
      bot.style.top = `${e.clientY - offsetY}px`;
      bot.style.right = "auto";
      bot.style.bottom = "auto";
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
      document.body.style.userSelect = "";
    });

    // Simple echo input
    const input = bot.querySelector(".chat-bot-input");
    const log = bot.querySelector("#bot-log");
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && input.value.trim()) {
        const msg = input.value.trim();
        const reply = document.createElement("p");
        reply.textContent = `🤖 Echo: ${msg}`;
        log.appendChild(reply);
        input.value = "";
        log.scrollTop = log.scrollHeight;
      }
    });
  }
})();
